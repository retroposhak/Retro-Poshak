import api from './api';

export const policyService = {
  async get(slug) {
    const { data } = await api.get(`/policies/${slug}`);
    return data.page;
  },
  async list() {
    const { data } = await api.get('/policies');
    return data.pages;
  },
};