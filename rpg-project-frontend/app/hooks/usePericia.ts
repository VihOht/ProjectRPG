import { gameService } from '../services/gameService';
import { periciasRepository } from '../repositories/gameDataRepositories';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const usePericias =
  createGetAllHookV2(
    'pericias',
    periciasRepository.getAll,
    periciasRepository.syncAll
  );

export const usePericia =
  createGetByIdHookV2(
    'pericia',
    periciasRepository.getById,
    periciasRepository.syncById
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
