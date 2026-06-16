import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

// In-memory fallback if AsyncStorage native module is missing (Expo Go compatibility)
const memoryStorage = new Map();
let isAsyncStorageBroken = false;

const withTimeout = (promise, ms = 1000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('AsyncStorage timeout')), ms))
  ]);
};

export const safeStorage = {
  getItem: async (key) => {
    if (isWeb) return localStorage.getItem(key);
    if (isAsyncStorageBroken) return memoryStorage.get(key) || null;
    try {
      return await withTimeout(AsyncStorage.getItem(key));
    } catch (e) {
      console.warn('AsyncStorage getItem failed/timed out, switching to memory storage', e.message);
      isAsyncStorageBroken = true;
      return memoryStorage.get(key) || null;
    }
  },
  setItem: async (key, value) => {
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }
    if (isAsyncStorageBroken) {
      memoryStorage.set(key, value);
      return;
    }
    try {
      await withTimeout(AsyncStorage.setItem(key, value));
    } catch (e) {
      isAsyncStorageBroken = true;
      memoryStorage.set(key, value);
    }
  },
  removeItem: async (key) => {
    if (isWeb) {
      localStorage.removeItem(key);
      return;
    }
    if (isAsyncStorageBroken) {
      memoryStorage.delete(key);
      return;
    }
    try {
      await withTimeout(AsyncStorage.removeItem(key));
    } catch (e) {
      isAsyncStorageBroken = true;
      memoryStorage.delete(key);
    }
  },
};
