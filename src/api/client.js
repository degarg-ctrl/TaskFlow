import axios from 'axios';

// Base URL from Expo public env var (set in .env as EXPO_PUBLIC_API_URL)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

// Create Axios Instance
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Token getter — set this from authStore after it initialises.
 * Avoids circular import: authStore imports client, client must not import authStore.
 */
let _getToken = () => null;
export const setTokenGetter = (fn) => { _getToken = fn; };

// Request Interceptor — inject Bearer token if available
client.interceptors.request.use(
  (config) => {
    const token = _getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — surface structured API error messages
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverError =
      error.response && error.response.data && error.response.data.error;
    const customError = new Error(
      serverError || error.message || 'Network error occurred.'
    );
    customError.status = error.response ? error.response.status : null;
    return Promise.reject(customError);
  }
);

export default client;
