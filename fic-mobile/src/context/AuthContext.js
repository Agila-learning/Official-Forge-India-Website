import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { safeStorage } from '../services/storage';
import { router } from 'expo-router';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Ultimate fallback: Guarantee loading stops after 2s
    const failsafe = setTimeout(() => setIsLoading(false), 2000);
    try {
      const userInfoStr = await safeStorage.getItem('userInfo');
      if (userInfoStr) {
        setUser(JSON.parse(userInfoStr));
      }
    } catch (e) {
      console.error(e);
    } finally {
      clearTimeout(failsafe);
      setIsLoading(false);
    }
  };

  const login = async (payload, method = 'email') => {
    const endpoint = method === 'email' ? '/auth/login' : '/auth/verify-otp';
    const { data } = await api.post(endpoint, payload);
    await safeStorage.setItem('token', data.token);
    await safeStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = async () => {
    await safeStorage.removeItem('token');
    await safeStorage.removeItem('userInfo');
    setUser(null);
    router.replace('/(auth)/login');
  };

  const saveUser = async (updatedUser) => {
    await safeStorage.setItem('userInfo', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
};
