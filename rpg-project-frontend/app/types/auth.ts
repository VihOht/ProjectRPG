// User DTO
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  active: boolean;
}

// Register DTOs
export interface RegisterRequest {
  token: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface InviteUserRequest {
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface ChangeAccountPasswordRequest {
  password: string;
}

// Login DTOs
export interface LoginRequest {
  login_identifier: string; // Can be either username or email
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
