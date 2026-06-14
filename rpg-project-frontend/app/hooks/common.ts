// hooks/common.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

export interface ApiError {
  message?: string;
}

export const DEFAULT_STALE_TIME = 5 * 60 * 1000;

// Generic Query Hooks
export function createGetAllHook<TResponse>(
  queryKey: string,
  fn: () => Promise<TResponse>
) {
  return (): UseQueryResult<TResponse, AxiosError> =>
    useQuery({
      queryKey: [queryKey],
      queryFn: fn,
      staleTime: DEFAULT_STALE_TIME,
      retry: 1,
    });
}

export function createGetByIdHook<TResponse>(
  queryKey: string,
  fn: (id: number) => Promise<TResponse>
) {
  return (
    id: number | null
  ): UseQueryResult<TResponse, AxiosError> =>
    useQuery({
      queryKey: [queryKey, id],
      queryFn: () => fn(id!),
      enabled: !!id,
      staleTime: DEFAULT_STALE_TIME,
      retry: 1,
    });
}

// Generic Mutation Hooks
export function createCreateHook<TResponse, TRequest>(
  queryKey: string,
  fn: (data: TRequest) => Promise<TResponse>
) {
  return (): UseMutationResult<
    TResponse,
    AxiosError<ApiError>,
    TRequest
  > => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: fn,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
      },
    });
  };
}

export function createUpdateHook<
  TResponse,
  TRequest
>(
  queryKey: string,
  fn: (id: number, data: TRequest) => Promise<TResponse>
) {
  return (
    id: number | null
  ): UseMutationResult<
    TResponse,
    AxiosError<ApiError>,
    TRequest
  > => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data) => fn(id!, data),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });

        queryClient.invalidateQueries({
          queryKey: [queryKey, id],
        });
      },
    });
  };
}

export function createDeleteHook(
  queryKey: string,
  fn: (id: number) => Promise<any>
) {
  return (): UseMutationResult<
    any,
    AxiosError<ApiError>,
    number
  > => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: fn,

      onSuccess: (_, id) => {
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });

        queryClient.removeQueries({
          queryKey: [queryKey, id],
        });
      },
    });
  };
}
