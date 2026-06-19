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


export const useAttributePowers =
  createGetAllHook(
    'attribute-powers',
    gameService.getAttributePowers
  );

export const useAttributePower =
  createGetByIdHook(
    'attribute-power',
    gameService.getAttributePowerById
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