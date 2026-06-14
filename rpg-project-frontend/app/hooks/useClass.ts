
import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useClasses =
  createGetAllHook(
    'classes',
    gameService.getClasses
  );

export const useClass =
  createGetByIdHook(
    'class',
    gameService.getClassById
  );

export const useCreateClass =
  createCreateHook(
    'classes',
    gameService.createClass
  );

export const useUpdateClass =
  createUpdateHook(
    'class',
    gameService.updateClass
  );

export const useDeleteClass =
  createDeleteHook(
    'class',
    gameService.deleteClass
  );