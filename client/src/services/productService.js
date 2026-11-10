import api from './api';

export const productService = {
  async list(params = {}) {
    const { data } = await api.get('/products', { params });
    return data; // { items, pagination }
  },
  async get(slugOrId) {
    const { data } = await api.get(`/products/${slugOrId}`);
    return data; // { product, related }
  },
  async categories() {
    const { data } = await api.get('/products/categories');
    return data.categories;
  },
};