import { gameService } from '../services/gameService';
import { racesRepository } from '../repositories/gameDataRepositories';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useRaces =
  createGetAllHookV2(
    'races',
    racesRepository.getAll,
    racesRepository.syncAll
  );

export const useRace =
  createGetByIdHookV2(
    'race',
    racesRepository.getById,
    racesRepository.syncById
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
