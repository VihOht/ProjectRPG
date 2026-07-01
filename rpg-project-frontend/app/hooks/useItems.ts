// ======================================================
// ITEMS
// ======================================================

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { gameService } from "../services/gameService";
import { itemsRepository } from "../repositories/gameDataRepositories";

import type { ToggleItemTemporaryResponse, ToggleItemVisibilityResponse, UpdateItemRequest, UpdateItemResponse } from "../types";
import { createCreateHook, createDeleteHook, createGetAllHookV2, createGetByIdHookV2, type ApiError } from "./common";
import type { AxiosError } from "axios";

export const useItems =
  createGetAllHookV2(
    'items',
    itemsRepository.getAll,
    itemsRepository.syncAll
  );

export const useItem =
  createGetByIdHookV2(
    'item',
    itemsRepository.getById,
    itemsRepository.syncById
  );

export const useCreateItem =
  createCreateHook(
    'items',
    gameService.createItem
  );

export const useDeleteItem =
  createDeleteHook(
    'item',
    gameService.deleteItem
  );

export const useUpdateItem = (
  itemId: number | null
): UseMutationResult<
  UpdateItemResponse,
  AxiosError<ApiError>,
  UpdateItemRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      gameService.updateItem(itemId!, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item', itemId],
      });

      queryClient.invalidateQueries({
        queryKey: ['items'],
      });
    },
  });
};

export const useToggleItemVisibility = (
  itemId: number | null
): UseMutationResult<
  ToggleItemVisibilityResponse,
  AxiosError<ApiError>,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      gameService.toggleItemVisibility(itemId!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["item", itemId],
      });

      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
    },
  });
};

export const useToggleItemTemporary = (
  itemId: number | null
): UseMutationResult<
  ToggleItemTemporaryResponse,
  AxiosError<ApiError>,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      gameService.toggleItemTemporary(itemId!),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["item", itemId],
      });

      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
    },
  });
};
