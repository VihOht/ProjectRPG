import { api } from './api';
import type { GetUsersResponse, User, UpdateUserInfoRequest, UpdateUserInfoResponse, UpdateUserPasswordResponse, CreateUserRequest } from '../types';


export const userService = {
    /**
     * Get all users (admin only)
     */
    getUsers: async (): Promise<GetUsersResponse> => {
        const response = await api.get<GetUsersResponse>('/users');
        return response.data;
    },

    /**
     * Get user by id (admin only)
     */
    getUserById: async (id: number): Promise<User> => {
        const response = await api.get<{ user: User }>(`/users/${id}`);
        return response.data.user;
    },

    /**
     * Update User Information
     */
    updateUser: async (id: number, userData: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> => {
        const response = await api.put<UpdateUserInfoResponse>(`/users/${id}`, userData);
        return response.data;
    },

    /**
     * Update User Password
     */
    updatePassword: async (id: number, new_password: string): Promise<UpdateUserPasswordResponse> => {
        const response = await api.post<UpdateUserPasswordResponse>(`/users/${id}/password`, { new_password });
        return response.data;
    },

    /**
     * Create User
     */
    createUser: async (userData: CreateUserRequest): Promise<User> => {
        const response = await api.post<{ user: User }>('/users', userData);
        return response.data.user;
    },

    toggleUserActivation: async (id: number): Promise<void> => {
        const response = await api.post(`/users/${id}/toggle-active`);
        return response.data;
    },


    /**
     * Delete User (admin only)
     */
    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    }


};