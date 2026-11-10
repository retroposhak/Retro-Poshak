import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { confirmOrder } from '../services/orderService.js';
import { PAYMENT_STATUS } from '../utils/constants.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js'; // <-- Added

let razorpay = null;
function getRazorpay() {
  if (razorpay) return razorpay;
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    throw ApiError.badRequest('Prepaid payments are not configured. Use COD.');
  }
  razorpay = new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  });
  return razorpay;
}

// POST /api/payments/create-order
// body: { orderId }  — internal order ID (RP...)
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findOne({ orderId, user: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');
  if (order.paymentStatus === PAYMENT_STATUS.PAID) {
    throw ApiError.badRequest('Order is already paid');
  }

  const rzp = getRazorpay();
  const rzpOrder = await rzp.orders.create({
    amount: order.total * 100, // paise
    currency: 'INR',
    receipt: order.orderId,
    notes: { internalOrderId: order.orderId, userId: String(req.user._id) },
  });

  order.razorpayOrderId = rzpOrder.id;
  await order.save();

  res.json({
    success: true,
    razorpayOrder: {
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: env.razorpay.keyId,
    },
  });
});

// POST /api/payments/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw ApiError.badRequest('Missing payment fields');
  }

  const expected = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    throw ApiError.badRequest('Invalid payment signature');
  }

  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
    user: req.user._id,
  });
  if (!order) throw ApiError.notFound('Order not found');
  if (order.paymentStatus === PAYMENT_STATUS.PAID) {
    return res.json({ success: true, order: order.toPublicJSON() });
  }

  await confirmOrder(order, {
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  // ── Send Order Confirmation Email (Prepaid) ──
  try {
    await sendOrderConfirmationEmail(req.user.email, req.user.name, order);
  } catch (e) {
    console.error('[email] order confirmation failed:', e.message);
  }

  res.json({ success: true, order: order.toPublicJSON() });
});

// POST /api/payments/webhook  — called by Razorpay servers, not by your frontend
export const webhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  if (!signature) return res.status(400).end();

  const body = JSON.stringify(req.body);
  const expected = crypto
    .createHmac('sha256', env.razorpay.webhookSecret)
    .update(body)
    .digest('hex');

  if (expected !== signature) {
    console.warn('[razorpay] webhook signature mismatch');
    return res.status(400).end();
  }

  const event = req.body.event;
  const payment = req.body.payload?.payment?.entity;
  if (!payment) return res.status(200).json({ ok: true });

  if (event === 'payment.captured' || event === 'order.paid') {
    const order = await Order.findOne({ razorpayOrderId: payment.order_id }).populate('user', 'email name');
    if (order && order.paymentStatus !== PAYMENT_STATUS.PAID) {
      await confirmOrder(order, {
        razorpayPaymentId: payment.id,
        razorpaySignature: '',
      });

      // ── Send Order Confirmation Email (Webhook Fallback) ──
      // If the browser closed before verifying, the webhook catches it.
      if (order.user?.email) {
        try {
          await sendOrderConfirmationEmail(order.user.email, order.user.name, order);
        } catch (e) {
          console.error('[email] webhook order confirmation failed:', e.message);
        }
      }
    }
  }

  res.status(200).json({ ok: true });
});