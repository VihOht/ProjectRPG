import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '../services/auth';
import { useEffect, useState } from 'react';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyResponse,
  CurrentUserResponse,
  InviteUserRequest,
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


export const useChangePassword = () => {
  return useMutation<void, AxiosError, { password: string }>({
    mutationFn: (data) => authService.changePassword(data),
  });
}

export const useInviteUser = () => {
  return useMutation({
    mutationFn: (data: InviteUserRequest) => authService.inviteUser(data),
  });
}


/**
 * Hook to check authentication status
 */
export const useAuth = () => {
  const { data: verifyData, isLoading: isVerifying, error: verifyError } = useVerify();
  const { data: userData, isLoading: isLoadingUser } = useCurrentUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);



  return {
    isAuthenticated: authService.isAuthenticated(),
    isReady,
    user: userData?.user || verifyData?.user || null,
    isLoading: isVerifying || isLoadingUser,
    error: verifyError,
    username: authService.getStoredUsername(),
  };
};
