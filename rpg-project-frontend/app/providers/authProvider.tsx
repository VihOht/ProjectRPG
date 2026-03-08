import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAuth,
  useLogin,
  useLogout,
  useRegister,
} from "../hooks";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from "../types";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

interface AuthContextValue {
  user: User | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  login: (payload: LoginRequest) => Promise<LoginResponse>;
  register: (payload: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getAxiosErrorMessage(error: AxiosError<ApiErrorResponse> | null): string | null {
  if (!error) {
    return null;
  }

  return error.response?.data?.message ?? "Authentication request failed.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { user, username, isAuthenticated, isLoading } = useAuth();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const errorMessage =
    getAxiosErrorMessage(loginMutation.error as AxiosError<ApiErrorResponse> | null) ??
    getAxiosErrorMessage(registerMutation.error as AxiosError<ApiErrorResponse> | null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      username,
      isAuthenticated,
      isLoading,
      errorMessage,
      login: (payload: LoginRequest) => loginMutation.mutateAsync(payload),
      register: (payload: RegisterRequest) => registerMutation.mutateAsync(payload),
      logout: () => logoutMutation.mutate(),
      refreshUser: async () => {
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        await queryClient.invalidateQueries({ queryKey: ["verify"] });
      },
    }),
    [
      user,
      username,
      isAuthenticated,
      isLoading,
      errorMessage,
      loginMutation,
      registerMutation,
      logoutMutation,
      queryClient,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthProvider() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthProvider must be used inside AuthProvider");
  }

  return context;
}
