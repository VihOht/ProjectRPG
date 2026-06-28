import { useState } from "react";
import type { InventoryEntry } from "../../../types";
import { useRemoveItemFromInventory } from "../../../hooks";
import { LucideTrash2 } from "lucide-react";
import { AppModal } from "../../ui/AppModal";
import { toast } from "react-hot-toast";

interface Props {
    inventoryId: number;
    inventoryItem: InventoryEntry;
}

export default function RemoveInventoryItemModal({
    inventoryId,
    inventoryItem,
}: Props) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { mutate } =
        useRemoveItemFromInventory(
            inventoryId,
            inventoryItem.item_id
        );

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="rounded-md bg-red-700 px-2 py-2"
            >
                <LucideTrash2 className="w-4 h-4" />
            </button>

            <AppModal
                open={open}
                title="Remover Item"
                onClose={() => setOpen(false)}
            >
                <p className="mb-4 text-gray-300">
                    Remover <b>{inventoryItem.name}</b> do
                    inventário?
                </p>

                {inventoryItem.stackable && (
                    <input
                        type="number"
                        min={1}
                        max={inventoryItem.quantity}
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-vaccinePurple mb-4"
                    />
                )}

                <button
                    onClick={() =>
                        mutate(
                            { quantity },
                            {
                                onSuccess: () => {
                                    toast.success(
                                        "Item removido."
                                    );
                                    setOpen(false);
                                },
                                onError: (error) => {
                                    toast.error(
                                        "Erro ao remover item: " +
                                            error.response?.data?.message ||
                                            "Erro desconhecido."
                                    );
                                }
                            }
                        )
                    }
                    className="w-full rounded-md bg-red-700 px-3 py-2 text-white hover:bg-red-700/80 transition"
                >
                    Remover
                </button>
            </AppModal>
        </>
    );
}