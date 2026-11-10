import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { ApiError } from '../utils/ApiError.js';
import { computeTotals } from './pricingService.js';
import { reserveStock } from './stockService.js';
import { generateOrderId } from '../utils/generateOrderId.js';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } from '../utils/constants.js';

/**
 * Builds a normalised order draft from the user's cart.
 * Returns { items, totals, cartDoc } — all prices come from the DB, never the client.
 */
export async function buildDraft(userId, { coupon = null, prepaid = false } = {}) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) throw ApiError.badRequest('Your cart is empty');

  const productIds = cart.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  for (const c of cart.items) {
    const p = byId.get(String(c.product));
    if (!p) throw ApiError.badRequest('Some items are no longer available');

    const variant = p.variants.find((v) => v.size === c.size && v.colour === c.colour);
    if (!variant || variant.stock < c.quantity) {
      throw ApiError.badRequest(`Not enough stock for ${p.name}`);
    }

    items.push({
      productId: String(p._id),
      name: p.name,
      image: p.images?.[0] || '',
      size: c.size,
      colour: c.colour,
      quantity: c.quantity,
      price: p.price,
      lineTotal: p.price * c.quantity,
    });
  }

  const totals = computeTotals({ items, prepaid, coupon });
  return { items, totals, cartDoc: cart };
}

/**
 * Creates a pending order. Called either by COD checkout or by prepaid
 * (before Razorpay payment — order stays PENDING until webhook/verify).
 */
export async function createOrder({
  userId,
  shippingAddress,
  paymentMethod,
  couponCode = '',
  coupon = null,
  razorpayOrderId = '',
}) {
  const prepaid = paymentMethod === PAYMENT_METHOD.PREPAID;

  // Recompute from cart — never trust the client
  const { items, totals, cartDoc } = await buildDraft(userId, { coupon, prepaid });

  // Reserve stock atomically
  await reserveStock(items);

  // Create the order document
  const orderId = generateOrderId();
  const order = await Order.create({
    orderId,
    user: userId,
    items: items.map((i) => ({
      product: i.productId,
      name: i.name,
      image: i.image,
      size: i.size,
      colour: i.colour,
      quantity: i.quantity,
      unitPrice: i.price,
      lineTotal: i.lineTotal,
    })),
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    discount: totals.discount,
    total: totals.total,
    couponCode,
    paymentMethod,
    paymentStatus: prepaid ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PENDING, // COD pending until delivered
    razorpayOrderId,
    shippingAddress,
    status: ORDER_STATUS.PENDING,
    statusHistory: [{ status: ORDER_STATUS.PENDING, at: new Date(), note: 'Order created' }],
  });

  // Clear cart
  cartDoc.items = [];
  await cartDoc.save();

  return order;
}

/**
 * Marks an order as paid + confirmed (used by both COD place + prepaid verify).
 */
export async function confirmOrder(order, { razorpayPaymentId = '', razorpaySignature = '' } = {}) {
  order.paymentStatus = PAYMENT_STATUS.PAID;
  order.razorpayPaymentId = razorpayPaymentId;
  order.status = ORDER_STATUS.CONFIRMED;
  order.statusHistory.push({
    status: ORDER_STATUS.CONFIRMED,
    at: new Date(),
    note: razorpayPaymentId ? 'Payment received' : 'COD confirmed',
  });
  await order.save();

  // Increment soldCount for merchandising
  for (const it of order.items) {
    await Product.updateOne({ _id: it.product }, { $inc: { soldCount: it.quantity } });
  }

  // Record payment row (for prepaid)
  if (razorpayPaymentId) {
    await Payment.create({
      order: order._id,
      user: order.user,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount: order.total,
      status: PAYMENT_STATUS.PAID,
    });
  }

  return order;
}