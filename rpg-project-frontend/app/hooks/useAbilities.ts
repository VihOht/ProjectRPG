import { characterRepository } from '../repositories';
import { gameService } from '../services/gameService';
import {
  createGetAllHook,
  createGetByIdHook,
  createCreateHook,
  createUpdateHook,
  createDeleteHook,
} from './common';
import { useMutation, useQueryClient  } from '@tanstack/react-query';


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

export const useToggleAbilityVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (abilityId: number) => {
      return gameService.toggleAbilityVisibility(abilityId);
    },
    onSuccess: () => {
      // Invalidate the abilities query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['abilities'],
      });
    }
  });
};

export const useAssignAbilityToCharacter = (characterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (abilityId: number) => {
      return characterRepository.assignAbilityToCharacter(abilityId, characterId);
    },
    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(['character', characterId], updatedCharacter);
      // Invalidate the characters query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    }
  });
};

export const useUnassignAbilityFromCharacter = (characterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (abilityId: number) => {
      return characterRepository.unassignAbilityFromCharacter(abilityId, characterId);
    },
    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(['character', characterId], updatedCharacter);
      // Invalidate the characters query to refetch the updated data
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    }
  });
};