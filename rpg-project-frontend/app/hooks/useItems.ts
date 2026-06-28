// ======================================================
// ITEMS
// ======================================================

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { gameService } from "../services";

import type { ToggleItemTemporaryResponse, ToggleItemVisibilityResponse, UpdateItemRequest, UpdateItemResponse } from "../types";
import { createCreateHook, createDeleteHook, createGetAllHook, createGetByIdHook, type ApiError } from "./common";
import type { AxiosError } from "axios";

export const useItems =
  createGetAllHook(
    'items',
    gameService.getItems
  );

export const useItem =
  createGetByIdHook(
    'item',
    gameService.getItemById
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