import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useClassPowers =
  createGetAllHook(
    'class-powers',
    gameService.getClassPowers
  );

export const useClassPower =
  createGetByIdHook(
    'class-power',
    gameService.getClassPowerById
  );

export const useCreateClassPower =
  createCreateHook(
    'class-powers',
    gameService.createClassPower
  );

export const useUpdateClassPower =
  createUpdateHook(
    'class-power',
    gameService.updateClassPower
  );

export const useDeleteClassPower =
  createDeleteHook(
    'class-power',
    gameService.deleteClassPower
  );

export const useClassPowersByClassId = (classId: number) => {
  return createGetAllHook(
    `class-powers-by-class-${classId}`,
    () => gameService.getClassPowersByClassId(classId)
  )();
}

export const useToggleClassPowerVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classPowerId: number) => {
      return gameService.toggleClassPowerVisibility(classPowerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['class-powers'],
      });
    }
  });
}