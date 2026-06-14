
// ATTRIBUTES

export type AttributeItem = {
    id: number;
    description: string;
    name: string;
}

export type CreateAttributeRequest = {
    name: string;
    description: string;
}
export type CreateAttributeResponse = {
  attribute: AttributeItem;
  message: string;
}

export type ListAttributesResponse = {
  attributes: AttributeItem[];
}

export type GetAttributeResponse = {
  attribute: AttributeItem;
}

export type UpdateAttributeRequest = {
    name?: string;
    description?: string;
}

// PERICIAS

export type PericiaItem = {
    id: number;
    name: string;
    description: string;
    attribute_id: number;
}

export type ListPericiasResponse = {
  pericias: PericiaItem[];
}

export type GetPericiaResponse = {
  pericia: PericiaItem;
}

export type CreatePericiaRequest = {
    name: string;
    description: string;
    attribute_id: number;
}

export type CreatePericiaResponse = {
  pericia: PericiaItem;
  message: string;
}

export type UpdatePericiaRequest = {
    name?: string;
    description?: string;
    attribute_id?: number;
}

export type UpdatePericiaResponse = {
  pericia: PericiaItem;
  message: string;
}

// RACES


export type RaceItem = {
  id: number;
  name: string;
  description: string;
  hidden?: boolean;
}

export type CreateRaceRequest = {
  name: string;
  description: string;
}

export type CreateRaceResponse = {
  race: RaceItem;
  message: string;
}

export type ListRacesResponse = {
  races: RaceItem[];
}

export type GetRaceResponse = {
  race: RaceItem;
}

export type UpdateRaceRequest = {
  name?: string;
  description?: string;
}

export type UpdateRaceResponse = {
  race: RaceItem;
  message: string;
}

// ABILITIES

export type AbilityItem = {
  id: number;
  name: string;
  description: string;
  class_id: number | null;
  subclass_id: number | null;
  hidden?: boolean;
}

export type CreateAbilityRequest = {
  name: string;
  description: string;
  class_id?: number;
  subclass_id?: number;
}

export type CreateAbilityResponse = {
  ability: AbilityItem;
  message: string;
}

export type ListAbilitiesResponse = {
  abilities: AbilityItem[];
}

export type GetAbilityResponse = {
  ability: AbilityItem;
}

export type UpdateAbilityRequest = {
  name?: string;
  description?: string;
  class_id?: number;
  subclass_id?: number;
}

export type UpdateAbilityResponse = {
  ability: AbilityItem;
  message: string;
}

// CLASS POWER

export type ClassPowerItem = {
  id: number;
  name: string;
  description: string;
  class_id: number;
  level_to_unlock: number;
  hidden?: boolean;
}

export type CreateClassPowerRequest = {
  name: string;
  description: string;
  class_id: number;
  level_to_unlock?: number;
}

export type CreateClassPowerResponse = {
  class_power: ClassPowerItem;
  message: string;
}

export type ListClassPowersResponse = {
  class_powers: ClassPowerItem[];
}

export type GetClassPowerResponse = {
  class_power: ClassPowerItem;
}

export type UpdateClassPowerRequest = {
  name?: string;
  description?: string;
  class_id?: number;
  level_to_unlock?: number;
}

export type UpdateClassPowerResponse = {
  class_power: ClassPowerItem;
  message: string;
}


// SUBCLASS

export type SubclassItem = {
  id: number;
  name: string;
  description: string;
  class_id: number;
  abilities: AbilityItem[];
}

export type CreateSubclassRequest = {
  name: string;
  description: string;
  class_id: number;
}

export type CreateSubclassResponse = {
  subclass: SubclassItem;
  message: string;
}

export type ListSubclassesResponse = {
  subclasses: SubclassItem[];
}

export type GetSubclassResponse = {
  subclass: SubclassItem;
}

export type UpdateSubclassRequest = {
  name?: string;
  description?: string;
}

export type UpdateSubclassResponse = {
  subclass: SubclassItem;
  message: string;
}


// CLASS

export type ClassItem = {
  id: number;
  name: string;
  description: string;

  base_life: number;
  base_defense: number;
  base_sanity: number;
  base_mana: number;
  base_ocultism: number;

  has_mana: boolean;
  has_ocultism: boolean;

  abilities: AbilityItem[];
  classPowers: ClassPowerItem[];
  subclasses: SubclassItem[];
}

export type CreateClassRequest = {
  name: string;
  description: string;

  base_life?: number;
  base_defense?: number;
  base_sanity?: number;
  base_mana?: number;
  base_ocultism?: number;

  has_mana?: boolean;
  has_ocultism?: boolean;
}

export type CreateClassResponse = {
  class: ClassItem;
  message: string;
}

export type ListClassesResponse = {
  classes: ClassItem[];
}

export type GetClassResponse = {
  class: ClassItem;
}

export type UpdateClassRequest = {
  name?: string;
  description?: string;

  base_life?: number;
  base_defense?: number;
  base_sanity?: number;
  base_mana?: number;
  base_ocultism?: number;

  has_mana?: boolean;
  has_ocultism?: boolean;
}

export type UpdateClassResponse = {
  class: ClassItem;
  message: string;
}


// CHARACTER ATTRIBUTES

export type CharacterPericiaItem = {
  id: number;
  pericia_id: number;
  attribute_value_id: number;
  value: number;

  name: string;
  description: string;
  attribute_id: number;
}

export type CharacterAttributeItem = {
  id: number;
  attribute_id: number;
  character_id: number;
  value: number;

  name: string;
  description: string;

  pericias: CharacterPericiaItem[];
}

export type ListCharacterAttributesResponse = {
  attributes: CharacterAttributeItem[];
}


// CHARACTER

export type CharacterItem = {
  id: number;
  own: number;

  name: string;

  charClass: number | null;
  subclass: number | null;
  second_class: number | null;
  race: number | null;

  gender: string;
  age: number;

  level: number;
  experience: number;

  att_life: number;
  att_defense: number;
  att_sanity: number;
  att_ocultism: number;
  att_mana: number;

  offset_life: number;
  offset_defense: number;
  offset_sanity: number;
  offset_ocultism: number;
  offset_mana: number;

  life: number;
  sanity: number;
  ocultism: number;
  mana: number;

  active: boolean;
  is_player: boolean;

  physical_description?: string;
  psychological_description?: string;
  backstory?: string;

  attributes: any[];
  abilities: AbilityItem[];
}

export type CharacterStatLimits = {
  life: {
    base: number;
    bonus: number;
    total_max: number;
  };
  defense: {
    base: number;
    bonus: number;
    total_max: number;
  };
  sanity: {
    base: number;
    bonus: number;
    total_max: number;
  };
  ocultism: {
    base: number;
    bonus: number;
    total_max: number;
  };
  mana: {
    base: number;
    bonus: number;
    total_max: number;
  };
};

export type CreateCharacterResponse = {
  character: CharacterItem;
  message: string;
}

export type ListCharactersResponse = {
  characters: CharacterItem[];
}

export type GetCharacterResponse = {
  character: CharacterItem;
  stat_limits: CharacterStatLimits;
}

// CHARACTER UPDATES

export type UpdateCharacterGeneralRequest = {
  name?: string;
  charClass?: number;
  subclass?: number;
  second_class?: number;
  race?: number;
  gender?: string;
  age?: number;
  level?: number;
  experience?: number;
}

export type UpdateCharacterStatsRequest = {
  life?: number;
  mana?: number;
  sanity?: number;
  ocultism?: number;
  defense?: number;
}

export type UpdateCharacterDescriptionRequest = {
  physical_description?: string;
  psychological_description?: string;
  backstory?: string;
}

export type UpdateCharacterOffsetsRequest = {
  offset_life?: number;
  offset_defense?: number;
  offset_sanity?: number;
  offset_ocultism?: number;
  offset_mana?: number;
}


// CHARACTER PERICIA UPDATE

export type UpdateCharacterPericiaItem = {
  pericia_id: number;
  value: number;
}

export type BulkUpdateCharacterPericiasRequest = {
  pericias: UpdateCharacterPericiaItem[];
}

// CONVERSION RULES

export type ConversionRuleItem = {
  id: number;
  attribute_id: number | null;
  pericia_id: number | null;

  conversion_type: "attribute" | "pericia";

  stat: "life" | "defense" | "sanity" | "mana" | "ocultism";

  rate: number;
}

export type CreateConversionRuleRequest = {
  conversion_type: "attribute" | "pericia";
  target_id: number;
  stat: string;
  rate: number;
}

export type CreateConversionRuleResponse = {
  conversion_rule: ConversionRuleItem;
  message: string;
}

export type ListConversionRulesResponse = {
  conversion_rules: ConversionRuleItem[];
}

export type GetConversionRuleResponse = {
  conversion_rule: ConversionRuleItem;
}

export type UpdateConversionRuleRequest = {
  attribute_id?: number;
  stat?: string;
  rate?: number;
}


// LEVEL UP RULES

export type LevelUpRuleItem = {
  id: number;
  level: number;
  experience_required: number;
}

export type CreateLevelUpRuleRequest = {
  level: number;
  experience_required: number;
}

export type CreateLevelUpRuleResponse = {
  level_up_rule: LevelUpRuleItem;
  message: string;
}

export type ListLevelUpRulesResponse = {
  level_up_rules: LevelUpRuleItem[];
}

export type GetLevelUpRuleResponse = {
  level_up_rule: LevelUpRuleItem;
}

export type UpdateLevelUpRuleRequest = {
  level?: number;
  experience_required?: number;
}



































export type StandardResponse = {
  message: string;
}

export type ErrorResponse = {
  message: string;
}


