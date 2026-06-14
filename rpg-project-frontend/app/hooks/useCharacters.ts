import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createDeleteHook,
} from './common';

export const useCharacters =
  createGetAllHook(
    'characters',
    gameService.getCharacters
  );

export const useCharacter =
  createGetByIdHook(
    'character',
    gameService.getCharacterById
  );

export const useCreateCharacter =
  createCreateHook(
    'characters',
    gameService.createCharacter
  );

export const useDeleteCharacter =
  createDeleteHook(
    'character',
    gameService.deleteCharacter
  );


  // hooks/useCharacterMutations.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

import type {
  CreateCharacterResponse,
  ListCharacterAttributesResponse,
  BulkUpdateCharacterPericiasRequest,
  StandardResponse,
  UpdateCharacterGeneralRequest,
  UpdateCharacterStatsRequest,
  UpdateCharacterDescriptionRequest,
  UpdateCharacterOffsetsRequest,
} from '../types/character';

interface ApiError {
  message?: string;
}

// ======================================================
// UPDATE CHARACTER GENERAL
// ======================================================

export const useUpdateCharacterGeneral = (
  characterId: number | null
): UseMutationResult<
  CreateCharacterResponse,
  AxiosError<ApiError>,
  UpdateCharacterGeneralRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.updateCharacterGeneral(characterId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });

      queryClient.invalidateQueries({
        queryKey: ['characters'],
      });
    },
  });
};

// ======================================================
// UPDATE CHARACTER STATS
// ======================================================

export const useUpdateCharacterStats = (
  characterId: number | null
): UseMutationResult<
  CreateCharacterResponse,
  AxiosError<ApiError>,
  UpdateCharacterStatsRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.updateCharacterStats(characterId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
  });
};

// ======================================================
// UPDATE CHARACTER DESCRIPTION
// ======================================================

export const useUpdateCharacterDescription = (
  characterId: number | null
): UseMutationResult<
  CreateCharacterResponse,
  AxiosError<ApiError>,
  UpdateCharacterDescriptionRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.updateCharacterDescription(characterId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
  });
};

// ======================================================
// UPDATE CHARACTER OFFSETS
// ======================================================

export const useUpdateCharacterOffsets = (
  characterId: number | null
): UseMutationResult<
  CreateCharacterResponse,
  AxiosError<ApiError>,
  UpdateCharacterOffsetsRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.updateCharacterOffsets(characterId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
  });
};

// ======================================================
// TOGGLE CHARACTER ACTIVE
// ======================================================

export const useToggleCharacterActive = (
  characterId: number | null
): UseMutationResult<
  StandardResponse,
  AxiosError<ApiError>,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      gameService.toggleCharacterActive(characterId!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });

      queryClient.invalidateQueries({
        queryKey: ['characters'],
      });
    },
  });
};

// ======================================================
// TRANSFER OWNERSHIP
// ======================================================

export const useTransferCharacterOwnership = (
  characterId: number | null
): UseMutationResult<
  StandardResponse,
  AxiosError<ApiError>,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUserId) =>
      gameService.transferCharacterOwnership(
        characterId!,
        newUserId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });

      queryClient.invalidateQueries({
        queryKey: ['characters'],
      });

      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
};

// ======================================================
// RETURN TO ADMIN
// ======================================================

export const useReturnCharacterToAdmin = (
  characterId: number | null
): UseMutationResult<
  StandardResponse,
  AxiosError<ApiError>,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      gameService.returnCharacterToAdmin(characterId!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });

      queryClient.invalidateQueries({
        queryKey: ['characters'],
      });
    },
  });
};

// ======================================================
// CHARACTER ATTRIBUTES
// ======================================================

export const useCharacterAttributes = (
  characterId: number | null
): UseQueryResult<
  ListCharacterAttributesResponse,
  AxiosError
> => {
  return useQuery({
    queryKey: ['character-attributes', characterId],

    queryFn: () =>
      gameService.getCharacterAttributes(characterId!),

    enabled: !!characterId,

    retry: 1,

    staleTime: 5 * 60 * 1000,
  });
};

// ======================================================
// UPDATE CHARACTER PERICIAS
// ======================================================

export const useUpdateCharacterPericias = (
  characterId: number | null
): UseMutationResult<
  StandardResponse,
  AxiosError<ApiError>,
  BulkUpdateCharacterPericiasRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.updateCharacterPericias(
        characterId!,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character-attributes', characterId],
      });

      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });

      queryClient.invalidateQueries({
        queryKey: ['characters'],
      });
    },
  });
};

// ======================================================
// COMBINED HOOK
// ======================================================

export const useCharacterManagement = (
  characterId: number | null
) => ({
  attributes: useCharacterAttributes(characterId),

  updateGeneral:
    useUpdateCharacterGeneral(characterId),

  updateStats:
    useUpdateCharacterStats(characterId),

  updateDescription:
    useUpdateCharacterDescription(characterId),

  updateOffsets:
    useUpdateCharacterOffsets(characterId),

  updatePericias:
    useUpdateCharacterPericias(characterId),

  toggleActive:
    useToggleCharacterActive(characterId),

  transferOwnership:
    useTransferCharacterOwnership(characterId),

  returnToAdmin:
    useReturnCharacterToAdmin(characterId),
});