import { useState } from "react";
import { LucidePlusCircle } from "lucide-react";
import toast from "react-hot-toast";

import { AppModal } from "../../ui/AppModal";
import { useCreateItem, useAddItemToInventory, useToggleItemTemporary } from "../../../hooks";
import type { CreateItemRequest } from "../../../types";

interface CreateTemporaryItemModalProps {
  inventoryId: number;
}

export default function CreateTemporaryItemModal({
  inventoryId,
}: CreateTemporaryItemModalProps) {
  const [open, setOpen] = useState(false);

  const [createdItemId, setCreatedItemId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateItemRequest>({
    name: "",
    description: "",
    item_type: "utility",
    stackable: false,
    equipable: false,
    max_quantity: undefined,
    data: {},
  });

  const { mutate: createItem, isPending: isCreating } = useCreateItem();
  const { mutate: addItem, isPending: isAdding } = useAddItemToInventory(inventoryId);
  const { mutate: toggleTemporary } = useToggleItemTemporary(createdItemId);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number" && value !== ""
          ? Number(value)
          : value,
      ...(name === "item_type"
        ? { data: getDefaultDataByType(value) }
        : {}),
    }));
  };

  const handleDataChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      data: {
        ...(prev.data || {}),
        [name]: value,
      },
    }));
  };

  const handleCreateTemporaryItem = () => {
    if (!formData.name || !formData.description || !formData.item_type) {
      toast.error("Preencha nome, descrição e tipo.");
      return;
    }

    createItem(formData, {
      onSuccess: (response) => {
        const itemId = response.item.id;
        setCreatedItemId(itemId);

        toggleTemporary(undefined, {
          onSuccess: () => {
            addItem(
              {
                item_id: itemId,
                quantity: 1,
              },
              {
                onSuccess: () => {
                  toast.success("Item temporário criado e adicionado.");
                  setOpen(false);
                  resetForm();
                },
                onError: (error: any) => {
                  toast.error(
                    error?.response?.data?.message ||
                      "Item criado, mas não foi possível adicioná-lo ao inventário."
                  );
                },
              }
            );
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message ||
                "Item criado, mas não foi possível marcá-lo como temporário."
            );
          },
        });
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Erro ao criar item temporário."
        );
      },
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      item_type: "utility",
      stackable: false,
      equipable: false,
      max_quantity: undefined,
      data: {},
    });
    setCreatedItemId(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-vaccinePurple/40 bg-vaccineBlueTones-1000/60 px-3 py-2 text-vaccineGray-200 hover:bg-vaccinePurple/30 transition"
      >
        <LucidePlusCircle className="h-4 w-4" />
      </button>

      <AppModal
        open={open}
        title="Criar item temporário"
        onClose={() => setOpen(false)}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo
            </label>

            <select
              name="item_type"
              value={formData.item_type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
            >
              <option value="weapon">Arma</option>
              <option value="armor">Armadura</option>
              <option value="artefact">Artefato</option>
              <option value="utility">Utilitário</option>
            </select>
          </div>

          <Input
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                name="stackable"
                checked={!!formData.stackable}
                onChange={handleChange}
              />
              Empilhável
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                name="equipable"
                checked={!!formData.equipable}
                onChange={handleChange}
              />
              Equipável
            </label>
          </div>

          {formData.stackable && (
            <Input
              label="Quantidade máxima"
              name="max_quantity"
              type="number"
              value={formData.max_quantity ?? ""}
              onChange={handleChange}
            />
          )}

          {formData.item_type === "weapon" && (
            <WeaponFields data={formData.data || {}} onChange={handleDataChange} />
          )}

          {formData.item_type === "armor" && (
            <ArmorFields data={formData.data || {}} onChange={handleDataChange} />
          )}

          {formData.item_type === "artefact" && (
            <Input
              label="Efeito"
              name="effect"
              value={(formData.data as any)?.effect || ""}
              onChange={handleDataChange}
            />
          )}

          <button
            type="button"
            onClick={handleCreateTemporaryItem}
            disabled={isCreating || isAdding}
            className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50"
          >
            {isCreating || isAdding
              ? "Criando..."
              : "Criar e Adicionar Item Temporário"}
          </button>
        </form>
      </AppModal>
    </>
  );
}

function WeaponFields({
  data,
  onChange,
}: {
  data: Record<string, any>;
  onChange: (e: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Dano" name="damage" value={data.damage || ""} onChange={onChange} />
      <Input label="Perícia" name="pericia" value={data.pericia || ""} onChange={onChange} />
      <Input label="Crítico" name="critical" value={data.critical || ""} onChange={onChange} />
      <Input label="Alcance" name="range" value={data.range || ""} onChange={onChange} />
    </div>
  );
}

function ArmorFields({
  data,
  onChange,
}: {
  data: Record<string, any>;
  onChange: (e: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Resistência" name="resistance" value={data.resistance || ""} onChange={onChange} />
      <Input label="Redução" name="reduction" value={data.reduction || ""} onChange={onChange} />
      <Input label="Perícia" name="pericia" value={data.pericia || ""} onChange={onChange} />
      <Input label="Tamanho" name="size" value={data.size || ""} onChange={onChange} />
      <Input label="Efeito" name="effect" value={data.effect || ""} onChange={onChange} />
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: any) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
      />
    </div>
  );
}

function getDefaultDataByType(itemType: CreateItemRequest["item_type"]) {
  if (itemType === "weapon") {
    return {
      damage: "",
      pericia: "",
      critical: "",
      range: "",
    };
  }

  if (itemType === "armor") {
    return {
      resistance: "",
      reduction: "",
      pericia: "",
      size: "",
      effect: "",
    };
  }

  if (itemType === "artefact") {
    return {
      effect: "",
    };
  }

  return {};
}