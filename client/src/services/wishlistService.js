import api from './api';

export const wishlistService = {
  async get() {
    const { data } = await api.get('/wishlist');
    return data;
  },
  async add(productId) {
    const { data } = await api.post(`/wishlist/${productId}`);
    return data;
  },
  async remove(productId) {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return data;
  },
  async merge(productIds) {
    const { data } = await api.post('/wishlist/merge', { productIds });
    return data;
  },
};