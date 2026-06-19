import { gameService } from '../services';
import {
    createGetAllHook,
    createGetByIdHook,
    createCreateHook,
    createUpdateHook,
    createDeleteHook,
} from './common';


export const useGetAllSpecialAbilities = 
    createGetAllHook(
        'specialAbilities',
        gameService.getSpecialAbilities
    );

export const useGetSpecialAbilityById =
    createGetByIdHook(
        'specialAbility',
        gameService.getSpecialAbilityById
    );

export const useCreateSpecialAbility =
    createCreateHook(
        'specialAbilities',
        gameService.createSpecialAbility
    );

export const useUpdateSpecialAbility =
    createUpdateHook(
        'specialAbility',
        gameService.updateSpecialAbility
    );

export const useDeleteSpecialAbility =
    createDeleteHook(
        'specialAbility',
        gameService.deleteSpecialAbility
    );
