import type { User } from './auth';
// app.types.users.ts


export interface UpdateUserInfoRequest {
    username?: string;
    email?: string;
}

export interface UpdateUserInfoResponse {
    message: string;
    user: User;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface GetUsersResponse {
    users: User[];
}

export interface UpdateUserPasswordRequest {
    new_password: string;
}

export interface UpdateUserPasswordResponse {
    message: string;
}