import { db } from "../database/db";
import { gameService } from "../services";
import { ConnectivityManager } from "../services/onlineManager";
import type { ListInventoriesResponse } from "../types";


async function getCharacterInventories(characterId: number) {
    const entries = await db.inventories.where('characterId').equals(characterId).toArray();

    return { inventories: entries } as ListInventoriesResponse;
}

async function syncCharacterInventories(characterId: number) {
    
    if (ConnectivityManager.isOnline()) {
        const remote = await gameService.getCharacterInventories(characterId);

        if (remote.inventories) {
            await db.transaction(
                "rw",
                db.inventories,
                async () => {
                    await db.inventories
                        .where("characterId")
                        .equals(characterId)
                        .delete();
                    await db.inventories.bulkAdd(remote.inventories.map((inventory) => ({
                        ...inventory,
                        characterId: characterId,
                    })));
                }
            );
        }
    }
}




export const inventoriesRepository = {
    getCharacterInventories,
    syncCharacterInventories
}