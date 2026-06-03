import { useMemo, useState } from "react";
import { FiEdit, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";

type InventoryItem = {
    id: string;
    name: string;
    description: string;
};

interface CharacterInventoryProps {
    inventory: string;
    itemDescription: string;
    handleInventoryChange: (value: string) => void;
    handleItemDescription: (value: string) => void;
    update: (inventory?: string, itemDescription?: string) => void;
}

const createLegacyId = (name: string, index: number) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `legacy-${index}-${cleanName || "item"}`;
};

const createItemId = () => `item-${Date.now()}-${Math.round(Math.random() * 100000)}`;

const serializeItems = (items: InventoryItem[]) => JSON.stringify(items);

const parseItems = (inventory: string, itemDescription: string): InventoryItem[] => {
    try {
        const parsed = JSON.parse(inventory) as unknown;

        if (Array.isArray(parsed)) {
            return parsed
                .map((item, index) => {
                    if (!item || typeof item !== "object") {
                        return null;
                    }

                    const data = item as Partial<InventoryItem>;
                    const name = String(data.name ?? "").trim();
                    const description = String(data.description ?? "").trim();

                    if (!name && !description) {
                        return null;
                    }

                    return {
                        id: String(data.id ?? createLegacyId(name || "item", index)),
                        name: name || "Item sem nome",
                        description,
                    };
                })
                .filter((item): item is InventoryItem => Boolean(item));
        }
    } catch {
        // Text from the previous free-form inventory fields is handled below.
    }

    const names = inventory
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);

    const descriptions = itemDescription
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);

    if (names.length > 0) {
        return names.map((name, index) => ({
            id: createLegacyId(name, index),
            name,
            description: names.length === 1 ? itemDescription.trim() : descriptions[index] ?? "",
        }));
    }

    if (itemDescription.trim()) {
        return [
            {
                id: "legacy-description",
                name: "Item sem nome",
                description: itemDescription.trim(),
            },
        ];
    }

    return [];
};

export function CharacterInventory({
    inventory,
    itemDescription,
    handleInventoryChange,
    handleItemDescription,
    update,
}: CharacterInventoryProps) {
    const items = useMemo(() => parseItems(inventory, itemDescription), [itemDescription, inventory]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [draftName, setDraftName] = useState("");
    const [draftDescription, setDraftDescription] = useState("");
    const [openDescriptionItemId, setOpenDescriptionItemId] = useState<string | null>(null);

    const isEditingItem = Boolean(editingItemId);

    const persistItems = (nextItems: InventoryItem[]) => {
        const serializedItems = serializeItems(nextItems);
        handleInventoryChange(serializedItems);
        handleItemDescription("");
        update(serializedItems, "");
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingItemId(null);
        setDraftName("");
        setDraftDescription("");
    };

    const openCreateForm = () => {
        setEditingItemId(null);
        setDraftName("");
        setDraftDescription("");
        setIsFormOpen(true);
    };

    const openEditForm = (item: InventoryItem) => {
        setEditingItemId(item.id);
        setDraftName(item.name);
        setDraftDescription(item.description);
        setIsFormOpen(true);
    };

    const handleSaveItem = () => {
        const name = draftName.trim();
        const description = draftDescription.trim();

        if (!name) {
            return;
        }

        const nextItems = isEditingItem
            ? items.map((item) => (item.id === editingItemId ? { ...item, name, description } : item))
            : [...items, { id: createItemId(), name, description }];

        persistItems(nextItems);
        closeForm();
    };

    const handleRemoveItem = (itemId: string) => {
        if (!window.confirm("Remover este item?")) {
            return;
        }

        persistItems(items.filter((item) => item.id !== itemId));
    };

    return (
        <section className="mb-8">
            <div className="items-center flex justify-between gap-4 mb-4">
                <h2 className="text-3xl font-walthari font-semibold mb-4 text-vaccineGray-300">
                    Inventario
                </h2>

                <button
                    type="button"
                    onClick={openCreateForm}
                    className="mb-4 inline-flex items-center gap-2 rounded-md bg-vaccineBlueTones-400 px-4 py-2 text-vaccineBlueTones-100 transition-colors hover:bg-blue-700"
                >
                    <FiPlus />
                    Novo item
                </button>
            </div>

            {isFormOpen && (
                <div className="mb-5 rounded-lg border border-vaccineGray-300/40 bg-vaccineBlueTones-1000/80 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="font-trajanPBold text-xl text-vaccineGray-300">
                            {isEditingItem ? "Editar item" : "Novo item"}
                        </h3>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="inline-flex items-center gap-2 rounded-md bg-vaccineGray-300 px-3 py-2 text-vaccineBlack transition-colors hover:bg-vaccineGray-400"
                        >
                            <FiX />
                            Cancelar
                        </button>
                    </div>

                    <div className="grid gap-4">
                        <label className="flex flex-col gap-2 text-sm font-trajanPBold text-vaccineGray-300">
                            Item
                            <input
                                value={draftName}
                                onChange={(event) => setDraftName(event.target.value)}
                                className="w-full rounded-md border border-vaccineGray-300 bg-vaccineBlueTones-1000 p-3 font-trajanPRegular text-vaccineGray-300 placeholder:text-vaccineBlueTones-300 focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400"
                                placeholder="Ex: Pocao de cura, corda, moeda antiga..."
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm font-trajanPBold text-vaccineGray-300">
                            Descricao
                            <textarea
                                value={draftDescription}
                                onChange={(event) => setDraftDescription(event.target.value)}
                                className="min-h-32 w-full rounded-md border border-vaccineGray-300 bg-vaccineBlueTones-1000 p-4 font-trajanPRegular text-vaccineGray-300 placeholder:text-vaccineBlueTones-300 focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400"
                                placeholder="Aparencia, efeito, bonus, observacoes..."
                            />
                        </label>

                        <button
                            type="button"
                            onClick={handleSaveItem}
                            disabled={!draftName.trim()}
                            className="inline-flex w-fit items-center gap-2 rounded-md bg-vaccineBlueTones-400 px-4 py-2 text-vaccineBlueTones-100 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FiSave />
                            Salvar item
                        </button>
                    </div>
                </div>
            )}

            <div className="rounded-lg border border-vaccineGray-300/40 bg-vaccineBlueTones-1000/80 p-4">
                {items.length > 0 ? (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-md border border-vaccineGray-300/30 bg-black/20 p-4"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenDescriptionItemId((currentId) =>
                                                currentId === item.id ? null : item.id
                                            )
                                        }
                                        className="flex-1 rounded-md border border-vaccineGray-300/30 bg-black/10 px-4 py-3 text-left transition-colors hover:border-vaccineBlueTones-400"
                                    >
                                        <h4 className="font-trajanPBold text-xl text-vaccineGray-300">
                                            {item.name}
                                        </h4>
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEditForm(item)}
                                            className="inline-flex items-center gap-2 rounded-md bg-vaccineBlueTones-400 px-3 py-2 text-vaccineBlueTones-100 transition-colors hover:bg-blue-700"
                                        >
                                            <FiEdit />
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="inline-flex items-center gap-2 rounded-md bg-vaccineRed px-3 py-2 text-white transition-colors hover:bg-red-700"
                                        >
                                            <FiTrash2 />
                                            Remover
                                        </button>
                                    </div>
                                </div>

                                {openDescriptionItemId === item.id && (
                                    <div className="mt-4 border-t border-vaccineGray-300/20 pt-3">
                                        <p className="whitespace-pre-line font-trajanPRegular text-vaccineGray-400">
                                            {item.description || "Sem descricao adicionada."}
                                        </p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="font-trajanPRegular text-vaccineBlueTones-300">
                        Nenhum item no inventario.
                    </p>
                )}
            </div>
        </section>
    );
}
