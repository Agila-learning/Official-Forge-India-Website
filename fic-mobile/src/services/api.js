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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403 && error.response.data?.code) {
      const errorCode = error.response.data.code;
      // Using setTimeout to ensure router is mounted
      setTimeout(() => {
        const { router } = require('expo-router');
        if (errorCode === 'ACCOUNT_SETUP_PENDING') router.replace('/onboarding/setup');
        if (errorCode === 'DOCS_PENDING') router.replace('/onboarding/documents');
        if (errorCode === 'VEHICLE_UNASSIGNED') router.replace('/onboarding/vehicle');
        if (errorCode === 'LICENSE_EXPIRED' || errorCode === 'RC_EXPIRED' || errorCode === 'INSURANCE_EXPIRED') router.replace('/onboarding/renew');
        if (errorCode === 'ACCOUNT_SUSPENDED') router.replace('/onboarding/suspended');
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default api;
