import {
  useMutation,
  useQueryClient,
  type QueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { loreSessionsRepository } from '../repositories/gameDataRepositories';
import { loreService } from '../services/lore';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
} from './common';
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
} from '../types/lore';

const LORE_SESSIONS_QUERY_KEY = 'lore-sessions';
const LORE_SESSION_QUERY_KEY = 'lore-session';

export const useLore =
  createGetAllHookV2(
    LORE_SESSIONS_QUERY_KEY,
    loreSessionsRepository.getAll,
    loreSessionsRepository.syncAll
  );

export const useLoreSession =
  createGetByIdHookV2(
    LORE_SESSION_QUERY_KEY,
    loreSessionsRepository.getById,
    loreSessionsRepository.syncById
  );

export const useGetLoreSessions = useLore;
export const useGetLoreSession = useLoreSession;

async function syncLoreCache(queryClient: QueryClient, sessionId?: number) {
  try {
    if (sessionId) {
      await loreSessionsRepository.syncById(sessionId);
    }

    await loreSessionsRepository.syncAll();
  } catch (error) {
    console.error('Erro ao sincronizar o cache de lore:', error);
  } finally {
    queryClient.invalidateQueries({ queryKey: [LORE_SESSIONS_QUERY_KEY] });

    if (sessionId) {
      queryClient.invalidateQueries({
        queryKey: [LORE_SESSION_QUERY_KEY, sessionId],
      });
    } else {
      queryClient.invalidateQueries({ queryKey: [LORE_SESSION_QUERY_KEY] });
    }
  }
}

export const useCreateLoreSession = (): UseMutationResult<
  CreateLoreSessionResponse,
  AxiosError,
  CreateLoreSessionRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loreService.createLoreSession,
    onSuccess: (data) => syncLoreCache(queryClient, data.session.id),
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
    onSuccess: (_, sessionId) => {
      queryClient.removeQueries({
        queryKey: [LORE_SESSION_QUERY_KEY, sessionId],
      });

      return syncLoreCache(queryClient);
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
    mutationFn: ({ sessionId, data }) =>
      loreService.createLoreDocument(sessionId, data),
    onSuccess: (_, variables) =>
      syncLoreCache(queryClient, variables.sessionId),
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
    onSuccess: () => syncLoreCache(queryClient),
  });
};

export const useCreateLoreImage = (): UseMutationResult<
  CreateLoreImageResponse,
  AxiosError,
  { sessionId: number; data: CreateLoreImageRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }) =>
      loreService.createLoreImage(sessionId, data),
    onSuccess: (_, variables) =>
      syncLoreCache(queryClient, variables.sessionId),
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
    onSuccess: () => syncLoreCache(queryClient),
  });
};

export const useCreateLoreSubdocument = (): UseMutationResult<
  CreateLoreSubdocumentResponse,
  AxiosError,
  { documentId: number; data: CreateLoreSubdocumentRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, data }) =>
      loreService.createLoreSubdocument(documentId, data),
    onSuccess: () => syncLoreCache(queryClient),
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
    onSuccess: () => syncLoreCache(queryClient),
  });
};
