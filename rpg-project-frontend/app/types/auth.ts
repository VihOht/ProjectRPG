// User DTO
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// Register DTOs
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Login DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

// Verify DTOs
export interface VerifyResponse {
  message: string;
  user: User;
}

// Current User DTO
export interface CurrentUserResponse {
  user: User;
}

export interface GetUsersResponse {
  users: User[];
}
