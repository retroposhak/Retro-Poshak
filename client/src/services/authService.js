import api from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data.user;
  },
  
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data.user;
  },
  
  async logout() {
    await api.post('/auth/logout');
  },
  
  async me() {
    try {
      const { data } = await api.get('/auth/me');
      return data.user;
    } catch (error) {
      // If it's a 401 (not logged in), return null silently instead of throwing
      if (error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },
  
  async updateProfile(payload) {
    const { data } = await api.patch('/auth/me', payload);
    return data.user;
  },
  
  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  
  async resetPassword(token, password) {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data.user;
  },
};