import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

// ── Auto-refresh on 401 ─────────────────────────
let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, resolved) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(resolved);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Don't retry the refresh endpoint itself
    const isRefreshRequest = original.url.includes('/auth/refresh');
    // Don't loop if login/register fails
    const isAuthRequest = original.url.includes('/auth/login') || original.url.includes('/auth/register');
    // Don't loop if the initial profile check fails (user is just a guest)
    const isMeRequest = original.url.includes('/auth/me');

    if (status === 401 && original && !original._retry && !isRefreshRequest && !isAuthRequest && !isMeRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => api(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        flushQueue(null, true);
        return api(original);
      } catch (refreshErr) {
        flushQueue(refreshErr, null);
        window.dispatchEvent(new CustomEvent('auth:expired'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;