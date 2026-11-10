import api from './api';

export const adminService = {
  stats: async () => (await api.get('/admin/stats')).data.stats,

  products: {
    list: async (params) => (await api.get('/admin/products', { params })).data,
    get: async (id) => (await api.get(`/admin/products/${id}`)).data.product,
    create: async (payload) => (await api.post('/admin/products', payload)).data.product,
    update: async (id, payload) => (await api.patch(`/admin/products/${id}`, payload)).data.product,
    remove: async (id) => (await api.delete(`/admin/products/${id}`)).data,
    uploadImages: async (files) => {
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));
      const { data } = await api.post('/admin/products/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.urls;
    },
  },
  orders: {
    list: async (params) => (await api.get('/admin/orders', { params })).data,
    updateStatus: async (id, status) =>
      (await api.patch(`/admin/orders/${id}/status`, { status })).data.order,
    updateTracking: async (id, trackingNumber) =>
      (await api.patch(`/admin/orders/${id}/tracking`, { trackingNumber })).data.order,
  },
  users: {
    list: async (params) => (await api.get('/admin/users', { params })).data,
  },
  coupons: {
    list: async () => (await api.get('/admin/coupons')).data.coupons,
    create: async (payload) => (await api.post('/admin/coupons', payload)).data.coupon,
    update: async (id, payload) => (await api.patch(`/admin/coupons/${id}`, payload)).data.coupon,
    remove: async (id) => (await api.delete(`/admin/coupons/${id}`)).data,
  },
  categories: async () => (await api.get('/admin/categories')).data.categories,
};