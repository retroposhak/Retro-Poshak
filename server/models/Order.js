import mongoose from 'mongoose';
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from '../utils/constants.js';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    colour: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    items: { type: [orderItemSchema], required: true },

    // Money — all computed server-side
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    couponCode: { type: String, default: '' },

    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },

    shippingAddress: { type: addressSnapshotSchema, required: true },

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },

    statusHistory: [
      {
        status: { type: String, enum: Object.values(ORDER_STATUS) },
        at: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],

    trackingNumber: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });

orderSchema.methods.toPublicJSON = function () {
  return {
    orderId: this.orderId,
    status: this.status,
    paymentStatus: this.paymentStatus,
    paymentMethod: this.paymentMethod,
    items: this.items,
    subtotal: this.subtotal,
    shipping: this.shipping,
    discount: this.discount,
    total: this.total,
    couponCode: this.couponCode,
    shippingAddress: this.shippingAddress,
    statusHistory: this.statusHistory,
    trackingNumber: this.trackingNumber,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Order = mongoose.model('Order', orderSchema);