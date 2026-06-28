import { useMemo, useState } from "react";
import { LucidePackagePlus } from "lucide-react";
import toast from "react-hot-toast";

import { AppModal } from "../../ui/AppModal";
import { useItems, useAddItemToInventory } from "../../../hooks";
import type { Item } from "../../../types";

interface AddInventoryItemModalProps {
  inventoryId: number;
}

export default function AddInventoryItemModal({
  inventoryId,
}: AddInventoryItemModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: itemsData } = useItems();
  const { mutate: addItem, isPending } = useAddItemToInventory(inventoryId);
  const [itemType, setItemType] = useState<"weapon" | "armor" | "artefact" | "utility">("utility");

  const filteredItems = useMemo(() => {
    if (!itemsData) return [];
    return itemsData.items.filter((item) => item.item_type === itemType);
  }, [itemsData, itemType]);

  const stackable = useMemo(() => {
    const selectedItem = filteredItems.find((item) => item.id === selectedItemId);
    return selectedItem?.stackable ?? false;
  }, [filteredItems, selectedItemId]);

  const handleAddItem = () => {
    if (!selectedItemId) {
      toast.error("Selecione um item.");
      return;
    }

    addItem(
      {
        item_id: selectedItemId,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success("Item adicionado ao inventário.");
          setOpen(false);
          setSelectedItemId(null);
          setQuantity(1);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Erro ao adicionar item ao inventário."
          );
        },
      }
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-vaccinePurple px-3 py-2 text-white hover:bg-vaccinePurple/80 transition"
      >
        <LucidePackagePlus className="h-4 w-4" />
      </button>

      <AppModal
        open={open}
        title="Adicionar item ao inventário"
        onClose={() => setOpen(false)}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de item
            </label>

            <div className="flex gap-2 mb-2">
              {(["weapon", "armor", "artefact", "utility"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setItemType(type)}
                  className={`px-3 py-1 text-sm rounded-md cursor-pointer ${
                    itemType === type
                      ? "bg-vaccinePurple text-white"
                      : "bg-vaccineGray-800/20 text-gray-300 hover:bg-vaccineGray-800/40"
                  }`}
                >
                  {getItemTypeLabel(type)}
                </button>
              ))}
            </div>

            <select
              value={selectedItemId ?? ""}
              onChange={(e) => setSelectedItemId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
            >
              <option value="">Selecione um item</option>

              {filteredItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {stackable ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Quantidade
                </label>
    
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-32 px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
                />
              </div>
            )
          : null}

          <button
            type="button"
            onClick={handleAddItem}
            disabled={isPending}
            className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50"
          >
            {isPending ? "Adicionando..." : "Adicionar Item"}
          </button>
        </form>
      </AppModal>
    </>
  );
}

function getItemTypeLabel(type: Item["item_type"]) {
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