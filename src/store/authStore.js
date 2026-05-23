import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client, { setTokenGetter } from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await client.post('/api/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      set({ token, user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      const errorMsg = error.message || 'Login failed.';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await client.post('/api/auth/register', { name, email, password });
      const { token, user } = response.data.data;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      set({ token, user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      const errorMsg = error.message || 'Registration failed.';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (e) {
      console.error('Error clearing AsyncStorage:', e);
    }

    set({ token: null, user: null, isAuthenticated: false, error: null });

    // Lazily access taskStore at call-time (not import-time) to avoid circular deps
    try {
      const { useTaskStore } = require('./taskStore');
      useTaskStore.getState().reset();
    } catch (e) {
      console.warn('Could not reset task store on logout:', e);
    }
  },

  hydrate: async () => {
    set({ loading: true });
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      if (token && userData) {
        set({ token, user: JSON.parse(userData), isAuthenticated: true });
      }
    } catch (error) {
      console.error('Auth store hydration error:', error);
    } finally {
      set({ loading: false });
    }
  }
}));

// Register token getter with the Axios client so it can attach Bearer headers.
// This runs once after module load — no circular import issue.
setTokenGetter(() => useAuthStore.getState().token);
