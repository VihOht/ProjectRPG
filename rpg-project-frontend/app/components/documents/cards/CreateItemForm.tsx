
import { useState } from "react";
import toast from "react-hot-toast";

import { useCreateItem } from "../../../hooks";
import type { CreateItemRequest } from "../../../types";

export interface CreateItemFormProps {
  onSucess: () => void;
  defaultType?: "weapon" | "armor" | "artefact" | "utility";
}

const getDefaultDataByType = (itemType: CreateItemRequest["item_type"]) => {
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
};

export default function CreateItemForm({
  onSucess,
  defaultType = "weapon",
}: CreateItemFormProps) {
  const [formData, setFormData] = useState<CreateItemRequest>({
    name: "",
    description: "",
    item_type: defaultType,
    stackable: false,
    equipable: false,
    max_quantity: undefined,
    data: {},
    ...getDefaultDataByType(defaultType)
  });

  const { mutate: createItem, isPending } = useCreateItem();

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
    }));
  };

  const handleDataChange = (e: any) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      data: {
        ...(prev.data || {}),
        [name]: type === "number" && value !== "" ? Number(value) : value,
      },
    }));
  };

  const handleCreateItem = () => {
    if (!formData.name || !formData.description || !formData.item_type) {
      toast.error("Preencha nome, descrição e tipo do item.");
      return;
    }

    createItem(formData, {
      onSuccess: () => {
        toast.success("Item criado com sucesso!");
        onSucess();
      },
      onError: (error: any) => {
        toast.error(
          "Erro ao criar item: " +
            (error?.response?.data?.message || "Erro desconhecido")
        );
      },
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">
        Criar novo item
      </h2>

      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tipo do Item
          </label>

          <h1 className="text-lg font-semibold text-white">{formData.item_type}</h1>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nome
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
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
            value={formData.description}
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

        {formData.item_type === "weapon" && (
          <WeaponFields onChange={handleDataChange} />
        )}

        {formData.item_type === "armor" && (
          <ArmorFields onChange={handleDataChange} />
        )}

        {formData.item_type === "artefact" && (
          <ArtefactFields onChange={handleDataChange} />
        )}

        <button
          type="button"
          onClick={handleCreateItem}
          disabled={isPending}
          className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Criando..." : "Criar Item"}
        </button>
      </form>
    </div>
  );
}

function WeaponFields({
  onChange,
}: {
  onChange: (e: any) => void;
}) {
  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Dano" name="damage" onChange={onChange} />
      <Input label="Perícia" name="pericia" onChange={onChange} />
      <Input label="Crítico" name="critical" onChange={onChange} />
      <Input label="Alcance" name="range" onChange={onChange} />
    </div>
  );
}

function ArmorFields({ onChange }: { onChange: (e: any) => void }) {
  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Resistência" name="resistance" onChange={onChange} />
      <Input label="Redução" name="reduction" onChange={onChange} />
      <Input label="Perícia" name="pericia" onChange={onChange} />
      <Input label="Tamanho" name="size" onChange={onChange} />
      <Input label="Efeito" name="effect" onChange={onChange} />
    </div>
  );
}

function ArtefactFields({ onChange }: { onChange: (e: any) => void }) {
  return (
    <div className="mb-4">
      <Input label="Efeito" name="effect" onChange={onChange} />
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  onChange,
}: {
  label: string;
  name: string;
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
        onChange={onChange}
        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
      />
    </div>
  );
}