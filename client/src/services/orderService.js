import api from './api';

export const orderService = {
  async place({ shippingAddress, paymentMethod, couponCode }) {
    const { data } = await api.post('/orders', { shippingAddress, paymentMethod, couponCode });
    return data; // { order, requiresPayment }
  },
  async list() {
    const { data } = await api.get('/orders');
    return data.orders;
  },
  async get(orderId) {
    const { data } = await api.get(`/orders/${orderId}`);
    return data.order;
  },
  async cancel(orderId) {
    const { data } = await api.post(`/orders/${orderId}/cancel`);
    return data.order;
  },
  async track(orderId) {
    const { data } = await api.get(`/orders/track/${orderId}`);
    return data.order;
  },
};