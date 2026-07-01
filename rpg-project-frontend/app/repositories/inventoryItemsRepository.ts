import { db } from "../database/db";
import { gameService } from "../services";
import { ConnectivityManager } from "../services/onlineManager";
// import { syncQueue } from "../sync/syncService";
import type { InventoryItemsResponse } from "../types";
// import type { InventoryEntryEntity } from "../database/db";


async function getInventoryItems(inventoryId: number) {
    const entries = await db.inventoryItems.where('inventory_id').equals(inventoryId).toArray();
    console.log("Fetched inventory items from local DB for inventory", inventoryId, ":", entries);

    const items: InventoryItemsResponse = {items: {"weapon": [], "armor": [], "artefact": [], "utility": []}};
    for (const entry of entries) {
        items.items[entry.item_type].push(entry);
    }


    return items;
}

async function syncInventoryItems(inventory_id: number) {
    if (!ConnectivityManager.isOnline()) return;

    const remote = await gameService.getInventoryItems(inventory_id);

    const entries = Object.values(remote.items)
        .flat()
        .map((item) => ({
            ...item,
            localId: `${inventory_id}-${item.id}`,
        }));

    await db.transaction(
        "rw",
        db.inventoryItems,
        async () => {
            await db.inventoryItems
                .where("inventory_id")
                .equals(inventory_id)
                .delete();

            await db.inventoryItems.bulkPut(entries);
        }
    );
}


// async function addInventoryItem(
//     inventoryId: number,
//     data: AddInventoryItemRequest
// ) {
//     const item = await db.items.get(data.item_id);

//     if (!item) {
//         throw new Error("Item not found");
//     }

//     const existing = await db.inventoryItems.get(
//         `${inventoryId}-${item.id}`
//     );

//     if (existing && item.stackable) {
//         existing.quantity += data.quantity ?? 1;

//         await db.inventoryItems.put(existing);
//     } else {
//         const entry: InventoryEntryEntity = {
//             ...item,

//             inventory_id: inventoryId,
//             inventoryId,

//             item_id: item.id,

//             quantity: data.quantity ?? 1,

//             localId: `${inventoryId}-${item.id}`,
//         };

//         await db.inventoryItems.put(entry);
//     }

//     await db.syncQueue.add({
//         domain: "inventory",
//         action: "addInventoryItem",
//         entityId: inventoryId,
//         payload: data,
//         createdAt: Date.now(),
//         retries: 0,
//     });

//     if (ConnectivityManager.isOnline()) {
//         void syncQueue().catch(console.error);
//     }

//     return getInventoryItems(inventoryId);
// }

// async function removeInventoryItem(
//     inventoryId: number,
//     itemId: number,
//     quantity: number
// ) {
//     const key = `${inventoryId}-${itemId}`;

//     const entry = await db.inventoryItems.get(key);

//     if (!entry) {
//         throw new Error("Inventory item not found");
//     }

//     entry.quantity -= quantity;

//     if (entry.quantity <= 0) {
//         await db.inventoryItems.delete(key);
//     } else {
//         await db.inventoryItems.put(entry);
//     }

//     await db.syncQueue.add({
//         domain: "inventory",
//         action: "removeInventoryItem",
//         entityId: inventoryId,
//         payload: {
//             itemId,
//             quantity,
//         },
//         createdAt: Date.now(),
//         retries: 0,
//     });

//     if (ConnectivityManager.isOnline()) {
//         void syncQueue().catch(console.error);
//     }

//     return getInventoryItems(inventoryId);
// }

// async function deleteInventoryItem(
//     inventoryId: number,
//     itemId: number
// ) {
//     await db.inventoryItems.delete(
//         `${inventoryId}-${itemId}`
//     );

//     await db.syncQueue.add({
//         domain: "inventory",
//         action: "deleteInventoryItem",
//         entityId: inventoryId,
//         payload: { itemId },
//         createdAt: Date.now(),
//         retries: 0,
//     });

//     if (ConnectivityManager.isOnline()) {
//         void syncQueue().catch(console.error);
//     }
// }



export const inventoryItemsRepository = {
    getInventoryItems,
    syncInventoryItems
}