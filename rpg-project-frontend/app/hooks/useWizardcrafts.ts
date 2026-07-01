import { gameService } from '../services/gameService';
import { wizardcraftsRepository } from '../repositories/gameDataRepositories';
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

export const useWizardcrafts =
  createGetAllHookV2(
    'wizardcrafts',
    wizardcraftsRepository.getAll,
    wizardcraftsRepository.syncAll
  );

export const useWizardcraft =
  createGetByIdHookV2(
    'wizardcraft',
    wizardcraftsRepository.getById,
    wizardcraftsRepository.syncById
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
      return characterRepository.assignWizardcraftToCharacter(wizardcraftId, characterId);
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

export const useUnassignWizardcraftFromCharacter = (characterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wizardcraftId: number) => {
      return characterRepository.unassignWizardcraftFromCharacter(wizardcraftId, characterId);
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
