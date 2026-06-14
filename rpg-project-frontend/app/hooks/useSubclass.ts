
import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useSubclasses =
  createGetAllHook(
    'subclasses',
    gameService.getSubclasses
  );

export const useSubclass =
  createGetByIdHook(
    'subclass',
    gameService.getSubclassById
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