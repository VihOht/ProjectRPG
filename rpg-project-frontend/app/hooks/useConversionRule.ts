
import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';


export const useConversionRules =
  createGetAllHook(
    'conversion-rules',
    gameService.getConversionRules
  );

export const useConversionRule =
  createGetByIdHook(
    'conversion-rule',
    gameService.getConversionRuleById
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