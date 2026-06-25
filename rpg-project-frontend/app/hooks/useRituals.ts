import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';
import { AxiosError } from 'axios';
import type { ApiError } from './common';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

export const useRituals =
  createGetAllHook(
    'rituals',
    gameService.getRituals
  );

export const useRitual =
  createGetByIdHook(
    'ritual',
    gameService.getRitualById
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
      return gameService.assignRitualToCharacter(ritualId, characterId);
    },
    onSuccess: () => {
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
      return gameService.unassignRitualFromCharacter(ritualId, characterId);
    },
    onSuccess: () => {
      // Invalidate the characters query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    }
  });
}