import api from './api';

export const couponService = {
  async validate(code, subtotal) {
    const { data } = await api.get(`/coupons/${code}`, { params: { subtotal } });
    return data.coupon; // { code, description, type, value, discount }
  },
};