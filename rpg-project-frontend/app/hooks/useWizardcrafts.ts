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

export const useWizardcrafts =
  createGetAllHook(
    'wizardcrafts',
    gameService.getWizardcrafts
  );

export const useWizardcraft =
  createGetByIdHook(
    'wizardcraft',
    gameService.getWizardcraftById
  );

export const useCreateWizardcraft =
  createCreateHook(
    'wizardcrafts',
    gameService.createWizardcraft
  );

export const useUpdateWizardcraft =
  createUpdateHook(
    'wizardcraft',
    gameService.updateWizardcraft
  );

export const useDeleteWizardcraft =
  createDeleteHook(
    'wizardcraft',
    gameService.deleteWizardcraft
  );

export const useToggleWizardcraftVisibility =
     (): UseMutationResult<void, AxiosError<ApiError>, number> => {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: async (wizardcraftId: number) => {
                await gameService.toggleWizardcraftVisibility(wizardcraftId);
                 return;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['wizardcrafts', 'wizardcraft'] });
            },
        }
    )
}

export const useAssignWizardcraftToCharacter = (characterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wizardcraftId: number) => {
      return gameService.assignWizardcraftToCharacter(wizardcraftId, characterId);
    },
    onSuccess: () => {
      // Invalidate the characters query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    }
  });
};

export const useUnassignWizardcraftFromCharacter = (characterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wizardcraftId: number) => {
      return gameService.unassignWizardcraftFromCharacter(wizardcraftId, characterId);
    },
    onSuccess: () => {
      // Invalidate the characters query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    }
  });
}