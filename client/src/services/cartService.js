import api from './api';

export const cartService = {
  async get() {
    const { data } = await api.get('/cart');
    return data;
  },
  async add({ productId, size, colour, quantity = 1 }) {
    const { data } = await api.post('/cart/items', { productId, size, colour, quantity });
    return data;
  },
  async update({ productId, size, colour, quantity }) {
    const { data } = await api.patch(`/cart/items/${productId}`, { size, colour, quantity });
    return data;
  },
  async remove({ productId, size, colour }) {
    const { data } = await api.delete(`/cart/items/${productId}`, { params: { size, colour } });
    return data;
  },
  async clear() {
    const { data } = await api.delete('/cart');
    return data;
  },
  async merge(items) {
    const { data } = await api.post('/cart/merge', { items });
    return data;
  },
};