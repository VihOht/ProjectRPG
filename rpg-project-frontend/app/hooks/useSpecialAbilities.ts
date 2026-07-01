import { gameService } from '../services/gameService';
import { specialAbilitiesRepository } from '../repositories/gameDataRepositories';
import {
    createGetAllHookV2,
    createGetByIdHookV2,
    createUpdateHook,
    createDeleteHook,
} from './common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { characterRepository } from '../repositories';
import type { CreateSpecialAbilityRequest } from '../types';


export const useGetAllSpecialAbilities = 
    createGetAllHookV2(
        'specialAbilities',
        specialAbilitiesRepository.getAll,
        specialAbilitiesRepository.syncAll
    );

export const useGetSpecialAbilityById =
    createGetByIdHookV2(
        'specialAbility',
        specialAbilitiesRepository.getById,
        specialAbilitiesRepository.syncById
    );

export function useCreateSpecialAbility() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSpecialAbilityRequest) => characterRepository.createSpecialAbilityForCharacter(data.character_id, data),
        onSuccess: (updatedCharacter) => {
            queryClient.setQueryData(['character', updatedCharacter.character.id], updatedCharacter);
            queryClient.invalidateQueries({ queryKey: ['specialAbilities'] });
        }
    });
}

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
