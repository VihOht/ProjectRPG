import { api } from './api';
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

/**
 * Character Service
 * Handles all character-related API calls
 */
export const characterService = {
  /**
   * Create a new character
   */
  createCharacter: async (data: CreateCharacterRequest): Promise<CreateCharacterResponse> => {
    const response = await api.post<CreateCharacterResponse>('/api/characters', data);
    return response.data;
  },

  /**
   * Get all characters for current user
   */
  getAllCharacters: async (): Promise<GetAllCharactersResponse> => {
    const response = await api.get<GetAllCharactersResponse>('/api/characters');
    return response.data;
  },

  /**
   * Get a specific character by ID
   */
  getCharacterById: async (characterId: number): Promise<GetCharacterResponse> => {
    const response = await api.get<GetCharacterResponse>(`/api/characters/${characterId}`);
    return response.data;
  },

  /**
   * Update a character
   */
  updateCharacter: async (
    characterId: number,
    data: UpdateCharacterRequest
  ): Promise<UpdateCharacterResponse> => {
    const response = await api.put<UpdateCharacterResponse>(`/api/characters/${characterId}`, data);
    return response.data;
  },

  /**
   * Delete a character
   */
  deleteCharacter: async (characterId: number): Promise<DeleteCharacterResponse> => {
    const response = await api.delete<DeleteCharacterResponse>(`/api/characters/${characterId}`);
    return response.data;
  },

  // ==================== ABILITIES ====================

  getAllAbilities: async (): Promise<GetAllAbilitiesResponse> => {
    const response = await api.get<GetAllAbilitiesResponse>('/api/abilities');
    return response.data;
  },

  createAbility: async (data: CreateAbilityRequest): Promise<CreateAbilityResponse> => {
    const response = await api.post<CreateAbilityResponse>('/api/abilities', data);
    return response.data;
  },

  getAbilityById: async (abilityId: number): Promise<GetAbilityResponse> => {
    const response = await api.get<GetAbilityResponse>(`/api/abilities/${abilityId}`);
    return response.data;
  },

  updateAbility: async (
    abilityId: number,
    data: UpdateAbilityRequest
  ): Promise<UpdateAbilityResponse> => {
    const response = await api.put<UpdateAbilityResponse>(`/api/abilities/${abilityId}`, data);
    return response.data;
  },

  deleteAbility: async (abilityId: number): Promise<DeleteAbilityResponse> => {
    const response = await api.delete<DeleteAbilityResponse>(`/api/abilities/${abilityId}`);
    return response.data;
  },

  // ==================== RACES ====================

  getAllRaces: async (): Promise<GetAllRacesResponse> => {
    const response = await api.get<GetAllRacesResponse>('/api/races');
    return response.data;
  },

  createRace: async (data: CreateRaceRequest): Promise<CreateRaceResponse> => {
    const response = await api.post<CreateRaceResponse>('/api/races', data);
    return response.data;
  },

  getRaceById: async (raceId: number): Promise<GetRaceResponse> => {
    const response = await api.get<GetRaceResponse>(`/api/races/${raceId}`);
    return response.data;
  },

  updateRace: async (raceId: number, data: UpdateRaceRequest): Promise<UpdateRaceResponse> => {
    const response = await api.put<UpdateRaceResponse>(`/api/races/${raceId}`, data);
    return response.data;
  },

  deleteRace: async (raceId: number): Promise<DeleteRaceResponse> => {
    const response = await api.delete<DeleteRaceResponse>(`/api/races/${raceId}`);
    return response.data;
  },

  // ==================== ATTRIBUTES ====================

  getAllAttributes: async (): Promise<GetAllAttributesResponse> => {
    const response = await api.get<GetAllAttributesResponse>('/api/attributes');
    return response.data;
  },

  createAttribute: async (data: CreateAttributeRequest): Promise<CreateAttributeResponse> => {
    const response = await api.post<CreateAttributeResponse>('/api/attributes', data);
    return response.data;
  },

  getAttributeById: async (attributeId: number): Promise<GetAttributeResponse> => {
    const response = await api.get<GetAttributeResponse>(`/api/attributes/${attributeId}`);
    return response.data;
  },

  updateAttribute: async (
    attributeId: number,
    data: UpdateAttributeRequest
  ): Promise<UpdateAttributeResponse> => {
    const response = await api.put<UpdateAttributeResponse>(`/api/attributes/${attributeId}`, data);
    return response.data;
  },

  deleteAttribute: async (attributeId: number): Promise<DeleteAttributeResponse> => {
    const response = await api.delete<DeleteAttributeResponse>(`/api/attributes/${attributeId}`);
    return response.data;
  },

  getCharacterAttributes: async (characterId: number): Promise<GetCharacterAttributesResponse> => {
    const response = await api.get<GetCharacterAttributesResponse>(`/api/characters/${characterId}/attributes`);
    return response.data;
  },

  updateCharacterAttributes: async (
    characterId: number,
    data: UpdateCharacterAttributesRequest
  ): Promise<UpdateCharacterAttributesResponse> => {
    const response = await api.put<UpdateCharacterAttributesResponse>(
      `/api/characters/${characterId}/attributes`,
      data
    );
    return response.data;
  },

  // ==================== CLASSES ====================

  getAllClasses: async (): Promise<GetAllClassesResponse> => {
    const response = await api.get<GetAllClassesResponse>('/api/classes');
    return response.data;
  },

  createClass: async (data: CreateClassRequest): Promise<CreateClassResponse> => {
    const response = await api.post<CreateClassResponse>('/api/classes', data);
    return response.data;
  },

  getClassById: async (classId: number): Promise<GetClassResponse> => {
    const response = await api.get<GetClassResponse>(`/api/classes/${classId}`);
    return response.data;
  },

  updateClass: async (classId: number, data: UpdateClassRequest): Promise<UpdateClassResponse> => {
    const response = await api.put<UpdateClassResponse>(`/api/classes/${classId}`, data);
    return response.data;
  },

  deleteClass: async (classId: number): Promise<DeleteClassResponse> => {
    const response = await api.delete<DeleteClassResponse>(`/api/classes/${classId}`);
    return response.data;
  },

  // ==================== SUBCLASSES ====================

  getAllSubclasses: async (): Promise<GetAllSubclassesResponse> => {
    const response = await api.get<GetAllSubclassesResponse>('/api/subclasses');
    return response.data;
  },

  createSubclass: async (data: CreateSubclassRequest): Promise<CreateSubclassResponse> => {
    const response = await api.post<CreateSubclassResponse>('/api/subclasses', data);
    return response.data;
  },

  getSubclassById: async (subclassId: number): Promise<GetSubclassResponse> => {
    const response = await api.get<GetSubclassResponse>(`/api/subclasses/${subclassId}`);
    return response.data;
  },

  updateSubclass: async (
    subclassId: number,
    data: UpdateSubclassRequest
  ): Promise<UpdateSubclassResponse> => {
    const response = await api.put<UpdateSubclassResponse>(`/api/subclasses/${subclassId}`, data);
    return response.data;
  },

  deleteSubclass: async (subclassId: number): Promise<DeleteSubclassResponse> => {
    const response = await api.delete<DeleteSubclassResponse>(`/api/subclasses/${subclassId}`);
    return response.data;
  },
};

export default characterService;
