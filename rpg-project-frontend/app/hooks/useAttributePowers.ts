import { gameService } from '../services/gameService';
import { attributePowersRepository } from '../repositories/gameDataRepositories';
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


export const useAttributePowers =
  createGetAllHookV2(
    'attribute-powers',
    attributePowersRepository.getAll,
    attributePowersRepository.syncAll
  );

export const useAttributePower =
  createGetByIdHookV2(
    'attribute-power',
    attributePowersRepository.getById,
    attributePowersRepository.syncById
  );


export const useCreateAttributePower =
  createCreateHook(
    'attribute-powers',
    gameService.createAttributePower
  );

export const useUpdateAttributePower =
  createUpdateHook(
    'attribute-power',
    gameService.updateAttributePower
  );


export const useDeleteAttributePower =
  createDeleteHook(
    'attribute-power',
    gameService.deleteAttributePower
  );

export const useToggleAttributePowerVisibility =
     (): UseMutationResult<void, AxiosError<ApiError>, number> => {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: async (powerId: number) => {
                await gameService.toggleAttributePowerVisibility(powerId);
                 return;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['attribute-powers'] });
            },
        }
    )
}
