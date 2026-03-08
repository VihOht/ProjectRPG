import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { characterService } from '../services/character';
import type {
  CreateCharacterRequest,
  CreateCharacterResponse,
  GetCharacterResponse,
  GetAllCharactersResponse,
  UpdateCharacterRequest,
  UpdateCharacterResponse,
  DeleteCharacterResponse,
  CreateAbilityRequest,
  CreateAbilityResponse,
  GetAbilityResponse,
  GetAllAbilitiesResponse,
  UpdateAbilityRequest,
  UpdateAbilityResponse,
  DeleteAbilityResponse,
  CreateRaceRequest,
  CreateRaceResponse,
  GetRaceResponse,
  GetAllRacesResponse,
  UpdateRaceRequest,
  UpdateRaceResponse,
  DeleteRaceResponse,
  CreateAttributeRequest,
  CreateAttributeResponse,
  GetAttributeResponse,
  GetAllAttributesResponse,
  UpdateAttributeRequest,
  UpdateAttributeResponse,
  DeleteAttributeResponse,
  GetCharacterAttributesResponse,
  UpdateCharacterAttributesRequest,
  UpdateCharacterAttributesResponse,
  CreateClassRequest,
  CreateClassResponse,
  GetClassResponse,
  GetAllClassesResponse,
  UpdateClassRequest,
  UpdateClassResponse,
  DeleteClassResponse,
  CreateSubclassRequest,
  CreateSubclassResponse,
  GetSubclassResponse,
  GetAllSubclassesResponse,
  UpdateSubclassRequest,
  UpdateSubclassResponse,
  DeleteSubclassResponse,
} from '../types/character';
import { AxiosError } from 'axios';

interface CharacterApiError {
  message?: string;
}

/**
 * Hook to get all characters for the current user
 */
export const useGetCharacters = (): UseQueryResult<GetAllCharactersResponse, AxiosError> => {
  return useQuery<GetAllCharactersResponse, AxiosError>({
    queryKey: ['characters'],
    queryFn: characterService.getAllCharacters,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a specific character by ID
 */
export const useGetCharacter = (
  characterId: number | null
): UseQueryResult<GetCharacterResponse, AxiosError> => {
  return useQuery<GetCharacterResponse, AxiosError>({
    queryKey: ['character', characterId],
    queryFn: () => characterService.getCharacterById(characterId!),
    enabled: !!characterId, // Only run if characterId is provided
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new character
 */
export const useCreateCharacter = (): UseMutationResult<
  CreateCharacterResponse,
  AxiosError<CharacterApiError>,
  CreateCharacterRequest
> => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCharacterResponse,
    AxiosError<CharacterApiError>,
    CreateCharacterRequest
  >({
    mutationFn: characterService.createCharacter,
    onSuccess: () => {
      // Invalidate characters list to refetch
      queryClient.invalidateQueries({ queryKey: ['characters'] });

      // Optionally navigate to character sheet
      // const navigate = useNavigate();
      // navigate(`/ficha/${data.character.id}`);
    },
    onError: (error) => {
      console.error('Failed to create character:', error);
    },
  });
};

/**
 * Hook to update a character
 */
export const useUpdateCharacter = (
  characterId: number | null
): UseMutationResult<
  UpdateCharacterResponse,
  AxiosError<CharacterApiError>,
  UpdateCharacterRequest
> => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateCharacterResponse,
    AxiosError<CharacterApiError>,
    UpdateCharacterRequest
  >({
    mutationFn: (data) => characterService.updateCharacter(characterId!, data),
    onSuccess: () => {
      // Invalidate specific character and list
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
    onError: (error) => {
      console.error('Failed to update character:', error);
    },
  });
};

/**
 * Hook to delete a character
 */
export const useDeleteCharacter = (): UseMutationResult<
  DeleteCharacterResponse,
  AxiosError<CharacterApiError>,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCharacterResponse, AxiosError<CharacterApiError>, number>({
    mutationFn: characterService.deleteCharacter,
    onSuccess: () => {
      // Invalidate and refetch characters list
      queryClient.invalidateQueries({ queryKey: ['characters'] });

      // Optionally navigate back to home/characters list
      // const navigate = useNavigate();
      // navigate('/');
    },
    onError: (error) => {
      console.error('Failed to delete character:', error);
    },
  });
};

/**
 * Hook for managing character operations (combined state)
 */
export const useCharacter = (characterId: number | null = null) => {
  const getCharacters = useGetCharacters();
  const getCharacter = useGetCharacter(characterId);
  const createCharacter = useCreateCharacter();
  const updateCharacter = useUpdateCharacter(characterId);
  const deleteCharacter = useDeleteCharacter();

  return {
    // Queries
    characters: getCharacters.data?.characters || [],
    selectedCharacter: getCharacter.data?.character || null,
    isLoadingCharacters: getCharacters.isLoading,
    isLoadingCharacter: getCharacter.isLoading,
    charactersError: getCharacters.error,
    characterError: getCharacter.error,

    // Mutations
    createCharacter,
    updateCharacter,
    deleteCharacter,

    // Helper states
    isCreating: createCharacter.isPending,
    isUpdating: updateCharacter.isPending,
    isDeleting: deleteCharacter.isPending,
    creationError: createCharacter.error?.response?.data?.message,
    updateError: updateCharacter.error?.response?.data?.message,
    deletionError: deleteCharacter.error?.response?.data?.message,
  };
};

/**
 * Hook to get all abilities
 */
export const useGetAbilities = (): UseQueryResult<GetAllAbilitiesResponse, AxiosError> => {
  return useQuery<GetAllAbilitiesResponse, AxiosError>({
    queryKey: ['abilities'],
    queryFn: characterService.getAllAbilities,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAbility = (
  abilityId: number | null
): UseQueryResult<GetAbilityResponse, AxiosError> => {
  return useQuery<GetAbilityResponse, AxiosError>({
    queryKey: ['ability', abilityId],
    queryFn: () => characterService.getAbilityById(abilityId!),
    enabled: !!abilityId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAbility = (): UseMutationResult<
  CreateAbilityResponse,
  AxiosError<CharacterApiError>,
  CreateAbilityRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.createAbility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abilities'] });
    },
  });
};

export const useUpdateAbility = (abilityId: number | null): UseMutationResult<
  UpdateAbilityResponse,
  AxiosError<CharacterApiError>,
  UpdateAbilityRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => characterService.updateAbility(abilityId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abilities'] });
    },
  });
};

export const useDeleteAbility = (): UseMutationResult<
  DeleteAbilityResponse,
  AxiosError<CharacterApiError>,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.deleteAbility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abilities'] });
    },
  });
};

/**
 * Hook to get all races
 */
export const useGetRaces = (): UseQueryResult<GetAllRacesResponse, AxiosError> => {
  return useQuery<GetAllRacesResponse, AxiosError>({
    queryKey: ['races'],
    queryFn: characterService.getAllRaces,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetRace = (
  raceId: number | null
): UseQueryResult<GetRaceResponse, AxiosError> => {
  return useQuery<GetRaceResponse, AxiosError>({
    queryKey: ['race', raceId],
    queryFn: () => characterService.getRaceById(raceId!),
    enabled: !!raceId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRace = (): UseMutationResult<
  CreateRaceResponse,
  AxiosError<CharacterApiError>,
  CreateRaceRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.createRace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] });
    },
  });
};

export const useUpdateRace = (raceId: number | null): UseMutationResult<
  UpdateRaceResponse,
  AxiosError<CharacterApiError>,
  UpdateRaceRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => characterService.updateRace(raceId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] });
    },
  });
};

export const useDeleteRace = (): UseMutationResult<
  DeleteRaceResponse,
  AxiosError<CharacterApiError>,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.deleteRace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] });
    },
  });
};

/**
 * Hook to get all attribute definitions
 */
export const useGetAttributes = (): UseQueryResult<GetAllAttributesResponse, AxiosError> => {
  return useQuery<GetAllAttributesResponse, AxiosError>({
    queryKey: ['attributes'],
    queryFn: characterService.getAllAttributes,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAttribute = (
  attributeId: number | null
): UseQueryResult<GetAttributeResponse, AxiosError> => {
  return useQuery<GetAttributeResponse, AxiosError>({
    queryKey: ['attribute', attributeId],
    queryFn: () => characterService.getAttributeById(attributeId!),
    enabled: !!attributeId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAttribute = (): UseMutationResult<
  CreateAttributeResponse,
  AxiosError<CharacterApiError>,
  CreateAttributeRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.createAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });
};

export const useUpdateAttribute = (attributeId: number | null): UseMutationResult<
  UpdateAttributeResponse,
  AxiosError<CharacterApiError>,
  UpdateAttributeRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => characterService.updateAttribute(attributeId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });
};

export const useDeleteAttribute = (): UseMutationResult<
  DeleteAttributeResponse,
  AxiosError<CharacterApiError>,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.deleteAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
  });
};

/**
 * Hook for one character's attribute values
 */
export const useGetCharacterAttributes = (
  characterId: number | null
): UseQueryResult<GetCharacterAttributesResponse, AxiosError> => {
  return useQuery<GetCharacterAttributesResponse, AxiosError>({
    queryKey: ['characterAttributes', characterId],
    queryFn: () => characterService.getCharacterAttributes(characterId!),
    enabled: !!characterId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateCharacterAttributes = (
  characterId: number | null
): UseMutationResult<
  UpdateCharacterAttributesResponse,
  AxiosError<CharacterApiError>,
  UpdateCharacterAttributesRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => characterService.updateCharacterAttributes(characterId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characterAttributes', characterId] });
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
    },
  });
};

/**
 * Hook to get all classes
 */
export const useGetClasses = (): UseQueryResult<GetAllClassesResponse, AxiosError> => {
  return useQuery<GetAllClassesResponse, AxiosError>({
    queryKey: ['classes'],
    queryFn: characterService.getAllClasses,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetClass = (
  classId: number | null
): UseQueryResult<GetClassResponse, AxiosError> => {
  return useQuery<GetClassResponse, AxiosError>({
    queryKey: ['class', classId],
    queryFn: () => characterService.getClassById(classId!),
    enabled: !!classId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateClass = (): UseMutationResult<
  CreateClassResponse,
  AxiosError<CharacterApiError>,
  CreateClassRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useUpdateClass = (classId: number | null): UseMutationResult<
  UpdateClassResponse,
  AxiosError<CharacterApiError>,
  UpdateClassRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => characterService.updateClass(classId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useDeleteClass = (): UseMutationResult<
  DeleteClassResponse,
  AxiosError<CharacterApiError>,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

/**
 * Hook to get all subclasses
 */
export const useGetSubclasses = (): UseQueryResult<GetAllSubclassesResponse, AxiosError> => {
  return useQuery<GetAllSubclassesResponse, AxiosError>({
    queryKey: ['subclasses'],
    queryFn: characterService.getAllSubclasses,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSubclass = (
  subclassId: number | null
): UseQueryResult<GetSubclassResponse, AxiosError> => {
  return useQuery<GetSubclassResponse, AxiosError>({
    queryKey: ['subclass', subclassId],
    queryFn: () => characterService.getSubclassById(subclassId!),
    enabled: !!subclassId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSubclass = (): UseMutationResult<
  CreateSubclassResponse,
  AxiosError<CharacterApiError>,
  CreateSubclassRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.createSubclass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subclasses'] });
    },
  });
};

export const useUpdateSubclass = (subclassId: number | null): UseMutationResult<
  UpdateSubclassResponse,
  AxiosError<CharacterApiError>,
  UpdateSubclassRequest
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => characterService.updateSubclass(subclassId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subclasses'] });
    },
  });
};

export const useDeleteSubclass = (): UseMutationResult<
  DeleteSubclassResponse,
  AxiosError<CharacterApiError>,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterService.deleteSubclass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subclasses'] });
    },
  });
};

/**
 * Combined hook for metadata used by character forms
 */
export const useCharacterMeta = () => {
  const abilitiesQuery = useGetAbilities();
  const racesQuery = useGetRaces();
  const attributesQuery = useGetAttributes();
  const classesQuery = useGetClasses();
  const subclassesQuery = useGetSubclasses();

  return {
    abilities: abilitiesQuery.data?.abilities ?? [],
    races: racesQuery.data?.races ?? [],
    attributes: attributesQuery.data?.attributes ?? [],
    classes: classesQuery.data?.classes ?? [],
    subclasses: subclassesQuery.data?.subclasses ?? [],
    isLoading:
      abilitiesQuery.isLoading ||
      racesQuery.isLoading ||
      attributesQuery.isLoading ||
      classesQuery.isLoading ||
      subclassesQuery.isLoading,
    errors: {
      abilities: abilitiesQuery.error,
      races: racesQuery.error,
      attributes: attributesQuery.error,
      classes: classesQuery.error,
      subclasses: subclassesQuery.error,
    },
  };
};
