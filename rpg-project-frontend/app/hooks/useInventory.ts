// hooks/useInventory.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { gameService } from '../services/gameService';
import { inventoriesRepository } from '../repositories/inventoriesRepository';

import type {
  CreateInventoryRequest,
  CreateInventoryResponse,
  InventoryTypesResponse,
  StandardResponse,
  TransferInventoryOwnershipResponse,
  UpdateInventoryRequest,
  UpdateInventoryResponse,
} from '../types';
import { useEffect } from 'react';
import { ConnectivityManager } from '../services/onlineManager';

interface ApiError {
  message?: string;
}



// ======================================================
// INVENTORIES
// ======================================================

export function useCharacterInventories (
  characterId: number | null
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    networkMode: 'always',
    queryKey: ['character-inventories', characterId],
    queryFn: () =>
      inventoriesRepository.getCharacterInventories(characterId!),
    enabled: !!characterId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
      if (!ConnectivityManager.isOnline()) return;

      inventoriesRepository.syncCharacterInventories(characterId!).then(() => {
        queryClient.invalidateQueries({ queryKey: ['character-inventories', characterId] });
      }).catch((error) => {
        console.error(`Error syncing ${['character-inventories', characterId]}:`, error);
      });
    }, [queryClient, characterId, inventoriesRepository]);
  

    return query;
};

export const useCreateInventory = (
  characterId: number | null
): UseMutationResult<
  CreateInventoryResponse,
  AxiosError<ApiError>,
  CreateInventoryRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.createInventory(characterId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['character-inventories', characterId],
      });

      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
  });
};

export const useUpdateInventory = (
  inventoryId: number | null,
  characterId?: number | null
): UseMutationResult<
  UpdateInventoryResponse,
  AxiosError<ApiError>,
  UpdateInventoryRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.updateInventory(inventoryId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventory', inventoryId],
      });

      if (characterId) {
        queryClient.invalidateQueries({
          queryKey: ['character-inventories', characterId],
        });

        queryClient.invalidateQueries({
          queryKey: ['character', characterId],
        });
      }
    },
  });
};

export const useDeleteInventory = (
  characterId?: number | null
): UseMutationResult<
  StandardResponse,
  AxiosError<ApiError>,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inventoryId) =>
      gameService.deleteInventory(inventoryId),

    onSuccess: () => {
      if (characterId) {
        queryClient.invalidateQueries({
          queryKey: ['character-inventories', characterId],
        });

        queryClient.invalidateQueries({
          queryKey: ['character', characterId],
        });
      }
    },
  });
};

export const useInventoryTypes = (): UseQueryResult<
  InventoryTypesResponse,
  AxiosError<ApiError>
> => {
  return useQuery({
    queryKey: ['inventory-types'],

    queryFn: () =>
      gameService.getInventoryTypes(),

    staleTime: 30 * 60 * 1000,
  });
};

export const useTransferInventoryOwnership = (
  inventoryId: number | null
): UseMutationResult<
  TransferInventoryOwnershipResponse,
  AxiosError<ApiError>,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCharacterId) =>
      gameService.transferInventoryOwnership(
        inventoryId!,
        newCharacterId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventory', inventoryId],
      });

      queryClient.invalidateQueries({
        queryKey: ['characters'],
      });
    },
  });
};