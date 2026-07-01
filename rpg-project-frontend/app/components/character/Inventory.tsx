import { useMemo, useState } from "react";
import {
  LucidePackage,
  LucideShield,
  LucideSword,
  LucideSparkles,
  LucideWrench,
  LucideEllipsisVertical,
  LucideDelete
} from "lucide-react";

import { useCharacterInventories, useDeleteInventory, useInventoryItems } from "../../hooks";
import type { InventoryItem, InventoryEntry } from "../../types";
import CreateTemporaryItemModal from "./dialogs/CreateTemporaryItemModal";
import AddInventoryItemModal from "./dialogs/AddInventoryItemModal";
import TransferInventoryItemModal from "./dialogs/TransferInventoryItemModal";
import RemoveInventoryItemModal from "./dialogs/RemoveInventoryItemModal";
import CreateInventoryModal from "./dialogs/CreateInventoryModal";
import { toast } from "react-hot-toast";
import { SheetSection } from "./SheetSection";
import { AccordionContent, AccordionItem, AccordionTrigger, Accordion } from "../ui/accordion";

interface CharacterInventoryProps {
  characterId: number;
}

export function CharacterInventory({ characterId }: CharacterInventoryProps) {
  const { data: inventoriesData, isLoading } =
    useCharacterInventories(characterId);
  const inventories = useMemo(() => {
    return inventoriesData?.inventories ?? [];
  }, [inventoriesData]);

  console.log("Inventories:", inventories);

  const equippedInventory = inventories.find(
    (inventory) =>
      inventory.type === "Equipped" ||
      inventory.type === "EQUIPED" ||
      inventory.type === "Equipado"
  );

  const carriedInventory = inventories.find(
    (inventory) =>
      inventory.type === "Carried" ||
      inventory.type === "CARRIED" ||
      inventory.type === "Carregado"
  );

  const otherInventories = inventories.filter(
    (inventory) =>
      inventory.id !== equippedInventory?.id &&
      inventory.id !== carriedInventory?.id
  );

  if (isLoading) {
    return (
      <section className="mb-8">
        <p className="text-vaccineGray-300">Carregando inventários...</p>
      </section>
    );
  }

  return (
    <SheetSection
      title="Inventário"
      actions={<CreateInventoryModal characterId={characterId} />}
    >
      <div className="h-auto overflow-y-auto pr-2">
        {inventories.length === 0 ? (
          <p className="text-vaccineGray-400">
            Nenhum inventário encontrado.
          </p>
        ) : (
          <div className="space-y-8 h-auto overflow-y-auto pr-2">
            <Accordion type="multiple" className="w-full">
              {equippedInventory && (
                <InventorySection
                  inventory={equippedInventory}
                  title="Equipados"
                  variant="equipped"
                  characterId={characterId}
                />
              )}

              {carriedInventory && (
                <InventorySection
                  inventory={carriedInventory}
                  title="Carregados"
                  variant="compact"
                  characterId={characterId}
                />
              )}

              {otherInventories.map((inventory) => (
                <InventorySection
                  key={inventory.id}
                  inventory={inventory}
                  title={inventory.name}
                  variant="compact"
                  characterId={characterId}
                />
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </SheetSection>
  );
}

function InventorySection({
  inventory,
  title,
  variant,
  characterId
}: {
  inventory: InventoryItem;
  title: string;
  variant: "equipped" | "compact";
  characterId: number;
}) {
  const { data, isLoading } = useInventoryItems(inventory.id);
  console.log("Inventory Items for inventory", inventory.id, ":", data);

  const items = useMemo<InventoryEntry[]>(() => {
    if (!data?.items) return [];
    return Object.values(data.items).flat();
  }, [data]);

  const { refetch: refetchInventories } = useCharacterInventories(characterId);

  const { mutate: deleteInventory } = useDeleteInventory(inventory.id);

  const onDeleteInventory = () => {
    if (confirm("Tem certeza que deseja deletar este inventário?") && confirm("Por anarion, todos os items serão deletados, tem certeza?")) {
      deleteInventory(inventory.id, {
        onSuccess: () => {
          toast.success("Inventário deletado.");
          refetchInventories();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Erro ao deletar inventário."
          );
        }
      });
    }}



  return (
    <AccordionItem value={title} className="mb-8 bg-vaccineBlueTones-900/10 p-4 rounded-md">
      <div className="flex flex-col w-full h-full justify-between gap-3">
        <div>
            <div className="flex justify-between w-full gap-2 mb-1">
                <AccordionTrigger >
                  <h3 className="text-2xl cursor-pointer font-trajanPBold text-vaccineGray-300">
                      {title}
                  </h3>
                </AccordionTrigger>
                <div className="flex items-center gap-2">
                    <AddInventoryItemModal inventoryId={inventory.id} />
                    <CreateTemporaryItemModal inventoryId={inventory.id} />
                    {
                      (inventory.type === "Transport") && (
                        <button onClick={() => onDeleteInventory()} className="rounded-md border border-vaccinePurple/40 p-2 px-3 hover:bg-vaccinePurple/20 transition">
                          <LucideDelete className="h-4 w-4 text-vaccineGray-300 hover:text-red-600 transition" />
                        </button>
                      )
                    }
                </div>  
            </div>   
        </div>
        <div className="flex items-center gap-2 h-full">
          <p className="text-sm w-full text-vaccineGray-600">
            {inventory.description}
          </p>
          <span className="rounded-md min-w-[70px] text-center border border-vaccinePurple/40 bg-vaccineBlueTones-1000/50 px-3 py-1 text-sm text-vaccineGray-300">
            {items.length}/{inventory.capacity === -1 ? "∞" : inventory.capacity}
          </span>
        </div>
      </div>
      <AccordionContent className="mt-4">
        {isLoading ? (
          <p className="text-vaccineGray-400">Carregando itens...</p>
        ) : items.length === 0 ? (
          <p className="text-vaccineGray-600">Nenhum item neste inventário.</p>
        ) : variant === "equipped" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((entry) => (
              <EquippedItemCard key={entry.id} item={entry} characterId={characterId} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((entry) => (
              <CompactItemCard key={entry.id} item={entry} characterId={characterId} />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function EquippedItemCard({ item, characterId }: { item: InventoryEntry; characterId: number }) {
  const Icon = getItemIcon(item.item_type);

  return (
    <article className="relative overflow-hidden rounded-lg border border-vaccinePurple/40 bg-vaccineBlueTones-1000/80 p-5 shadow-lg">
      <div className="absolute right-4 top-4 opacity-20">
        <Icon className="h-16 w-16 text-vaccinePurple" />
      </div>

      <div className="relative z-10">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-vaccinePurple">
              {getItemTypeLabel(item.item_type)}
            </p>

            <h4 className="font-trajanPBold text-2xl text-vaccineGray-200 break-words">
              {item.name}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            { item.stackable && (
              <span className="rounded-md bg-vaccinePurple/30 px-3 py-1 text-sm text-white">
                x{item.quantity} / {item.max_quantity ? item.max_quantity > 0 ? item.max_quantity : item.max_quantity === -1 ? "∞" : "-" : "-"}
              </span>
            )}
            <InventoryItemActions
              item={item}
              characterId={characterId}
            />
          </div>
        </div>

        <p className="whitespace-pre-line text-vaccineGray-300 break-words">
          {item.description}
        </p>

        <ItemStats item={item} large />
      </div>
    </article>
  );
}

function CompactItemCard({ item, characterId }: { item: InventoryEntry; characterId: number }) {
  const Icon = getItemIcon(item.item_type);
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-md border border-vaccineGray-300/30 bg-vaccineBlueTones-1000/60 p-3">
      <div className="flex items-start justify-between gap-3">
        <div onClick={() => setOpen(!open)} className="flex cursor-pointer gap-3">
          <div className="rounded-md bg-vaccinePurple/20 p-2 text-vaccinePurple">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h4 className="font-trajanPBold text-base text-vaccineGray-200">
              {item.name}
            </h4>

            <p className="text-xs text-vaccineGray-600">
              {getItemTypeLabel(item.item_type)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          { item.stackable && (
            <span className="rounded-md bg-vaccineBlueTones-400/40 px-2 py-1 text-xs text-vaccineGray-200">
              x{item.quantity} / {item.max_quantity ? item.max_quantity > 0 ? item.max_quantity : item.max_quantity === -1 ? "∞" : "-" : "-"}
            </span>
          )}
          <InventoryItemActions
            item={item}
            characterId={characterId}
          />
        </div>
      </div>
      <div className={`mt-3 ${open ? "block" : "hidden"}`}>
        <p className="mt-2 line-clamp-2 text-sm text-vaccineGray-400">
          {item.description}
        </p>

        <ItemStats item={item} />
      </div>
    </article>
  );
}

function ItemStats({
  item,
  large = false,
}: {
  item: InventoryEntry;
  large?: boolean;
}) {
  if (item.item_type === "weapon") {
    return (
      <div className={`mt-4 flex flex-wrap gap-2 ${large ? "text-sm" : "text-xs"}`}>
        <Badge label="Dano" value={item.damage} />
        <Badge label="Perícia" value={item.pericia} />
        <Badge label="Crítico" value={item.critical} />
        <Badge label="Alcance" value={item.range} />
      </div>
    );
  }

  if (item.item_type === "armor") {
    return (
      <div className={`mt-4 flex flex-wrap gap-2 ${large ? "text-sm" : "text-xs"}`}>
        <Badge label="Resistência" value={item.resistance} />
        <Badge label="Redução" value={item.reduction} />
        <Badge label="Perícia" value={item.pericia} />
        <Badge label="Tamanho" value={item.size} />
      </div>
    );
  }

  if (item.item_type === "artefact") {
    return (
      <p className="mt-4 text-sm text-vaccineGray-300">
        <span className="font-semibold text-vaccinePurple">Efeito:</span>{" "}
        {item.effect}
      </p>
    );
  }

  return null;
}

function Badge({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <span className="rounded-md border border-vaccineGray-300/20 bg-vaccineGray-800/20 px-2 py-1 text-vaccineGray-300">
      <span className="text-vaccinePurple">{label}:</span> {value || "-"}
    </span>
  );
}

function getItemIcon(type: InventoryEntry["item_type"]) {
  switch (type) {
    case "weapon":
      return LucideSword;
    case "armor":
      return LucideShield;
    case "artefact":
      return LucideSparkles;
    case "utility":
      return LucideWrench;
    default:
      return LucidePackage;
  }
}

function getItemTypeLabel(type: InventoryEntry["item_type"]) {
  switch (type) {
    case "weapon":
      return "Arma";
    case "armor":
      return "Armadura";
    case "artefact":
      return "Artefato";
    case "utility":
      return "Utilitário";
    default:
      return type;
  }
}



interface InventoryItemActionsProps {
    item: InventoryEntry;
    characterId: number;
}

export default function InventoryItemActions({
    item,
    characterId,
}: InventoryItemActionsProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="rounded-md p-1 hover:bg-vaccinePurple/20 transition"
            >
                <LucideEllipsisVertical className={`h-5 w-5 transition-transform duration-200 rotate-90 text-vaccineGray-300 ${open ? 'text-vaccinePurple rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-10 top-[-5px] z-50 rounded-lg border border-vaccineGray-300/20 bg-vaccineBlueTones-1000 p-2 shadow-xl flex flex gap-1">

                    <TransferInventoryItemModal
                        inventoryId={item.inventory_id}
                        inventoryItem={item}
                        characterId={characterId}
                    />

                    <RemoveInventoryItemModal
                      inventoryId={item.inventory_id}
                      inventoryItem={item}
                    />

                </div>
            )}
        </div>
    );
}
