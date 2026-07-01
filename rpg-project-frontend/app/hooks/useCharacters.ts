// app/hooks/useCharacters.ts

import { gameService } from '../services/gameService';
import { characterRepository } from '../repositories/characterRepository';
import { characterAttributesRepository } from '../repositories/characterAttributesRepository';
import { ConnectivityManager } from '../services/onlineManager';
import { useEffect } from 'react';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createDeleteHook,
} from './common';

export const useCharacters =
  createGetAllHookV2(
    'characters',
    characterRepository.getCharacters,
    characterRepository.syncCharacters
  );

export const useCharacter =
  createGetByIdHookV2(
    'character',
    characterRepository.getCharacterById,
    characterRepository.syncCharacter
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
) => {
  const queryClient = useQueryClient();

  return useMutation({
    networkMode: 'always',
    mutationFn: (data: UpdateCharacterGeneralRequest) => characterRepository.updateCharacterGeneral(characterId!, data),

    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(['character', characterId],
        updatedCharacter
      );

      queryClient.setQueryData(['characters'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          characters: oldData.characters.map((char: any) =>
            char.id === characterId ? updatedCharacter : char
          ),
        };
      });
    }

  });
};

// ======================================================
// UPDATE CHARACTER STATS
// ======================================================

export function useUpdateCharacterStats(
  characterId: number | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCharacterStatsRequest) =>
      characterRepository.updateCharacterStats(characterId!, data),

    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(['character', characterId], updatedCharacter);
      queryClient.setQueryData(['characters'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          characters: oldData.characters.map((char: any) =>
            char.id === characterId ? updatedCharacter : char
          ),
        };
      });
    },
  });
};

// ======================================================
// UPDATE CHARACTER DESCRIPTION
// ======================================================

export function useUpdateCharacterDescription (
  characterId: number | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCharacterDescriptionRequest) =>
      characterRepository.updateCharacterDescription(characterId!, data),

    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(['character', characterId], updatedCharacter);
      queryClient.setQueryData(['characters'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          characters: oldData.characters.map((char: any) =>
            char.id === characterId ? updatedCharacter : char
          ),
        };
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

export function useCharacterAttributes  (
  character_id: number | null
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    networkMode: 'always',
    queryKey: ['character-attributes', character_id],
    queryFn: () => characterAttributesRepository.getCharacterAttributes(character_id!),
    enabled: !!character_id,
  });

  useEffect(() => {
      if (!ConnectivityManager.isOnline()) return;

      characterAttributesRepository.syncCharacterAttributes(character_id!).then(() => {
        queryClient.invalidateQueries({ queryKey: ['character-attributes', character_id] });
      }).catch((error) => {
        console.error(`Error syncing ${character_id}:`, error);
      });
    }, [queryClient, character_id, characterAttributesRepository]);
  
    return query;
}


// ======================================================
// UPDATE CHARACTER PERICIAS
// ======================================================

export function useUpdateCharacterPericias (
  characterId: number | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdateCharacterPericiasRequest) =>
      characterAttributesRepository.updateCharacterPericias(
        characterId!,
        data
      ),

    onSuccess: (updatedAttributes: ListCharacterAttributesResponse) => {
      queryClient.setQueryData(['character-attributes', characterId], updatedAttributes);

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
