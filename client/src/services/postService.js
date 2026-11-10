import api from './api';

export const postService = {
  async list(params = {}) {
    const { data } = await api.get('/posts', { params });
    return data;
  },
  async get(slug) {
    const { data } = await api.get(`/posts/${slug}`);
    return data;
  },
};