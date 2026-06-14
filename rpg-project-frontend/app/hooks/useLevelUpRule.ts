import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';

export const useLevelUpRules =
  createGetAllHook(
    'level-up-rules',
    gameService.getLevelUpRules
  );

export const useLevelUpRule =
  createGetByIdHook(
    'level-up-rule',
    gameService.getLevelUpRuleById
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