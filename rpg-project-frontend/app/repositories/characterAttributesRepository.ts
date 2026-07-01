import { db } from "../database/db";
import * as T from "../types/character";
import { ConnectivityManager } from "../services/onlineManager";
import { gameService } from "../services/gameService";
import { syncQueue } from "../sync/syncService";

async function getCharacterAttributes(character_id: number): Promise<T.ListCharacterAttributesResponse> {
    const cached = await db.characterAttributes.get({ character_id });

    return { attributes: cached?.attributes || [] };
}

async function updateCharacterPericias(
  character_id: number,
  data: T.BulkUpdateCharacterPericiasRequest
) {
  const cached = await db.characterAttributes.get({ character_id });
  const stats_limit = await db.stats_limits.get({ characterId: character_id })
  const conversion_rules = await db.conversionRules.toArray()

  if (!cached) {
    throw new Error("Character attributes not found");
  }

  const updated = structuredClone(cached);

  for (const changedPericia of data.pericias) {
    for (const attribute of updated.attributes) {
      const pericia = attribute.pericias.find(
        (p) => p.pericia_id === changedPericia.pericia_id
      );

      if (pericia) {
          const add = changedPericia.value - pericia.value;
        pericia.value = changedPericia.value;
        attribute.value += add
        const c1 = conversion_rules.find((c) => (c.conversion_type === "attribute" && c.attribute_id === attribute.attribute_id))
        if (c1 && stats_limit) {
            const stat = stats_limit[c1.stat]
            if (stat !== undefined) {
                const b = Math.floor(c1.rate * add)
                stat.bonus += b
                stat.total_max += b

            }
        }
        const c2 = conversion_rules.find((c) => (c.conversion_type === "pericia" && c.pericia_id === pericia.pericia_id))
        if (c2 && stats_limit) {
            const stat = stats_limit[c2.stat]
            if (stat !== undefined) {
                const b = Math.floor(c2.rate * add)
                stat.bonus += b
                stat.total_max += b
            }
        }
      }
    }
  }

  await db.characterAttributes.put(updated);
  console.log(updated)
  if (stats_limit){
      await db.stats_limits.put(stats_limit)
  }

  await db.syncQueue.add({
    domain: "character",
    action: "updateCharacterPericias",
    payload: data,
    entityId: character_id,
    createdAt: Date.now(),
    retries: 0,
  });

  if (ConnectivityManager.isOnline()) {
    void syncQueue().catch(console.error);
  }

  return {attributes: updated.attributes };
}

async function syncCharacterAttributes(character_id: number): Promise<void> {
    if (ConnectivityManager.isOnline()) {
        const remote = await gameService.getCharacterAttributes(character_id);
        await db.characterAttributes.put({ character_id, attributes: remote.attributes });
    }
}


export const characterAttributesRepository = {
    getCharacterAttributes,
    updateCharacterPericias,
    syncCharacterAttributes,
};