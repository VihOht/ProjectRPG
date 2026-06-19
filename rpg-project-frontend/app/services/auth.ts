import { api, tokenStorage, usernameStorage } from './api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyResponse,
  CurrentUserResponse,
  ChangeAccountPasswordRequest,
  InviteUserRequest
} from '../types/auth';
import type { StandardResponse } from '../types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  inviteUser: async (data: InviteUserRequest): Promise<StandardResponse> => {
    const response = await api.post<StandardResponse>('/auth/invite', data);
    return response.data;
  },

  changeAccountPassword: async (data: ChangeAccountPasswordRequest): Promise<void> => {
    await api.post('/auth/change-password', data);
  },

  /**
   * Login user and store token + username
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    
    // Store token and username in localStorage
    if (response.data.token) {
      tokenStorage.setToken(response.data.token);
    }
    if (response.data.user?.username) {
      usernameStorage.setUsername(response.data.user.username);
    }
    
    return response.data;
  },

  /**
   * Verify current token
   */
  verify: async (): Promise<VerifyResponse> => {
    const response = await api.get<VerifyResponse>('/auth/verify');
    return response.data;
  },

  /**
   * Get current user information
   */
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await api.get<CurrentUserResponse>('/auth/me');
    return response.data;
  },

  /**
   * Change current user's password
   */
  changePassword: async (data: ChangeAccountPasswordRequest): Promise<void> => {
    await api.post('/auth/change-password', data);
  },

  /**
   * Logout user (clear local storage)
   */
  logout: (): void => {
    tokenStorage.removeToken();
    usernameStorage.removeUsername();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!tokenStorage.getToken();
  },

  /**
   * Get stored username
   */
  getStoredUsername: (): string | null => {
    return usernameStorage.getUsername();
  },

  
};

export default authService;
