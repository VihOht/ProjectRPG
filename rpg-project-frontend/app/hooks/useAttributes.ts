// hooks/useAttributes.ts

import { gameService } from '../services/gameService';
import { attributesRepository } from '../repositories/gameDataRepositories';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useAttributes =
  createGetAllHookV2(
    'attributes',
    attributesRepository.getAll,
    attributesRepository.syncAll
  );

export const useAttribute =
  createGetByIdHookV2(
    'attribute',
    attributesRepository.getById,
    attributesRepository.syncById
  );

export const useCreateAttribute =
  createCreateHook(
    'attributes',
    gameService.createAttribute
  );

export const useUpdateAttribute =
  createUpdateHook(
    'attribute',
    gameService.updateAttribute
  );

export const useDeleteAttribute =
  createDeleteHook(
    'attribute',
    gameService.deleteAttribute
  );
