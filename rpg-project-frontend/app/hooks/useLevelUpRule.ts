import { gameService } from '../services/gameService';
import { levelUpRulesRepository } from '../repositories/gameDataRepositories';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useLevelUpRules =
  createGetAllHookV2(
    'level-up-rules',
    levelUpRulesRepository.getAll,
    levelUpRulesRepository.syncAll
  );

export const useLevelUpRule =
  createGetByIdHookV2(
    'level-up-rule',
    levelUpRulesRepository.getById,
    levelUpRulesRepository.syncById
  );

export const useCreateLevelUpRule =
  createCreateHook(
    'level-up-rules',
    gameService.createLevelUpRule
  );

export const useUpdateLevelUpRule =
  createUpdateHook(
    'level-up-rule',
    gameService.updateLevelUpRule
  );

export const useDeleteLevelUpRule =
  createDeleteHook(
    'level-up-rule',
    gameService.deleteLevelUpRule
  );
