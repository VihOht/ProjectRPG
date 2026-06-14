// hooks/useAttributes.ts

import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useAttributes =
  createGetAllHook(
    'attributes',
    gameService.getAttributes
  );

export const useAttribute =
  createGetByIdHook(
    'attribute',
    gameService.getAttributeById
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