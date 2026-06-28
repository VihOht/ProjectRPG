import { useState } from "react";
import { LucideEdit } from "lucide-react";
import { toast } from "react-hot-toast";

import { AppModal } from "../../ui/AppModal";
import { useItems, useUpdateItem } from "../../../hooks";

import type { Item, UpdateItemRequest } from "../../../types";

export interface UpdateItemModalProps {
  itemData: Item;
}

export default function UpdateItemModal({ itemData }: UpdateItemModalProps) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<UpdateItemRequest>({
    name: itemData.name || "",
    description: itemData.description || "",
    stackable: itemData.stackable || false,
    equipable: itemData.equipable || false,
    max_quantity: itemData.max_quantity ?? undefined,
    data: getInitialItemData(itemData),
  });

  const { refetch } = useItems();
  const { mutate: updateItem, isPending } = useUpdateItem(itemData.id);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number" && value === ""
          ? undefined
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleDataChange = (e: any) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      data: {
        ...(prev.data || {}),
        [name]:
          type === "number" && value === ""
            ? undefined
            : type === "number"
            ? Number(value)
            : value,
      },
    }));
  };

  const handleUpdateItem = () => {
    updateItem(formData, {
      onSuccess: () => {
        refetch();
        setOpen(false);
        toast.success("Item atualizado com sucesso!");
      },
      onError: (error: any) => {
        toast.error(
          "Erro ao atualizar item: " +
            (error?.response?.data?.message || "Erro desconhecido")
        );
      },
    });
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
      >
        <LucideEdit className="w-4 h-4" />
      </button>

      <AppModal
        open={open}
        title="Modal para atualização de item."
        onClose={() => setOpen(false)}
      >
        <form>
          <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">
            Atualizar Item
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo do Item
            </label>

            <input
              type="text"
              value={getItemTypeLabel(itemData.item_type)}
              disabled
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md text-sm text-vaccineGray-400 opacity-70"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome
            </label>

            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
            />
          </div>

          <div className="mb-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                name="stackable"
                checked={!!formData.stackable}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-vaccinePurple bg-vaccineGray-800/20 border-gray-300 rounded focus:ring-vaccinePurple"
              />
              Empilhável
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                name="equipable"
                checked={!!formData.equipable}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-vaccinePurple bg-vaccineGray-800/20 border-gray-300 rounded focus:ring-vaccinePurple"
              />
              Equipável
            </label>
          </div>

          {formData.stackable && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Quantidade máxima
              </label>

              <input
                type="number"
                name="max_quantity"
                value={formData.max_quantity ?? ""}
                onChange={handleChange}
                className="w-32 px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
              />
            </div>
          )}

          {itemData.item_type === "weapon" && (
            <WeaponFields
              data={formData.data || {}}
              onChange={handleDataChange}
            />
          )}

          {itemData.item_type === "armor" && (
            <ArmorFields
              data={formData.data || {}}
              onChange={handleDataChange}
            />
          )}

          {itemData.item_type === "artefact" && (
            <ArtefactFields
              data={formData.data || {}}
              onChange={handleDataChange}
            />
          )}

          {itemData.item_type === "utility" && (
            <p className="mb-4 text-vaccineGray-600">
              Item utilitário sem atributos extras.
            </p>
          )}

          <button
            type="button"
            onClick={handleUpdateItem}
            disabled={isPending}
            className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Atualizando..." : "Atualizar Item"}
          </button>
        </form>
      </AppModal>
    </div>
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
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Dano" name="damage" value={data.damage || ""} onChange={onChange} />
      <Input label="Perícia" name="pericia" type="number" value={data.pericia ?? ""} onChange={onChange} />
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
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Resistência" name="resistance" type="number" value={data.resistance ?? ""} onChange={onChange} />
      <Input label="Redução" name="reduction" type="number" value={data.reduction ?? ""} onChange={onChange} />
      <Input label="Perícia" name="pericia" type="number" value={data.pericia ?? ""} onChange={onChange} />
      <Input label="Tamanho" name="size" value={data.size || ""} onChange={onChange} />
      <Input label="Efeito" name="effect" value={data.effect || ""} onChange={onChange} />
    </div>
  );
}

function ArtefactFields({
  data,
  onChange,
}: {
  data: Record<string, any>;
  onChange: (e: any) => void;
}) {
  return (
    <div className="mb-4">
      <Input
        label="Efeito"
        name="effect"
        value={data.effect || ""}
        onChange={onChange}
      />
    </div>
  );
}

function Input({
  label,
  name,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  onChange: (e: any) => void;
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
        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
      />
    </div>
  );
}

function getInitialItemData(item: Item): Record<string, any> {
  if (item.item_type === "weapon") {
    return {
      damage: item.damage || "",
      pericia: item.pericia ?? 0,
      critical: item.critical || "",
      range: item.range || "",
    };
  }

  if (item.item_type === "armor") {
    return {
      resistance: item.resistance ?? 0,
      reduction: item.reduction ?? 0,
      pericia: item.pericia ?? 0,
      size: item.size || "",
      effect: item.effect || "",
    };
  }

  if (item.item_type === "artefact") {
    return {
      effect: item.effect || "",
    };
  }

  return {};
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