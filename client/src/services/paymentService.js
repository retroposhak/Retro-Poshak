import api from './api';

export const paymentService = {
  async createRazorpayOrder(orderId) {
    const { data } = await api.post('/payments/create-order', { orderId });
    return data.razorpayOrder; // { id, amount, currency, keyId }
  },
  async verify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const { data } = await api.post('/payments/verify', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return data.order;
  },
};