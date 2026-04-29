import axios from 'axios';

// Use relative path for API, which is proxied by Vite (dev) or Vercel (prod)
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config && error.config.url && (error.config.url.includes('/auth/login') || error.config.url.includes('/auth/verify-otp'));
      if (!isAuthRoute) {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

export const userService = {
  getUsers: (keyword = '') => api.get(`/users?keyword=${keyword}`),
};

export const eventService = {
  getEvents: () => api.get('/events'),
  createEvent: (eventData) => api.post('/events', eventData),
};

export const contactService = {
  createContact: (contactData) => api.post('/contacts', contactData),
  getContacts: () => api.get('/contacts'),
};

export default api;
