import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { loreService } from '../services/lore';
import type {
  CreateLoreDocumentRequest,
  CreateLoreDocumentResponse,
  CreateLoreImageRequest,
  CreateLoreImageResponse,
  CreateLoreSessionRequest,
  CreateLoreSessionResponse,
  CreateLoreSubdocumentRequest,
  CreateLoreSubdocumentResponse,
  DeleteLoreDocumentResponse,
  DeleteLoreImageResponse,
  DeleteLoreSessionResponse,
  DeleteLoreSubdocumentResponse,
  GetLoreSessionResponse,
  GetLoreSessionsResponse,
} from '../types/lore';

export const useGetLoreSessions = (): UseQueryResult<GetLoreSessionsResponse, AxiosError> => {
  return useQuery<GetLoreSessionsResponse, AxiosError>({
    queryKey: ['lore-sessions'],
    queryFn: loreService.getAllLoreSessions,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetLoreSession = (
  sessionId: number | null
): UseQueryResult<GetLoreSessionResponse, AxiosError> => {
  return useQuery<GetLoreSessionResponse, AxiosError>({
    queryKey: ['lore-session', sessionId],
    queryFn: () => loreService.getLoreSessionById(sessionId!),
    enabled: !!sessionId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateLoreSession = (): UseMutationResult<
  CreateLoreSessionResponse,
  AxiosError,
  CreateLoreSessionRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loreService.createLoreSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lore-sessions'] });
    },
  });
};

export const useDeleteLoreSession = (): UseMutationResult<
  DeleteLoreSessionResponse,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loreService.deleteLoreSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lore-sessions'] });
    },
  });
};

export const useCreateLoreDocument = (): UseMutationResult<
  CreateLoreDocumentResponse,
  AxiosError,
  { sessionId: number; data: CreateLoreDocumentRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }) => loreService.createLoreDocument(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lore-sessions'] });
    },
  });
};

export const useDeleteLoreDocument = (): UseMutationResult<
  DeleteLoreDocumentResponse,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loreService.deleteLoreDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lore-sessions'] });
    },
  });
};

export const useCreateLoreImage = (): UseMutationResult<
  CreateLoreImageResponse,
  AxiosError,
  { sessionId: number; data: CreateLoreImageRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }) => loreService.createLoreImage(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lore-sessions'] });
    },
  });
};

export const useDeleteLoreImage = (): UseMutationResult<
  DeleteLoreImageResponse,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loreService.deleteLoreImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lore-sessions'] });
    },
  });
};

export const useCreateLoreSubdocument = (): UseMutationResult<
  CreateLoreSubdocumentResponse,
  AxiosError,
  { documentId: number; data: CreateLoreSubdocumentRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, data }) => loreService.createLoreSubdocument(documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lore-sessions'] });
    },
  });
};

export const useDeleteLoreSubdocument = (): UseMutationResult<
  DeleteLoreSubdocumentResponse,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loreService.deleteLoreSubdocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lore-sessions'] });
    },
  });
};
