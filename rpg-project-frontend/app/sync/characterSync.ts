import { gameService } from "../services";
import type { SyncQueueItem } from "../database/db";

export async function syncCharacter(queueItem: SyncQueueItem) {
    switch (queueItem.action) {
        case "updateCharacterGeneral":
            await gameService.updateCharacterGeneral(queueItem.entityId, queueItem.payload);
            break;
        case "updateCharacterStats":
            await gameService.updateCharacterStats(queueItem.entityId, queueItem.payload);
            break;
        case "updateCharacterDescription":
            await gameService.updateCharacterDescription(queueItem.entityId, queueItem.payload);
            break;
        case "updateCharacterPericias":
            await gameService.updateCharacterPericias(queueItem.entityId, queueItem.payload)
            break
        case "assignAbilityToCharacter":
            await gameService.assignAbilityToCharacter(queueItem.payload.abilityId, queueItem.entityId).catch(
                (error) => {
                    if (error.response && error.response.status === 404) {
                        // Ignore the error if the ability is not found on the server
                    } else {
                        throw error; // Re-throw the error for other cases
                    }
                }
            );
            break;
        case "unassignAbilityFromCharacter":
            await gameService.unassignAbilityFromCharacter(queueItem.payload.abilityId, queueItem.entityId).catch(
                (error) => {
                    if (error.response && error.response.status === 404) {
                        // Ignore the error if the ability is not found on the server
                    } else {
                        throw error; // Re-throw the error for other cases
                    }
                }
            );
            break;
        case "assignWizardcraftToCharacter":
            await gameService.assignWizardcraftToCharacter(queueItem.payload.wizardcraftId, queueItem.entityId).catch(
                (error) => {
                    if (error.response && error.response.status === 404) {
                        // Ignore the error if the ability is not found on the server
                    } else {
                        throw error; // Re-throw the error for other cases
                    }
                }
            );
            break;
        case "unassignWizardcraftFromCharacter":
            await gameService.unassignWizardcraftFromCharacter(queueItem.payload.wizardcraftId, queueItem.entityId).catch(
                (error) => {
                    if (error.response && error.response.status === 404) {
                        // Ignore the error if the ability is not found on the server
                    } else {
                        throw error; // Re-throw the error for other cases
                    }
                }
            );
            break;
        case "assignRitualToCharacter":
            await gameService.assignRitualToCharacter(queueItem.payload.ritualId, queueItem.entityId).catch(
                (error) => {
                    if (error.response && error.response.status === 404) {
                        // Ignore the error if the ability is not found on the server
                    } else {
                        throw error; // Re-throw the error for other cases
                    }
                }
            );
            break;
        case "unassignRitualFromCharacter":
            await gameService.unassignRitualFromCharacter(queueItem.payload.ritualId, queueItem.entityId).catch(
                (error) => {
                    if (error.response && error.response.status === 404) {
                        // Ignore the error if the ability is not found on the server
                    } else {
                        throw error; // Re-throw the error for other cases
                    }
                }
            );
            break;
        case "createSpecialAbilityForCharacter":
            await gameService.createSpecialAbility(queueItem.payload);
            break;
        default:
            throw new Error(`Unknown action: ${queueItem.action}`);
    }
}
