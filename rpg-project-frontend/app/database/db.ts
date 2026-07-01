import Dexie, { type EntityTable } from "dexie";
import type * as T from "../types";
import type { User } from "../types";

export interface SyncQueueItem {
    id?: number;

    domain: "character" | "inventory";

    action: string;

    payload: any;

    entityId: number;

    createdAt: number;

    retries: number;
}

export interface AuthSession {
    id: number;
    token: string;

    user: User;

    expiresAt: Date;

    verifiedAt: Date;
}

export interface CharacterStatsLimitsEntity extends T.CharacterStatLimits {
    characterId: number;
}

export interface CharacterAttributesEntity {
    character_id: number,
    attributes: T.CharacterAttributeItem[];
}

export interface CharacterInventoryEntity extends T.InventoryItem {
    characterId: number;
}

export type InventoryEntryEntity = T.InventoryEntry & {
    localId: string;
};

export const db = new Dexie("insonia") as Dexie & {
    characters: EntityTable<T.CharacterItem, "id">;
    stats_limits: EntityTable<CharacterStatsLimitsEntity, "characterId">;
    authSessions: EntityTable<AuthSession, "id">;
    abilities: EntityTable<T.AbilityItem, "id">;
    classPowers: EntityTable<T.ClassPowerItem, "id">;
    attributes: EntityTable<T.AttributeItem, "id">;
    attributePowers: EntityTable<T.AttributePowerItem, "id">;
    wizardcrafts: EntityTable<T.WizardcraftItem, "id">;
    rituals: EntityTable<T.RitualItem, "id">;
    specialPowers: EntityTable<T.SpecialAbilityItem, "id">;
    classes: EntityTable<T.ClassItem, "id">;
    subclasses: EntityTable<T.SubclassItem, "id">;
    pericias: EntityTable<T.PericiaItem, "id">;
    races: EntityTable<T.RaceItem, "id">;
    conversionRules: EntityTable<T.ConversionRuleItem, "id">;
    levelUpRules: EntityTable<T.LevelUpRuleItem, "id">;
    items: EntityTable<T.Item, "id">;
    characterAttributes: EntityTable<CharacterAttributesEntity, "character_id">;
    inventories: EntityTable<CharacterInventoryEntity, "id">;
    inventoryItems: EntityTable<InventoryEntryEntity, "localId">;
    syncQueue: EntityTable<SyncQueueItem, "id">;
}

db.version(1).stores({
    characters: "id",
    stats_limits: "characterId",
    syncQueue: "++id,createdAt",
    authSessions: "id",
    abilities: "id",
    classPowers: "id",
    attributes: "id",
    attributePowers: "id",
    wizardcrafts: "id",
    rituals: "id",
    specialPowers: "id",
    classes: "id",
    subclasses: "id",
    pericias: "id",
    races: "id",
    conversionRules: "id",
    levelUpRules: "id",
    items: "id",
    characterAttributes: "character_id",
    inventories: "id,characterId",
    inventoryItems: "localId,inventory_id,item_id",
})
