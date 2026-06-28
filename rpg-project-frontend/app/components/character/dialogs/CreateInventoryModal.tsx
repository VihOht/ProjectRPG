import { useState } from "react";
import { LucidePlus } from "lucide-react";
import toast from "react-hot-toast";

import { AppModal } from "../../ui/AppModal";

import { useCreateInventory } from "../../../hooks";

import type {
  CreateInventoryRequest,
  InventoryType,
} from "../../../types";

interface CreateInventoryModalProps {
  characterId: number;
}

export default function CreateInventoryModal({
  characterId,
}: CreateInventoryModalProps) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] =
    useState<CreateInventoryRequest>({
      name: "",
      description: "",
      type: "TRANSPORT" as InventoryType,
      capacity: 20,
    });

  const { mutate: createInventory, isPending } =
    useCreateInventory(characterId);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("Informe um nome.");
      return;
    }

    createInventory(formData, {
      onSuccess: () => {
        toast.success("Inventário criado com sucesso!");
        setOpen(false);

        setFormData({
          name: "",
          description: "",
          type: "TRANSPORT" as InventoryType,
          capacity: 20,
        });
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ??
            "Erro ao criar inventário."
        );
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-vaccinePurple px-3 py-2 text-white hover:bg-vaccinePurple/80 transition"
      >
        <LucidePlus className="h-4 w-4" />
      </button>

      <AppModal
        open={open}
        title="Criar Inventário"
        onClose={() => setOpen(false)}
      >
        <form className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-vaccineGray-300">
              Nome
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-vaccineGray-300 bg-vaccineGray-800/20 px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-vaccineGray-300">
              Descrição
            </label>

            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-vaccineGray-300 bg-vaccineGray-800/20 px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-vaccineGray-300">
              Capacidade
            </label>

            <input
              type="number"
              min={1}
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-32 rounded-md border border-vaccineGray-300 bg-vaccineGray-800/20 px-3 py-2 text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={isPending}
            className="rounded-md bg-vaccinePurple px-4 py-2 text-white hover:bg-vaccinePurple/80 disabled:opacity-50"
          >
            {isPending
              ? "Criando..."
              : "Criar Inventário"}
          </button>
        </form>
      </AppModal>
    </>
  );
}