
import { gameService } from '../services/gameService';
import { subclassesRepository } from '../repositories/gameDataRepositories';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useSubclasses =
  createGetAllHookV2(
    'subclasses',
    subclassesRepository.getAll,
    subclassesRepository.syncAll
  );

export const useSubclass =
  createGetByIdHookV2(
    'subclass',
    subclassesRepository.getById,
    subclassesRepository.syncById
  );

export const useCreateSubclass =
  createCreateHook(
    'subclasses',
    gameService.createSubclass
  );

export const useUpdateSubclass =
  createUpdateHook(
    'subclass',
    gameService.updateSubclass
  );

export const useDeleteSubclass =
  createDeleteHook(
    'subclass',
    gameService.deleteSubclass
  );
