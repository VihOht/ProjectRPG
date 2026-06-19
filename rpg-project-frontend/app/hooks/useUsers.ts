import type { CreateUserRequest, GetUsersResponse, UpdateUserInfoRequest, UpdateUserInfoResponse, User } from '../types';
import { userService, authService } from '../services';
import { useMutation, useQuery, type UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios'; 
import { toast } from 'react-hot-toast'; 



/**
 * Hook for listing all users (admin only)
 */
export const useGetUsers = (enabled = true): UseQueryResult<GetUsersResponse, AxiosError> => {
  return useQuery<GetUsersResponse, AxiosError>({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    enabled: authService.isAuthenticated() && enabled,
    retry: false,
    staleTime: 60 * 1000,
  });
};

/**
 * Hook for getting a specific user (admin only)
 */
export const useGetUserById = (id: number, enabled = true): UseQueryResult<User, AxiosError> => {
  return useQuery<User, AxiosError>({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: authService.isAuthenticated() && enabled,
    retry: false,
    staleTime: 60 * 1000,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserInfoResponse, AxiosError, { id: number; userData: UpdateUserInfoRequest }>({
    mutationFn: ({ id, userData }) => userService.updateUser(id, userData),
    onSuccess: () => {
      // Invalidate user queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });

      toast.success('Usuario atualizado com sucesso');
    },
    onError: (error) => {
      // @ts-ignore
      toast.error('Erro ao atualizar usuário: ' + error.response?.data?.message || error.message);
    },
  });
};

export const useUpdatePassword = () => {

return useMutation({
    mutationFn: ({ id, new_password }: { id: number; new_password: string }) => userService.updatePassword(id, new_password),
    onSuccess: () => {
        toast.success('Senha atualizada com sucesso');
    },
    onError: (error: AxiosError) => {
        // @ts-ignore
        toast.error('Erro ao atualizar senha: ' + error.response?.data?.message || error.message);
    }
});
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário excluído com sucesso');
    },
    onError: (error: AxiosError) => {
    // @ts-ignore
      toast.error('Erro ao excluir usuário: ' + error.response?.data?.message || error.message); // 
    },
  });
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: CreateUserRequest) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuário criado com sucesso');
    },
    onError: (error: AxiosError) => {
      // @ts-ignore
      toast.error('Erro ao criar usuário: ' + error.response?.data?.message || error.message);
    }
  });
}

export const useToggleUserActivation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.toggleUserActivation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Status do usuário atualizado com sucesso');
    },
    onError: (error: AxiosError) => {
      // @ts-ignore
      toast.error('Erro ao atualizar status do usuário: ' + error.response?.data?.message || error.message);
    }
  });
}


