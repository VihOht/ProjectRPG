

// Local form types (existing)
export type characterInformation = {
    nome: string;
    classe: string;
    segunda_classe: string;
    raca: string;
    genero: string;
    idade: number;
    subclasse: string;
    nivel: number;
}

export type characterStats = {
    pv: number;
    defesa: number;
    ocult: number;
    san: number;
    mana: number;
}

export type StatLimit = {
    base_max: number;
    bonus_max: number;
    total_max: number;
}

export type CharacterStatLimits = {
    life: StatLimit;
    defense: StatLimit;
    sanity: StatLimit;
    ocultism: StatLimit;
    mana: StatLimit;
}

export type characterAttribute = {
  attribute_id?: number;
    nome: string;
    base: number;
    bonus: number;
    total: number;
    dt: number;
}

export type characterAttributes = characterAttribute[];

export type characterData = {
    informations: characterInformation;
    stats: characterStats;
    atributos: characterAttributes;
}

// ============================================
// API DTOs for Backend Communication
// ============================================

export interface CharacterAbility {
  id: number;
  name: string;
  description: string;
}

export interface CharacterClass {
  id: number;
  name: string;
  description: string;
}

export interface CharacterSubclass {
  id: number;
  name: string;
  description: string;
  class_id: number;
}

export interface CharacterRace {
  id: number;
  name: string;
  description: string;
}

export interface CharacterAttributeValue {
  id: number;
  attribute_id: number;
  name: string;
  base: number;
  bonus: number;
  total: number;
}

// Main Character DTO
export interface Character {
  id: number;
  own: number; // user_id (owner)
  name: string;
  charClass: number; // class_id
  subclass?: number; // subclass_id
  second_class?: number; // second class_id
  race: number; // race_id
  gender: string;
  age: number;
  level: number;
  life: number;
  defense: number;
  sanity: number;
  ocultism: number;
  mana: number;
  base_life?: number;
  base_defense?: number;
  base_sanity?: number;
  base_ocultism?: number;
  base_mana?: number;
  stat_limits?: CharacterStatLimits;
  attributes?: CharacterAttributeValue[];
  abilities?: CharacterAbility[];
}

// Create Character Request
export interface CreateCharacterRequest {
  name?: string;
}

// Create Character Response
export interface CreateCharacterResponse {
  message: string;
  character: Character;
}

// Get Character Response
export interface GetCharacterResponse {
  character: Character;
}

// Get All Characters Response
export interface GetAllCharactersResponse {
  message: string;
  characters: Character[];
}

// Update Character Request
export interface UpdateCharacterRequest {
  name?: string;
  charClass?: number;
  subclass?: number;
  second_class?: number;
  race?: number;
  gender?: string;
  age?: number;
  level?: number;
  life?: number;
  defense?: number;
  sanity?: number;
  ocultism?: number;
  mana?: number;
  base_life?: number;
  base_defense?: number;
  base_sanity?: number;
  base_ocultism?: number;
  base_mana?: number;
}

// Update Character Response
export interface UpdateCharacterResponse {
  message: string;
  character: Character;
}

// Delete Character Response
export interface DeleteCharacterResponse {
  message: string;
}

// Error Response
export interface CharacterErrorResponse {
  message: string;
}

// ============================================
// Ability DTOs
// ============================================

export interface CreateAbilityRequest {
  name: string;
  description: string;
  class_id?: number;
  subclass_id?: number;
  character_id?: number;
}

export interface UpdateAbilityRequest {
  name?: string;
  description?: string;
}

export interface GetAbilityResponse {
  ability: CharacterAbility;
}

export interface GetAllAbilitiesResponse {
  abilities: CharacterAbility[];
}

export interface CreateAbilityResponse {
  message: string;
  ability: CharacterAbility;
}

export interface UpdateAbilityResponse {
  message: string;
  ability: CharacterAbility;
}

export interface DeleteAbilityResponse {
  message: string;
}

// ============================================
// Race DTOs
// ============================================

export interface CreateRaceRequest {
  name: string;
  description: string;
}

export interface UpdateRaceRequest {
  name?: string;
  description?: string;
}

export interface GetRaceResponse {
  race: CharacterRace;
}

export interface GetAllRacesResponse {
  races: CharacterRace[];
}

export interface CreateRaceResponse {
  message: string;
  race: CharacterRace;
}

export interface UpdateRaceResponse {
  message: string;
  race: CharacterRace;
}

export interface DeleteRaceResponse {
  message: string;
}

// ============================================
// Attribute DTOs
// ============================================

export interface AttributeDefinition {
  id: number;
  name: string;
  description: string;
}

export interface CharacterAttributeItem {
  attribute_id: number;
  name: string;
  description: string;
  base: number;
  bonus: number;
  total: number;
  dt: number;
}

export interface CreateAttributeRequest {
  name: string;
  description: string;
}

export interface UpdateAttributeRequest {
  name?: string;
  description?: string;
}

export interface GetAttributeResponse {
  attribute: AttributeDefinition;
}

export interface GetAllAttributesResponse {
  attributes: AttributeDefinition[];
}

export interface CreateAttributeResponse {
  message: string;
  attribute: AttributeDefinition;
}

export interface UpdateAttributeResponse {
  message: string;
  attribute: AttributeDefinition;
}

export interface DeleteAttributeResponse {
  message: string;
}

export interface GetCharacterAttributesResponse {
  character_id: number;
  attributes: CharacterAttributeItem[];
}

export interface UpdateCharacterAttributesRequest {
  attributes: Array<{
    attribute_id: number;
    base: number;
    bonus: number;
  }>;
}

export interface UpdateCharacterAttributesResponse {
  message: string;
  character_id: number;
}

// ============================================
// Class DTOs
// ============================================

export interface CreateClassRequest {
  name: string;
  description: string;
  abilities?: number[];
}

export interface UpdateClassRequest {
  name?: string;
  description?: string;
}

export interface GetClassResponse {
  class: CharacterClass;
}

export interface GetAllClassesResponse {
  classes: CharacterClass[];
}

export interface CreateClassResponse {
  message: string;
  class: CharacterClass;
}

export interface UpdateClassResponse {
  message: string;
  class: CharacterClass;
}

export interface DeleteClassResponse {
  message: string;
}

// ============================================
// Subclass DTOs
// ============================================

export interface CreateSubclassRequest {
  name: string;
  description: string;
  class_id: number;
  abilities?: number[];
}

export interface UpdateSubclassRequest {
  name?: string;
  description?: string;
}

export interface GetSubclassResponse {
  subclass: CharacterSubclass;
}

export interface GetAllSubclassesResponse {
  subclasses: CharacterSubclass[];
}

export interface CreateSubclassResponse {
  message: string;
  subclass: CharacterSubclass;
}

export interface UpdateSubclassResponse {
  message: string;
  subclass: CharacterSubclass;
}

export interface DeleteSubclassResponse {
  message: string;
}