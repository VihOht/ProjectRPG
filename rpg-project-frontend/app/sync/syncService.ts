import { db } from "../database/db";
import { syncCharacter } from "./characterSync";
import { syncInventory } from "./inventorySync";

export async function syncQueue() {
    const queue =
        await db.syncQueue.toArray();

    for (const item of queue) {
      try {
        switch (item.domain) {
            case "character":
                await syncCharacter(item);
                break;
            case "inventory":
                await syncInventory(item);
                break;
        }
        await db.syncQueue.delete(item.id!);
      } catch (error) {
        await db.syncQueue.update(item.id!, {
            retries: item.retries + 1,
        })
        console.error("Error syncing queue item:", error);
        break
      }
    }
}