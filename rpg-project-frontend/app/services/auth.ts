import { api } from './api';
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
import { authSessionRepository } from '../repositories/authSessionRepository';
import type { AuthSession } from '../database/db';
import { useAuthSession } from '../hooks';

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
      await authSessionRepository.createAuthSession(response.data.token, 24 * 60 * 60 * 1000, response.data.user);
    }
    
    return response.data;
  },

  /**
   * Verify current token
   */
  verify: async (): Promise<VerifyResponse> => {
    const response = await api.get<VerifyResponse>('/auth/verify');
    if (response.data.user) {
      const session = await authSessionRepository.getAuthSession();
      if (session) {
        session.verifiedAt = new Date();
        await authSessionRepository.updateAuthSession({
          token: session.token,
          expiresAt: session.expiresAt.getTime()
        });
      }
    }
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
    authSessionRepository.deleteAuthSession();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {

    const { data: session } = useAuthSession();
    
    if (!session) return undefined;
    const now = new Date();
    return Boolean(now < session.expiresAt);
  },

  /**
   * Get stored username
   */
  getStoredUsername: () => {
    const session = useAuthSession().data as AuthSession | null;
    if (!session) return null;
    return session.user.username;
  }

  
};

export default authService;
