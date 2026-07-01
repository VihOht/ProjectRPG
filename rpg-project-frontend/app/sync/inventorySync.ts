import type { SyncQueueItem } from "../database/db";
import { gameService } from "../services";

export async function syncInventory(queueItem: SyncQueueItem) {
    switch (queueItem.action) {
        case "addInventoryItem":
            return await gameService.addItemToInventory(queueItem.entityId, queueItem.payload);
            break;
        case "removeInventoryItem":
            return await gameService.removeItemFromInventory(queueItem.entityId, queueItem.payload.item_id, queueItem.payload);
            break;
        case "deleteInventoryItem":
            return await gameService.deleteInventoryItem(queueItem.entityId, queueItem.payload.item_id);
            break;
        default:
            throw new Error(`Unknown action: ${queueItem.action}`);
    }
}
