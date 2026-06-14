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