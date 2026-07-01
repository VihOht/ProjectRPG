import type * as T from '../types';
import { db } from '../database/db';
import { gameService } from '../services/gameService';
import { syncQueue } from '../sync/syncService';
import { onlineManager } from '@tanstack/react-query';
import { ConnectivityManager } from '../services/onlineManager';
import type { GetCharacterResponse } from '../types';



async function getCharacters(): Promise<T.ListCharactersResponse> {
    const cached = await db.characters.toArray();

    return {characters: cached};
}

async function getCharacterById(id:number): Promise<T.GetCharacterResponse> {
    const character = await db.characters.get(id).then((char) => {
        if (!char) {
            throw new Error("Character not found");
        }
        return char;
    });
    const stat_limits = await db.stats_limits.get(id)



    return { character, stat_limits: stat_limits ?? {
        life: { base: 0, bonus: 0, total_max: 0 },
        defense: { base: 0, bonus: 0, total_max: 0 },
        sanity: { base: 0, bonus: 0, total_max: 0 },
        mana: { base: 0, bonus: 0, total_max: 0 },
        ocultism: { base: 0, bonus: 0, total_max: 0 },
        power: { base: 0, bonus: 0, total_max: 0 },
        inventory_capacity: { base: 0, bonus: 0, total_max: 0 },
    } as T.CharacterStatLimits };
}

async function updateCharacterGeneral(id:number, data: T.UpdateCharacterGeneralRequest) {
    const character = await db.characters.get(id);
    if (!character) {
        throw new Error("Character not found");
    }

    const updated = {
        ...character,
        ...data,
    }
    await db.characters.update(id, updated);

    await db.syncQueue.add({
        domain: "character",
        action: "updateCharacterGeneral",
        payload: data,
        entityId: id,
        createdAt: Date.now(),
        retries: 0,
    });

    if (onlineManager.isOnline()) {
        void syncQueue().catch(console.error);
    }
    const stat_limits = await db.stats_limits.get(id);

    return {character: updated, stat_limits: stat_limits!};
}

async function updateCharacterStats(id:number, data: T.UpdateCharacterStatsRequest) {
    const character = await db.characters.get(id);
    if (!character) {
        throw new Error("Character not found");
    }
    const updated = {
        ...character,
        ...data,
    }
    await db.characters.update(id, updated);

    await db.syncQueue.add({
        domain: "character",
        action: "updateCharacterStats",
        payload: data,
        entityId: id,
        createdAt: Date.now(),
        retries: 0,
    });

    if (onlineManager.isOnline()) {
        void syncQueue().catch(console.error);
    }
    const characterData = await getCharacterById(id);

    return { character: updated, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}

async function updateCharacterDescription(id:number, data: T.UpdateCharacterDescriptionRequest) {
    const character = await db.characters.get(id);
    const updatedCharacter = {
        ...character,
        ...data,
    }
    await db.characters.update(id, updatedCharacter);

    await db.syncQueue.add({
        domain: "character",
        action: "updateCharacterDescription",
        payload: data,
        entityId: id,
        createdAt: Date.now(),
        retries: 0,
    });

    if (onlineManager.isOnline()) {
        void syncQueue().catch(console.error);
    }
    const characterData = await getCharacterById(id);

    return { character: updatedCharacter, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}


async function syncCharacter(id:number) {
    try {
        const remote = (await gameService.getCharacterById(id));
        await db.characters.put(remote.character);
        await db.stats_limits.put({...remote.stat_limits, characterId: id});
    } catch {
    }
}

async function syncCharacters() {
    try {
        const remote = (await gameService.getCharacters()).characters;
        await db.characters.bulkPut(remote);
    } catch {
    }
}


// Abilities

async function assignAbilityToCharacter(abilityId: number, characterId: number) {
    const ability = await db.abilities.get(abilityId);
    if (!ability) {
        throw new Error("Ability not found");
    }

    const character = await db.characters.get(characterId);
    if (!character) {
        throw new Error("Character not found");
    }

    const updatedCharacter = {
        ...character,
        abilities: [...character.abilities, ability],
    };
    await db.characters.update(characterId, updatedCharacter);

    await db.syncQueue.add({
        domain: "character",
        action: "assignAbilityToCharacter",
        payload: { abilityId },
        entityId: characterId,
        createdAt: Date.now(),
        retries: 0,
    });

    if (ConnectivityManager.isOnline()) {
        void syncQueue().catch(console.error);
    }

    const characterData = await getCharacterById(characterId);

    return { character: updatedCharacter, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}

async function unassignAbilityFromCharacter(abilityId: number, characterId: number) {
    const character = await db.characters.get(characterId);

    if (!character) {
        throw new Error("Character not found");
    }

    const updatedCharacter = {
        ...character,
        abilities: character.abilities.filter((ability) => ability.id !== abilityId),
    };
    await db.characters.update(characterId, updatedCharacter);

    await db.syncQueue.add({
        domain: "character",
        action: "unassignAbilityFromCharacter",
        payload: { abilityId },
        entityId: characterId,
        createdAt: Date.now(),
        retries: 0,
    });

    if (ConnectivityManager.isOnline()) {
        void syncQueue().catch(console.error);
    }

    const characterData = await getCharacterById(characterId);

    return { character: updatedCharacter, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}

async function assignWizardcraftToCharacter(wizardcraftId: number, characterId: number) {
    const wizardcraft = await db.wizardcrafts.get(wizardcraftId);

    if (!wizardcraft) {
        throw new Error("Wizardcraft not found");
    }

    const character = await db.characters.get(characterId);

    if (!character) {
        throw new Error("Character not found");
    }

    const updatedCharacter = {
        ...character,
        wizardcrafts: [...character.wizardcrafts, wizardcraft],
    };
    await db.characters.update(characterId, updatedCharacter);

    await db.syncQueue.add({
        domain: "character",
        action: "assignWizardcraftToCharacter",
        payload: { wizardcraftId },
        entityId: characterId,
        createdAt: Date.now(),
        retries: 0,
    });

    if (ConnectivityManager.isOnline()) {
        void syncQueue().catch(console.error);
    }

    const characterData = await getCharacterById(characterId);

    return { character: updatedCharacter, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}

async function unassignWizardcraftFromCharacter(wizardcraftId: number, characterId: number) {
    const character = await db.characters.get(characterId);

    if (!character) {
        throw new Error("Character not found");
    }

    const updatedCharacter = {
        ...character,
        wizardcrafts: character.wizardcrafts.filter((wizardcraft) => wizardcraft.id !== wizardcraftId),
    };
    await db.characters.update(characterId, updatedCharacter);

    await db.syncQueue.add({
        domain: "character",
        action: "unassignWizardcraftFromCharacter",
        payload: { wizardcraftId },
        entityId: characterId,
        createdAt: Date.now(),
        retries: 0,
    });

    if (ConnectivityManager.isOnline()) {
        void syncQueue().catch(console.error);
    }

    const characterData = await getCharacterById(characterId);

    return { character: updatedCharacter, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}

async function assignRitualToCharacter(ritualId: number, characterId: number) {
    const ritual = await db.rituals.get(ritualId);

    if (!ritual) {
        throw new Error("Ritual not found");
    }

    const character = await db.characters.get(characterId);

    if (!character) {
        throw new Error("Character not found");
    }

    const updatedCharacter = {
        ...character,
        rituals: [...character.rituals, ritual],
    };
    await db.characters.update(characterId, updatedCharacter);

    await db.syncQueue.add({
        domain: "character",
        action: "assignRitualToCharacter",
        payload: { ritualId },
        entityId: characterId,
        createdAt: Date.now(),
        retries: 0,
    });

    if (ConnectivityManager.isOnline()) {
        void syncQueue().catch(console.error);
    }

    const characterData = await getCharacterById(characterId);

    return { character: updatedCharacter, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}

async function unassignRitualFromCharacter(ritualId: number, characterId: number) {
    const character = await db.characters.get(characterId);

    if (!character) {
        throw new Error("Character not found");
    }

    const updatedCharacter = {
        ...character,
        rituals: character.rituals.filter((ritual) => ritual.id !== ritualId),
    };
    await db.characters.update(characterId, updatedCharacter);

    await db.syncQueue.add({
        domain: "character",
        action: "unassignRitualFromCharacter",
        payload: { ritualId },
        entityId: characterId,
        createdAt: Date.now(),
        retries: 0,
    });

    if (ConnectivityManager.isOnline()) {
        void syncQueue().catch(console.error);
    }

    const characterData = await getCharacterById(characterId);

    return { character: updatedCharacter, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}

async function createSpecialAbilityForCharacter(characterId: number, data: T.CreateSpecialAbilityRequest) {
    const character = await db.characters.get(characterId);

    if (!character) {
        throw new Error("Character not found");
    }

    const newSpecialAbility: T.SpecialAbilityItem = {
        id: Date.now(), // Temporary ID, should be replaced with server-generated ID after sync
        name: data.name,
        description: data.description,
        character_id: characterId,
    };

    const updatedCharacter = {
        ...character,
        special_abilities: [...character.special_abilities, newSpecialAbility],
    };
    await db.characters.update(characterId, updatedCharacter);

    await db.syncQueue.add({
        domain: "character",
        action: "createSpecialAbilityForCharacter",
        payload: data,
        entityId: characterId,
        createdAt: Date.now(),
        retries: 0,
    });

    if (ConnectivityManager.isOnline()) {
        void syncQueue().catch(console.error);
    }

    const characterData = await getCharacterById(characterId);

    return { character: updatedCharacter, stat_limits: characterData.stat_limits } as GetCharacterResponse;
}


export const characterRepository = {
    getCharacters,
    getCharacterById,
    updateCharacterGeneral,
    updateCharacterDescription,
    syncCharacter,
    syncCharacters,
    updateCharacterStats,
    assignAbilityToCharacter,
    unassignAbilityFromCharacter,
    assignWizardcraftToCharacter,
    unassignWizardcraftFromCharacter,
    assignRitualToCharacter,
    unassignRitualFromCharacter,
    createSpecialAbilityForCharacter,
};
