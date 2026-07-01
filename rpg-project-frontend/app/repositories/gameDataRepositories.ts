import { db } from '../database/db';
import { gameService } from '../services/gameService';
import type * as T from '../types';
import { createCachedResourceRepository } from './cachedResourceRepository';

export const abilitiesRepository = createCachedResourceRepository<
  T.AbilityItem,
  'abilities',
  'ability',
  T.ListAbilitiesResponse,
  T.GetAbilityResponse
>({
  table: db.abilities,
  listKey: 'abilities',
  detailKey: 'ability',
  getRemoteList: gameService.getAbilities,
  getRemoteById: gameService.getAbilityById,
});

export const attributesRepository = createCachedResourceRepository<
  T.AttributeItem,
  'attributes',
  'attribute',
  T.ListAttributesResponse,
  T.GetAttributeResponse
>({
  table: db.attributes,
  listKey: 'attributes',
  detailKey: 'attribute',
  getRemoteList: gameService.getAttributes,
  getRemoteById: gameService.getAttributeById,
});

export const attributePowersRepository = createCachedResourceRepository<
  T.AttributePowerItem,
  'attribute_powers',
  'attribute_power',
  T.ListAttributePowersResponse,
  T.GetAttributePowerResponse
>({
  table: db.attributePowers,
  listKey: 'attribute_powers',
  detailKey: 'attribute_power',
  getRemoteList: gameService.getAttributePowers,
  getRemoteById: gameService.getAttributePowerById,
});

export const classPowersRepository = {
  ...createCachedResourceRepository<
    T.ClassPowerItem,
    'class_powers',
    'class_power',
    T.ListClassPowersResponse,
    T.GetClassPowerResponse
  >({
    table: db.classPowers,
    listKey: 'class_powers',
    detailKey: 'class_power',
    getRemoteList: gameService.getClassPowers,
    getRemoteById: gameService.getClassPowerById,
  }),

  async getByClassId(classId: number): Promise<T.ListClassPowersResponse> {
    const classPowers = await db.classPowers
      .filter((classPower) => classPower.class_id === classId)
      .toArray();

    return { class_powers: classPowers };
  },

  async syncByClassId(classId: number) {
    const remote = await gameService.getClassPowersByClassId(classId);
    await db.classPowers.bulkPut(remote.class_powers);
  },
};

export const subclassesRepository = createCachedResourceRepository<
  T.SubclassItem,
  'subclasses',
  'subclass',
  T.ListSubclassesResponse,
  T.GetSubclassResponse
>({
  table: db.subclasses,
  listKey: 'subclasses',
  detailKey: 'subclass',
  getRemoteList: gameService.getSubclasses,
  getRemoteById: gameService.getSubclassById,
});

export const periciasRepository = createCachedResourceRepository<
  T.PericiaItem,
  'pericias',
  'pericia',
  T.ListPericiasResponse,
  T.GetPericiaResponse
>({
  table: db.pericias,
  listKey: 'pericias',
  detailKey: 'pericia',
  getRemoteList: gameService.getPericias,
  getRemoteById: gameService.getPericiaById,
});

export const racesRepository = createCachedResourceRepository<
  T.RaceItem,
  'races',
  'race',
  T.ListRacesResponse,
  T.GetRaceResponse
>({
  table: db.races,
  listKey: 'races',
  detailKey: 'race',
  getRemoteList: gameService.getRaces,
  getRemoteById: gameService.getRaceById,
});

export const conversionRulesRepository = createCachedResourceRepository<
  T.ConversionRuleItem,
  'conversion_rules',
  'conversion_rule',
  T.ListConversionRulesResponse,
  T.GetConversionRuleResponse
>({
  table: db.conversionRules,
  listKey: 'conversion_rules',
  detailKey: 'conversion_rule',
  getRemoteList: gameService.getConversionRules,
  getRemoteById: gameService.getConversionRuleById,
});

export const levelUpRulesRepository = createCachedResourceRepository<
  T.LevelUpRuleItem,
  'level_up_rules',
  'level_up_rule',
  T.ListLevelUpRulesResponse,
  T.GetLevelUpRuleResponse
>({
  table: db.levelUpRules,
  listKey: 'level_up_rules',
  detailKey: 'level_up_rule',
  getRemoteList: gameService.getLevelUpRules,
  getRemoteById: gameService.getLevelUpRuleById,
});

export const ritualsRepository = createCachedResourceRepository<
  T.RitualItem,
  'rituals',
  'ritual',
  T.ListRitualsResponse,
  T.GetRitualResponse
>({
  table: db.rituals,
  listKey: 'rituals',
  detailKey: 'ritual',
  getRemoteList: gameService.getRituals,
  getRemoteById: gameService.getRitualById,
});

export const specialAbilitiesRepository = createCachedResourceRepository<
  T.SpecialAbilityItem,
  'special_abilities',
  'special_ability',
  T.ListSpecialAbilitiesResponse,
  T.GetSpecialAbilityResponse
>({
  table: db.specialPowers,
  listKey: 'special_abilities',
  detailKey: 'special_ability',
  getRemoteList: gameService.getSpecialAbilities,
  getRemoteById: gameService.getSpecialAbilityById,
});

export const wizardcraftsRepository = createCachedResourceRepository<
  T.WizardcraftItem,
  'wizardcrafts',
  'wizardcraft',
  T.ListWizardcraftsResponse,
  T.GetWizardcraftResponse
>({
  table: db.wizardcrafts,
  listKey: 'wizardcrafts',
  detailKey: 'wizardcraft',
  getRemoteList: gameService.getWizardcrafts,
  getRemoteById: gameService.getWizardcraftById,
});

export const itemsRepository = createCachedResourceRepository<
  T.Item,
  'items',
  'item',
  T.ListItemsResponse,
  T.GetItemResponse
>({
  table: db.items,
  listKey: 'items',
  detailKey: 'item',
  getRemoteList: gameService.getItems,
  getRemoteById: gameService.getItemById,
});


