import { Order } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createOrder, confirmOrder } from '../services/orderService.js';
import { restoreStock } from '../services/stockService.js';
import { PAYMENT_METHOD, ORDER_STATUS } from '../utils/constants.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js'; // <-- Added

// POST /api/orders
// body: { shippingAddress, paymentMethod, couponCode? }
export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode = '' } = req.body;

  if (!shippingAddress || !shippingAddress.fullName) {
    throw ApiError.badRequest('Shipping address is required');
  }
  if (![PAYMENT_METHOD.COD, PAYMENT_METHOD.PREPAID].includes(paymentMethod)) {
    throw ApiError.badRequest('Invalid payment method');
  }

  // Resolve coupon if provided
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) throw ApiError.badRequest('Invalid coupon');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw ApiError.badRequest('Coupon expired');
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw ApiError.badRequest('Coupon no longer available');
    }
  }

  if (paymentMethod === PAYMENT_METHOD.COD) {
    // Create + immediately confirm
    const order = await createOrder({
      userId: req.user._id,
      shippingAddress,
      paymentMethod,
      couponCode: coupon?.code || '',
      coupon,
    });
    await confirmOrder(order, {});
    
    if (coupon) {
      coupon.usedCount += 1;
      await coupon.save();
    }

    // ── Send Order Confirmation Email (COD) ──
    try {
      await sendOrderConfirmationEmail(req.user.email, req.user.name, order);
    } catch (e) {
      console.error('[email] order confirmation failed:', e.message);
    }

    return res.status(201).json({
      success: true,
      order: order.toPublicJSON(),
      requiresPayment: false,
    });
  }

  // Prepaid — just create a PENDING order; Razorpay happens in paymentController
  const order = await createOrder({
    userId: req.user._id,
    shippingAddress,
    paymentMethod,
    couponCode: coupon?.code || '',
    coupon,
  });
  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }
  // Note: Email is NOT sent here because payment hasn't happened yet.
  
  res.status(201).json({
    success: true,
    order: order.toPublicJSON(),
    requiresPayment: true,
  });
});

// GET /api/orders
export const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders: orders.map((o) => o.toPublicJSON()) });
});

// GET /api/orders/:orderId
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');
  res.json({ success: true, order: order.toPublicJSON() });
});

// POST /api/orders/:orderId/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');
  if ([ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED].includes(order.status)) {
    throw ApiError.badRequest('Order has already shipped and cannot be cancelled');
  }
  if (order.status === ORDER_STATUS.CANCELLED) {
    throw ApiError.badRequest('Order is already cancelled');
  }

  await restoreStock(
    order.items.map((i) => ({
      productId: i.product,
      size: i.size,
      colour: i.colour,
      quantity: i.quantity,
    }))
  );

  order.status = ORDER_STATUS.CANCELLED;
  order.statusHistory.push({ status: ORDER_STATUS.CANCELLED, at: new Date() });
  await order.save();
  res.json({ success: true, order: order.toPublicJSON() });
});

// GET /api/orders/track/:orderId  — public-ish; requires order ID match
export const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId });
  if (!order) throw ApiError.notFound('Order not found');
  // Return a redacted view — no address, no email, no phone
  res.json({
    success: true,
    order: {
      orderId: order.orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items.map((i) => ({
        name: i.name,
        image: i.image,
        size: i.size,
        colour: i.colour,
        quantity: i.quantity,
      })),
      statusHistory: order.statusHistory,
      createdAt: order.createdAt,
      trackingNumber: order.trackingNumber,
    },
  });
});