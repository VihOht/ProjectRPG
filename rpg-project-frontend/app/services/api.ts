import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authSessionRepository } from '../repositories';
import { ConnectivityManager } from './onlineManager';

const debug = import.meta.env.VITE_DEBUG === 'true' || false;

// Base URL for the API
var API_BASE_URL: string;
if (!debug) {
  API_BASE_URL = import.meta.env.VITE_API_URL;
} else {
  API_BASE_URL = 'http://localhost:5000';
}

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor - automatically add token and username to headers
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await authSessionRepository.getAuthSession();

    if (session) {
      config.headers.Authorization = `Bearer ${session.token}`;
      config.headers['X-Username'] = session.user.username;
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
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const session = await authSessionRepository.getAuthSession();
      if (session && new Date() >= session.expiresAt) {
        await authSessionRepository.deleteAuthSession();
      }
    }
    if (error.response?.status === 500) {
      ConnectivityManager.checkApiReachability();
    }
    return Promise.reject(error);
  }
);

export default api;
