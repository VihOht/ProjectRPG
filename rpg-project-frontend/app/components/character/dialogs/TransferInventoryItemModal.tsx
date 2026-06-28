import { useMemo, useState } from "react";
import { LucideArrowRightLeft } from "lucide-react";
import toast from "react-hot-toast";

import { AppModal } from "../../ui/AppModal";
import {
  useCharacterInventories,
  useTransferItemBetweenInventories,
} from "../../../hooks";

import type { InventoryEntry } from "../../../types";

interface TransferInventoryItemModalProps {
  characterId: number;
  inventoryId: number;
  inventoryItem: InventoryEntry;
}

export default function TransferInventoryItemModal({
  characterId,
  inventoryId,
  inventoryItem,
}: TransferInventoryItemModalProps) {
  const [open, setOpen] = useState(false);
  const [targetInventoryId, setTargetInventoryId] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);

  const { data: inventoriesData } = useCharacterInventories(characterId);

  const targetInventories = useMemo(() => {
    return (inventoriesData?.inventories ?? []).filter(
      (inventory) => inventory.id !== inventoryId
    );
  }, [inventoriesData, inventoryId]);

  const { mutate: transferItem, isPending } =
    useTransferItemBetweenInventories(inventoryId, targetInventoryId);

  const handleTransfer = () => {
    if (!targetInventoryId) {
      toast.error("Selecione o inventário de destino.");
      return;
    }

    if (quantity <= 0) {
      toast.error("A quantidade deve ser maior que zero.");
      return;
    }

    if (quantity > inventoryItem.quantity) {
      toast.error("Quantidade maior que a disponível.");
      return;
    }

    transferItem(
      {
        item_id: inventoryItem.item_id,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success("Item transferido com sucesso.");
          setOpen(false);
          setTargetInventoryId(null);
          setQuantity(1);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Erro ao transferir item entre inventários."
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
        className="rounded-md bg-vaccineBlueTones-400/40 px-2 py-2 text-vaccineGray-200 hover:bg-vaccinePurple/40 transition"
        title="Transferir item"
      >
        <LucideArrowRightLeft className="h-4 w-4" />
      </button>

      <AppModal
        open={open}
        title="Transferir item"
        onClose={() => setOpen(false)}
      >
        <form className="space-y-4">
          <div className="rounded-md border border-vaccineGray-300/20 bg-vaccineBlueTones-1000/50 p-3">
            <p className="text-sm text-vaccineGray-600">Item</p>

            <h3 className="font-trajanPBold text-lg text-vaccineGray-200">
              {inventoryItem.name}
            </h3>

            <p className="text-sm text-vaccineGray-400">
              Disponível: x{inventoryItem.quantity}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Inventário de destino
            </label>

            <select
              value={targetInventoryId ?? ""}
              onChange={(e) => setTargetInventoryId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
            >
              <option value="">Selecione um inventário</option>

              {targetInventories.map((inventory) => (
                <option key={inventory.id} value={inventory.id}>
                  {getInventoryTitle(inventory.type, inventory.name)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quantidade
            </label>

            <input
              type="number"
              min={1}
              max={inventoryItem.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-32 px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
            />
          </div>

          <button
            type="button"
            onClick={handleTransfer}
            disabled={isPending}
            className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50"
          >
            {isPending ? "Transferindo..." : "Transferir Item"}
          </button>
        </form>
      </AppModal>
    </>
  );
}

function getInventoryTitle(type: string, name: string) {
  if (type === "Equipped" || type === "EQUIPED") {
    return "Equipados";
  }

  if (type === "Carried" || type === "CARRIED") {
    return "Carregados";
  }

  if (type === "Transport" || type === "TRANSPORT") {
    return name || "Transporte";
  }

  return name;
}