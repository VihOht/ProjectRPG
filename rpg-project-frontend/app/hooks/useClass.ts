
import { classesRepository } from '../repositories/classesRepository';
import { gameService } from '../services/gameService';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useClasses =
  createGetAllHookV2(
    'classes',
    classesRepository.getClasses,
    classesRepository.syncClasses
  );

export const useClass =
  createGetByIdHookV2(
    'class',
    classesRepository.getClass,
    classesRepository.syncClass
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
