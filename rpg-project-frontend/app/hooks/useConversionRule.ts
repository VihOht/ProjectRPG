
import { gameService } from '../services/gameService';
import { conversionRulesRepository } from '../repositories/gameDataRepositories';
import {
  createGetAllHookV2,
  createGetByIdHookV2,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';


export const useConversionRules =
  createGetAllHookV2(
    'conversion-rules',
    conversionRulesRepository.getAll,
    conversionRulesRepository.syncAll
  );

export const useConversionRule =
  createGetByIdHookV2(
    'conversion-rule',
    conversionRulesRepository.getById,
    conversionRulesRepository.syncById
  );

export const useCreateConversionRule =
  createCreateHook(
    'conversion-rules',
    gameService.createConversionRule
  );

export const useUpdateConversionRule =
  createUpdateHook(
    'conversion-rule',
    gameService.updateConversionRule
  );

export const useDeleteConversionRule =
  createDeleteHook(
    'conversion-rule',
    gameService.deleteConversionRule
  );
