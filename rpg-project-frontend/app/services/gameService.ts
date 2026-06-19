import { api } from './api';

import type * as T from '../types';

export const gameService = {
  // =====================================================
  // CHARACTERS
  // =====================================================

  getCharacters: async (): Promise<T.ListCharactersResponse> => {
    const response = await api.get<T.ListCharactersResponse>('/api/characters');
    return response.data;
  },

  createCharacter: async (): Promise<T.CreateCharacterResponse> => {
    const response = await api.post<T.CreateCharacterResponse>('/api/characters');
    return response.data;
  },

  getCharacterById: async (
    characterId: number
  ): Promise<T.GetCharacterResponse> => {
    const response = await api.get<T.GetCharacterResponse>(
      `/api/characters/${characterId}`
    );

    return response.data;
  },

  updateCharacterGeneral: async (
    characterId: number,
    data: T.UpdateCharacterGeneralRequest
  ): Promise<T.CreateCharacterResponse> => {
    const response = await api.put<T.CreateCharacterResponse>(
      `/api/characters/${characterId}/general`,
      data
    );

    return response.data;
  },

  updateCharacterStats: async (
    characterId: number,
    data: T.UpdateCharacterStatsRequest
  ): Promise<T.CreateCharacterResponse> => {
    const response = await api.put<T.CreateCharacterResponse>(
      `/api/characters/${characterId}/stats`,
      data
    );

    return response.data;
  },

  updateCharacterDescription: async (
    characterId: number,
    data: T.UpdateCharacterDescriptionRequest
  ): Promise<T.CreateCharacterResponse> => {
    const response = await api.put<T.CreateCharacterResponse>(
      `/api/characters/${characterId}/description`,
      data
    );

    return response.data;
  },

  updateCharacterOffsets: async (
    characterId: number,
    data: T.UpdateCharacterOffsetsRequest
  ): Promise<T.CreateCharacterResponse> => {
    const response = await api.put<T.CreateCharacterResponse>(
      `/api/characters/${characterId}/stats-offset`,
      data
    );

    return response.data;
  },

  toggleCharacterActive: async (
    characterId: number
  ): Promise<T.StandardResponse> => {
    const response = await api.post<T.StandardResponse>(
      `/api/characters/${characterId}/toggle-active-status`
    );

    return response.data;
  },

  transferCharacterOwnership: async (
    characterId: number,
    newUserId: number
  ): Promise<T.StandardResponse> => {
    const response = await api.post<T.StandardResponse>(
      `/api/characters/${characterId}/transfer-ownership/${newUserId}`
    );

    return response.data;
  },

  returnCharacterToAdmin: async (
    characterId: number
  ): Promise<T.StandardResponse> => {
    const response = await api.post<T.StandardResponse>(
      `/api/characters/${characterId}/return-to-admin`
    );

    return response.data;
  },

  deleteCharacter: async (
    characterId: number
  ): Promise<T.StandardResponse> => {
    const response = await api.delete<T.StandardResponse>(
      `/api/characters/${characterId}`
    );

    return response.data;
  },

  // =====================================================
  // CHARACTER ATTRIBUTES
  // =====================================================

  getCharacterAttributes: async (
    characterId: number
  ): Promise<T.ListCharacterAttributesResponse> => {
    const response =
      await api.get<T.ListCharacterAttributesResponse>(
        `/api/characters/${characterId}/attributes`
      );

    return response.data;
  },

  updateCharacterPericias: async (
    characterId: number,
    data: T.BulkUpdateCharacterPericiasRequest
  ): Promise<T.StandardResponse> => {
    const response = await api.put<T.StandardResponse>(
      `/api/characters/${characterId}/pericias`,
      data
    );

    return response.data;
  },

  // =====================================================
  // ATTRIBUTES
  // =====================================================

  getAttributes: async (): Promise<T.ListAttributesResponse> => {
    const response = await api.get<T.ListAttributesResponse>(
      '/api/attributes'
    );

    return response.data;
  },

  getAttributeById: async (
    attributeId: number
  ): Promise<T.GetAttributeResponse> => {
    const response = await api.get<T.GetAttributeResponse>(
      `/api/attributes/${attributeId}`
    );

    return response.data;
  },

  createAttribute: async (
    data: T.CreateAttributeRequest
  ): Promise<T.CreateAttributeResponse> => {
    const response = await api.post<T.CreateAttributeResponse>(
      '/api/attributes',
      data
    );

    return response.data;
  },

  updateAttribute: async (
    attributeId: number,
    data: T.UpdateAttributeRequest
  ): Promise<T.StandardResponse> => {
    const response = await api.put<T.StandardResponse>(
      `/api/attributes/${attributeId}`,
      data
    );

    return response.data;
  },

  deleteAttribute: async (
    attributeId: number
  ): Promise<T.StandardResponse> => {
    const response = await api.delete<T.StandardResponse>(
      `/api/attributes/${attributeId}`
    );

    return response.data;
  },

  // =====================================================
  // ATTRIBUTE POWERS
  // =====================================================

  getAttributePowers: async (): Promise<T.ListAttributePowersResponse> => {
    const response = await api.get<T.ListAttributePowersResponse>(
      '/api/attribute-powers'
    );

    return response.data;
  },

  getAttributePowerById: async (
    attributePowerId: number
  ): Promise<T.GetAttributePowerResponse> => {
    const response = await api.get<T.GetAttributePowerResponse>(
      `/api/attribute-powers/${attributePowerId}`
    );

    return response.data;
  },

  createAttributePower: async (
    data: T.CreateAttributePowerRequest
  ): Promise<T.CreateAttributePowerResponse> => {
    const response = await api.post<T.CreateAttributePowerResponse>(
      '/api/attribute-powers',
      data
    );

    return response.data;
  },

  updateAttributePower: async (
    attributePowerId: number,
    data: T.UpdateAttributePowerRequest
  ): Promise<T.UpdateAttributePowerResponse> => {
    const response = await api.put<T.UpdateAttributePowerResponse>(
      `/api/attribute-powers/${attributePowerId}`,
      data
    );

    return response.data;
  },

  deleteAttributePower: async (
    attributePowerId: number
  ): Promise<T.StandardResponse> => {
    const response = await api.delete<T.StandardResponse>(
      `/api/attribute-powers/${attributePowerId}`
    );

    return response.data;
  },

  toggleAttributePowerVisibility: async (
    attributePowerId: number
  ): Promise<T.UpdateAttributePowerResponse> => {
    const response = await api.post<T.UpdateAttributePowerResponse>(
      `/api/attribute-powers/${attributePowerId}/visibility`
    );
    return response.data;
  },

  // =====================================================
  // PERICIAS
  // =====================================================

  getPericias: async (): Promise<T.ListPericiasResponse> => {
    const response = await api.get<T.ListPericiasResponse>(
      '/api/pericias'
    );

    return response.data;
  },

  getPericiaById: async (
    periciaId: number
  ): Promise<T.GetPericiaResponse> => {
    const response = await api.get<T.GetPericiaResponse>(
      `/api/pericias/${periciaId}`
    );

    return response.data;
  },

  createPericia: async (
    data: T.CreatePericiaRequest
  ): Promise<T.CreatePericiaResponse> => {
    const response = await api.post<T.CreatePericiaResponse>(
      '/api/pericias',
      data
    );

    return response.data;
  },

  updatePericia: async (
    periciaId: number,
    data: T.UpdatePericiaRequest
  ): Promise<T.UpdatePericiaResponse> => {
    const response = await api.put<T.UpdatePericiaResponse>(
      `/api/pericias/${periciaId}`,
      data
    );

    return response.data;
  },

  deletePericia: async (
    periciaId: number
  ): Promise<T.StandardResponse> => {
    const response = await api.delete<T.StandardResponse>(
      `/api/pericias/${periciaId}`
    );

    return response.data;
  },

  // =====================================================
  // RACES
  // =====================================================

  getRaces: async (): Promise<T.ListRacesResponse> => {
    const response = await api.get<T.ListRacesResponse>('/api/races');
    return response.data;
  },

  getRaceById: async (
    raceId: number
  ): Promise<T.GetRaceResponse> => {
    const response = await api.get<T.GetRaceResponse>(
      `/api/races/${raceId}`
    );

    return response.data;
  },

  createRace: async (
    data: T.CreateRaceRequest
  ): Promise<T.CreateRaceResponse> => {
    const response = await api.post<T.CreateRaceResponse>(
      '/api/races',
      data
    );

    return response.data;
  },

  updateRace: async (
    raceId: number,
    data: T.UpdateRaceRequest
  ): Promise<T.UpdateRaceResponse> => {
    const response = await api.put<T.UpdateRaceResponse>(
      `/api/races/${raceId}`,
      data
    );

    return response.data;
  },

  deleteRace: async (
    raceId: number
  ): Promise<T.StandardResponse> => {
    const response = await api.delete<T.StandardResponse>(
      `/api/races/${raceId}`
    );

    return response.data;
  },

  toggleRaceVisibility: async (
    raceId: number
  ): Promise<T.UpdateRaceResponse> => {
    const response = await api.post<T.UpdateRaceResponse>(
      `/api/races/${raceId}/visibility`
    );

    return response.data;
  },

  // =====================================================
  // ABILITIES
  // =====================================================

  getAbilities: async (): Promise<T.ListAbilitiesResponse> => {
    return (await api.get('/api/abilities')).data;
  },

  getAbilityById: async (
    abilityId: number
  ): Promise<T.GetAbilityResponse> => {
    return (await api.get(`/api/abilities/${abilityId}`)).data;
  },

  createAbility: async (
    data: T.CreateAbilityRequest
  ): Promise<T.CreateAbilityResponse> => {
    return (await api.post('/api/abilities', data)).data;
  },

  updateAbility: async (
    abilityId: number,
    data: T.UpdateAbilityRequest
  ): Promise<T.UpdateAbilityResponse> => {
    return (await api.put(`/api/abilities/${abilityId}`, data)).data;
  },

  deleteAbility: async (
    abilityId: number
  ): Promise<T.StandardResponse> => {
    return (await api.delete(`/api/abilities/${abilityId}`)).data;
  },

  toggleAbilityVisibility: async (
    abilityId: number
  ): Promise<T.UpdateAbilityResponse> => {
    return (await api.post(`/api/abilities/${abilityId}/visibility`)).data;
  },

  assignAbilityToCharacter: async (
    abilityId: number,
    characterId: number
  ): Promise<T.StandardResponse> => {
    return (await api.post(`/api/abilities/${abilityId}/assign/${characterId}`)).data;
  },
  
  unassignAbilityFromCharacter: async (
    abilityId: number,
    characterId: number
  ): Promise<T.StandardResponse> => {
    return (await api.post(`/api/abilities/${abilityId}/unassign/${characterId}`)).data;
  },


  // =====================================================
  // CHARACTER SPECIAL ABILITIES
  // =====================================================  

  getSpecialAbilities: async (): Promise<T.ListSpecialAbilitiesResponse> => {
    return (await api.get('/api/special-abilities')).data;
  },

  getSpecialAbilityById: async (
    specialAbilityId: number
  ): Promise<T.GetSpecialAbilityResponse> => {
    return (await api.get(`/api/special-abilities/${specialAbilityId}`)).data;
  },

  createSpecialAbility: async (
    data: T.CreateSpecialAbilityRequest
  ): Promise<T.CreateSpecialAbilityResponse> => {
    return (await api.post('/api/special-abilities', data)).data;
  },

  updateSpecialAbility: async (
    specialAbilityId: number,
    data: T.UpdateSpecialAbilityRequest
  ): Promise<T.StandardResponse> => {
    return (await api.put(`/api/special-abilities/${specialAbilityId}`, data)).data;
  },

  deleteSpecialAbility: async (
    specialAbilityId: number
  ): Promise<{}> => {
    return (await api.delete(`/api/special-abilities/${specialAbilityId}`)).data;
  },

  // =====================================================
  // CLASS POWERS
  // =====================================================

  getClassPowers: async (): Promise<T.ListClassPowersResponse> => {
    return (await api.get('/api/class-powers')).data;
  },

  getClassPowerById: async (
    powerId: number
  ): Promise<T.GetClassPowerResponse> => {
    return (await api.get(`/api/class-powers/${powerId}`)).data;
  },

  getClassPowersByClassId: async (
    classId: number
  ): Promise<T.ListClassPowersResponse> => {
    return (await api.get(`/api/classes/${classId}/class-powers`)).data;
  },

  createClassPower: async (
    data: T.CreateClassPowerRequest
  ): Promise<T.CreateClassPowerResponse> => {
    return (await api.post('/api/class-powers', data)).data;
  },

  updateClassPower: async (
    powerId: number,
    data: T.UpdateClassPowerRequest
  ): Promise<T.UpdateClassPowerResponse> => {
    return (await api.put(`/api/class-powers/${powerId}`, data)).data;
  },

  deleteClassPower: async (
    powerId: number
  ): Promise<T.StandardResponse> => {
    return (await api.delete(`/api/class-powers/${powerId}`)).data;
  },

  toggleClassPowerVisibility: async (
    powerId: number
  ): Promise<T.UpdateClassPowerResponse> => {
    return (await api.post(`/api/class-powers/${powerId}/visibility`)).data;
  },

  // =====================================================
  // CLASSES
  // =====================================================

  getClasses: async (): Promise<T.ListClassesResponse> => {
    return (await api.get('/api/classes')).data;
  },

  getClassById: async (
    classId: number
  ): Promise<T.GetClassResponse> => {
    return (await api.get(`/api/classes/${classId}`)).data;
  },

  createClass: async (
    data: T.CreateClassRequest
  ): Promise<T.CreateClassResponse> => {
    return (await api.post('/api/classes', data)).data;
  },

  updateClass: async (
    classId: number,
    data: T.UpdateClassRequest
  ): Promise<T.UpdateClassResponse> => {
    return (await api.put(`/api/classes/${classId}`, data)).data;
  },

  deleteClass: async (
    classId: number
  ): Promise<T.StandardResponse> => {
    return (await api.delete(`/api/classes/${classId}`)).data;
  },

  // =====================================================
  // SUBCLASSES
  // =====================================================

  getSubclasses: async (): Promise<T.ListSubclassesResponse> => {
    return (await api.get('/api/subclasses')).data;
  },

  getSubclassById: async (
    subclassId: number
  ): Promise<T.GetSubclassResponse> => {
    return (await api.get(`/api/subclasses/${subclassId}`)).data;
  },

  createSubclass: async (
    data: T.CreateSubclassRequest
  ): Promise<T.CreateSubclassResponse> => {
    return (await api.post('/api/subclasses', data)).data;
  },

  updateSubclass: async (
    subclassId: number,
    data: T.UpdateSubclassRequest
  ): Promise<T.UpdateSubclassResponse> => {
    return (await api.put(`/api/subclasses/${subclassId}`, data)).data;
  },

  deleteSubclass: async (
    subclassId: number
  ): Promise<T.StandardResponse> => {
    return (await api.delete(`/api/subclasses/${subclassId}`)).data;
  },

  // =====================================================
  // CONVERSION RULES
  // =====================================================

  getConversionRules: async (): Promise<T.ListConversionRulesResponse> => {
    return (await api.get('/api/conversion-rules')).data;
  },

  getConversionRuleById: async (
    ruleId: number
  ): Promise<T.GetConversionRuleResponse> => {
    return (await api.get(`/api/conversion-rules/${ruleId}`)).data;
  },

  createConversionRule: async (
    data: T.CreateConversionRuleRequest
  ): Promise<T.CreateConversionRuleResponse> => {
    return (await api.post('/api/conversion-rules', data)).data;
  },

  updateConversionRule: async (
    ruleId: number,
    data: T.UpdateConversionRuleRequest
  ): Promise<T.CreateConversionRuleResponse> => {
    return (await api.put(`/api/conversion-rules/${ruleId}`, data)).data;
  },

  deleteConversionRule: async (
    ruleId: number
  ): Promise<T.StandardResponse> => {
    return (await api.delete(`/api/conversion-rules/${ruleId}`)).data;
  },

  // =====================================================
  // LEVEL UP RULES
  // =====================================================

  getLevelUpRules: async (): Promise<T.ListLevelUpRulesResponse> => {
    return (await api.get('/api/level-up-rules')).data;
  },

  getLevelUpRuleById: async (
    ruleId: number
  ): Promise<T.GetLevelUpRuleResponse> => {
    return (await api.get(`/api/level-up-rules/${ruleId}`)).data;
  },

  createLevelUpRule: async (
    data: T.CreateLevelUpRuleRequest
  ): Promise<T.CreateLevelUpRuleResponse> => {
    return (await api.post('/api/level-up-rules', data)).data;
  },

  updateLevelUpRule: async (
    ruleId: number,
    data: T.UpdateLevelUpRuleRequest
  ): Promise<T.CreateLevelUpRuleResponse> => {
    return (await api.put(`/api/level-up-rules/${ruleId}`, data)).data;
  },

  deleteLevelUpRule: async (
    ruleId: number
  ): Promise<T.StandardResponse> => {
    return (await api.delete(`/api/level-up-rules/${ruleId}`)).data;
  },
};

export default gameService;