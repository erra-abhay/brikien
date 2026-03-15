import axios from 'axios';
const isServer = typeof window === 'undefined';

const baseURL = isServer 
  ? (process.env.INTERNAL_API_URL || 'http://api:5000') 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:55524');

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error.response?.data?.error || 'Something went wrong');
  }
);

export default api;
