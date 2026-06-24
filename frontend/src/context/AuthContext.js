import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import axios from 'axios';

// Replace with your local machine's IP address if testing on a physical device,
// or use localhost for iOS simulator / 10.0.2.2 for Android emulator.
const getBaseUrl = () => {
  if (Platform.OS === 'android') return 'http://10.0.2.2:5000';
  return 'http://localhost:5000';
};
export const API_URL = `${getBaseUrl()}/api`; 

export const AuthContext = createContext();

/** Cross-platform storage: localStorage on web, SecureStore on native */
const storage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  deleteItem: async (key) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    try {
      const userData = await storage.getItem('userInfo');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.log('Error checking user login', e);
    }
    setIsLoading(false);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      setUser(data);
      await storage.setItem('userInfo', JSON.stringify(data));
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      
      setUser(data);
      await storage.setItem('userInfo', JSON.stringify(data));
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await storage.deleteItem('userInfo');
      setUser(null);
    } catch (e) {
      console.log('Error logging out', e);
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
