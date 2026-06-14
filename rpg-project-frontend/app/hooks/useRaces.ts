import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useRaces =
  createGetAllHook(
    'races',
    gameService.getRaces
  );

export const useRace =
  createGetByIdHook(
    'race',
    gameService.getRaceById
  );

export const useCreateRace =
  createCreateHook(
    'races',
    gameService.createRace
  );

export const useUpdateRace =
  createUpdateHook(
    'race',
    gameService.updateRace
  );

export const useDeleteRace =
  createDeleteHook(
    'race',
    gameService.deleteRace
  );