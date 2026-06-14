import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useAbilities =
  createGetAllHook(
    'abilities',
    gameService.getAbilities
  );

export const useAbility =
  createGetByIdHook(
    'ability',
    gameService.getAbilityById
  );

export const useCreateAbility =
  createCreateHook(
    'abilities',
    gameService.createAbility
  );

export const useUpdateAbility =
  createUpdateHook(
    'ability',
    gameService.updateAbility
  );

export const useDeleteAbility =
  createDeleteHook(
    'ability',
    gameService.deleteAbility
  );