import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Base URL for the API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage helpers
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  },
};

// Username storage helpers
export const usernameStorage = {
  getUsername: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('username');
  },
  setUsername: (username: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('username', username);
  },
  removeUsername: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('username');
  },
};

// Request interceptor - automatically add token and username to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    const username = usernameStorage.getUsername();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (username) {
      config.headers['X-Username'] = username;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Check if it's a 401 Unauthorized error
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      tokenStorage.removeToken();
      usernameStorage.removeUsername();
      
      // Store error flag for components to detect and redirect
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth_error', 'token_invalid');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
