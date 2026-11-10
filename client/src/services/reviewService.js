import api from './api';

export const reviewService = {
  async list(productId) {
    const { data } = await api.get(`/products/${productId}/reviews`);
    return data.reviews;
  },
  async create(productId, payload) {
    const { data } = await api.post(`/products/${productId}/reviews`, payload);
    return data.review;
  },
};