import api from './api';

export const newsletterService = {
  async subscribe(email, source = 'footer') {
    const { data } = await api.post('/newsletter', { email, source });
    return data;
  },
};