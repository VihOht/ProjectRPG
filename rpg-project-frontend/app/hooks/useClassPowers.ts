import { useEffect } from 'react';
import { onlineManager, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gameService } from '../services/gameService';
import { classPowersRepository } from '../repositories/gameDataRepositories';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
  DEFAULT_STALE_TIME,
} from './common';

export const useClassPowers =
  createGetAllHookV2(
    'class-powers',
    classPowersRepository.getAll,
    classPowersRepository.syncAll
  );

export const useClassPower =
  createGetByIdHookV2(
    'class-power',
    classPowersRepository.getById,
    classPowersRepository.syncById
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

export const useClassPowersByClassId = (classId: number | null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    networkMode: 'always',
    queryKey: ['class-powers-by-class', classId],
    queryFn: () => classPowersRepository.getByClassId(classId!),
    enabled: !!classId,
    staleTime: DEFAULT_STALE_TIME,
    retry: 1,
  });

  useEffect(() => {
    if (!onlineManager.isOnline() || !classId) return;

    classPowersRepository.syncByClassId(classId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['class-powers-by-class', classId] });
      queryClient.invalidateQueries({ queryKey: ['class-powers'] });
    }).catch((error) => {
      console.error('Error syncing class powers by class:', error);
    });
  }, [classId, queryClient]);

  return query;
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
