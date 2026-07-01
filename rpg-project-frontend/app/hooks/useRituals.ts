import { gameService } from '../services/gameService';
import { ritualsRepository } from '../repositories/gameDataRepositories';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';
import { AxiosError } from 'axios';
import type { ApiError } from './common';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { characterRepository } from '../repositories';

export const useRituals =
  createGetAllHookV2(
    'rituals',
    ritualsRepository.getAll,
    ritualsRepository.syncAll
  );

export const useRitual =
  createGetByIdHookV2(
    'ritual',
    ritualsRepository.getById,
    ritualsRepository.syncById
  );

export const useCreateRitual =
  createCreateHook(
    'rituals',
    gameService.createRitual
  );

export const useUpdateRitual =
  createUpdateHook(
    'ritual',
    gameService.updateRitual
  );

export const useDeleteRitual =
  createDeleteHook(
    'ritual',
    gameService.deleteRitual
  );

export const useToggleRitualVisibility =
     (): UseMutationResult<void, AxiosError<ApiError>, number> => {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: async (ritualId: number) => {
                await gameService.toggleRitualVisibility(ritualId);
                 return;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['rituals', 'ritual'] });
            },
        }
    )
}

export const useAssignRitualToCharacter = (characterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ritualId: number) => {
      return characterRepository.assignRitualToCharacter(ritualId, characterId);
    },
    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(['character', characterId], updatedCharacter);
      // Invalidate the characters query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    }
  });
};

export const useUnassignRitualFromCharacter = (characterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ritualId: number) => {
      return characterRepository.unassignRitualFromCharacter(ritualId, characterId);
    },
    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(['character', characterId], updatedCharacter);
      // Invalidate the characters query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    }
  });
}
