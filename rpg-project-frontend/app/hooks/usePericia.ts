import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const usePericias =
  createGetAllHook(
    'pericias',
    gameService.getPericias
  );

export const usePericia =
  createGetByIdHook(
    'pericia',
    gameService.getPericiaById
  );

export const useCreatePericia =
  createCreateHook(
    'pericias',
    gameService.createPericia
  );

export const useUpdatePericia =
  createUpdateHook(
    'pericia',
    gameService.updatePericia
  );

export const useDeletePericia =
  createDeleteHook(
    'pericia',
    gameService.deletePericia
  );