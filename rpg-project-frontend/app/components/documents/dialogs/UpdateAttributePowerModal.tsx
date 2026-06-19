
import { useState } from "react";
import { useUpdateAttributePower, useAttributePowers } from "../../../hooks";
import type { AttributePowerItem, UpdateAttributePowerRequest } from '../../../types'
import toast from "react-hot-toast";
import { LucideEdit } from "lucide-react";
import { AppModal } from "../../ui/AppModal";

export interface UpdateAttributePowerFormProps {
    attributePowerData?: AttributePowerItem;
}


export default function UpdateAttributePowerForm({ attributePowerData }: UpdateAttributePowerFormProps) {

    const [formData, setFormData] = useState<UpdateAttributePowerRequest>({
        name: attributePowerData?.name || "",
        description: attributePowerData?.description || "",
        level_to_unlock: attributePowerData?.level_to_unlock,
    });

    const [open, setOpen] = useState(false);

    const { refetch } = useAttributePowers();

    const { mutate: updateAttributePower, isPending } = useUpdateAttributePower(attributePowerData?.id || -1);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }

    const handleUpdateAttributePower = () => {
        updateAttributePower(formData, {
            onSuccess: () => {
                toast.success("Attribute power updated successfully!");
                setOpen(false);
                refetch();
            },
            onError: () => {
                toast.error("Failed to update attribute power. Please try again.");
            },
        });
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                <LucideEdit className="w-4 h-4" />
            </button>
            <AppModal open={open} onClose={() => setOpen(false)} title="Atualizar Poder de Atributo">
                <form>
                    <div className="mb-4">
                        <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                            Nome da Abilidade de Atributo
                        </label>
                        <input
                            type="text"
                            id="className"
                            value={formData.name}
                            onChange={handleChange}
                            name="name"
                            className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="attributeDescription" className="block text-sm font-medium text-gray-300 mb-1">
                            Descrição da Abilidade de Atributo
                        </label>
                        <textarea
                            id="attributeDescription"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="subclassId" className="block text-sm font-medium text-gray-300 mb-1">
                            Nível para desbloquear
                        </label>
                        <input
                            type="number"
                            id="levelToUnlock"
                            name="level_to_unlock"
                            value={formData.level_to_unlock}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleUpdateAttributePower}
                        disabled={isPending}
                        className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Atualizando..." : " Atualizar Poder de Atributo"}
                    </button>
                </form>
            </AppModal>
        </div>
    );
}