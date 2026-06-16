import axios from 'axios';
import { Platform } from 'react-native';
import { safeStorage } from './storage';

const isWeb = Platform.OS === 'web';

// Point to local development backend running on port 5001
// When testing on desktop web browser, use localhost. When testing on physical device, use IP.
const API_URL = isWeb ? 'http://localhost:5001/api' : 'http://192.168.1.37:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the JWT token to every request
api.interceptors.request.use(
  async (config) => {
    let token = await safeStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
