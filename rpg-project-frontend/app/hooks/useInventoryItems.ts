// ======================================================
// INVENTORY ITEMS
// ======================================================

import type { AxiosError } from "axios";
import type { ApiError } from "./common";
import type { AddInventoryItemRequest, AddInventoryItemResponse, RemoveInventoryItemRequest, RemoveInventoryItemResponse, StandardResponse, TransferInventoryItemRequest } from "../types";
import { useMutation, useQuery, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { gameService } from "../services";
import { inventoryItemsRepository } from "../repositories/inventoryItemsRepository";
import { ConnectivityManager } from "../services/onlineManager";
import { useEffect } from "react";

export function useInventoryItems (
  inventoryId: number | null
)
  {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['inventory-items', inventoryId],
    queryFn: () =>
      inventoryItemsRepository.getInventoryItems(inventoryId!),
    enabled: !!inventoryId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
      if (!ConnectivityManager.isOnline()) return;

      inventoryItemsRepository.syncInventoryItems(inventoryId!).then(() => {
        queryClient.invalidateQueries({
          queryKey: ['inventory-items', inventoryId],
        });
      });
  }, [inventoryId, queryClient]);

  return query;
};

export const useAddItemToInventory = (
  inventoryId: number | null
): UseMutationResult<
  AddInventoryItemResponse,
  AxiosError<ApiError>,
  AddInventoryItemRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.addItemToInventory(inventoryId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventory-items', inventoryId],
      });

      queryClient.invalidateQueries({
        queryKey: ['items'],
      });
    },
  });
};

export const useRemoveItemFromInventory = (
  inventoryId: number | null,
  itemId: number | null
): UseMutationResult<
  RemoveInventoryItemResponse,
  AxiosError<ApiError>,
  RemoveInventoryItemRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.removeItemFromInventory(
        inventoryId!,
        itemId!,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventory-items', inventoryId],
      });
    },
  });
};

export const useDeleteInventoryItem = (
  inventoryId: number | null
): UseMutationResult<
  StandardResponse,
  AxiosError<ApiError>,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) =>
      gameService.deleteInventoryItem(
        inventoryId!,
        itemId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventory-items', inventoryId],
      });
    },
  });
};

export const useTransferItemBetweenInventories = (
  sourceInventoryId: number | null,
  targetInventoryId: number | null
): UseMutationResult<
  StandardResponse,
  AxiosError<ApiError>,
  TransferInventoryItemRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.transferItemBetweenInventories(
        sourceInventoryId!,
        targetInventoryId!,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventory-items', sourceInventoryId],
      });

      queryClient.invalidateQueries({
        queryKey: ['inventory-items', targetInventoryId],
      });
    },
  });
};