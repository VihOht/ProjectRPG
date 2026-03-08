import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../services/auth';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyResponse,
  CurrentUserResponse,
  GetUsersResponse,
} from '../types/auth';
import { AxiosError } from 'axios';

/**
 * Hook for user login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: () => {
      // Invalidate user queries to refetch
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['verify'] });
      
      // Optionally navigate to home or dashboard after login
      // const navigate = useNavigate();
      // navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  return useMutation<RegisterResponse, AxiosError, RegisterRequest>({
    mutationFn: authService.register,
    onSuccess: () => {
      // After registration, user might need to login
      console.log('Registration successful');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

/**
 * Hook for token verification
 */
export const useVerify = (): UseQueryResult<VerifyResponse, AxiosError> => {
  return useQuery<VerifyResponse, AxiosError>({
    queryKey: ['verify'],
    queryFn: authService.verify,
    enabled: authService.isAuthenticated(), // Only run if token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for getting current user
 */
export const useCurrentUser = (): UseQueryResult<CurrentUserResponse, AxiosError> => {
  return useQuery<CurrentUserResponse, AxiosError>({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated(), // Only run if token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for listing all users (admin only)
 */
export const useGetUsers = (enabled = true): UseQueryResult<GetUsersResponse, AxiosError> => {
  return useQuery<GetUsersResponse, AxiosError>({
    queryKey: ['users'],
    queryFn: authService.getUsers,
    enabled: authService.isAuthenticated() && enabled,
    retry: false,
    staleTime: 60 * 1000,
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      
      // Navigate to login page
      navigate('/auth/login');
    },
  });
};

/**
 * Hook to check authentication status
 */
export const useAuth = () => {
  const { data: verifyData, isLoading: isVerifying, error: verifyError } = useVerify();
  const { data: userData, isLoading: isLoadingUser } = useCurrentUser();

  return {
    isAuthenticated: authService.isAuthenticated(),
    user: userData?.user || verifyData?.user || null,
    isLoading: isVerifying || isLoadingUser,
    error: verifyError,
    username: authService.getStoredUsername(),
  };
};
