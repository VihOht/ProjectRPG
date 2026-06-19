
import { useState } from "react";
import { useClasses, useUpdateClassPower } from "../../../hooks";
import type { UpdateClassPowerRequest, ClassPowerItem } from '../../../types'
import toast from "react-hot-toast";
import { AppModal } from "../../ui/AppModal";
import { LucideEdit } from "lucide-react";

export interface UpdateClassPowerModalProps {
    classPowerData: ClassPowerItem;
}


export default function UpdateClassPowerModal({ classPowerData }: UpdateClassPowerModalProps) {

    const [formData, setFormData] = useState<UpdateClassPowerRequest>({
        name: classPowerData.name,
        description: classPowerData.description,
        level_to_unlock: classPowerData.level_to_unlock,
    });

    const [open, setOpen] = useState(false);

    const { refetch } = useClasses();
    
    const { mutate: updateClassPower, isPending } = useUpdateClassPower(classPowerData.id);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }


    const handleUpdateClassPower = () => {
     
        updateClassPower(formData, {
            onSuccess: () => {
                toast.success("Class power updated successfully!");
                refetch();
            },
            onError: () => {
                toast.error("Failed to update class power. Please try again.");
            },
        });
    };

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                <LucideEdit className="w-4 h-4" />
            </button>
            <AppModal open={open} onClose={() => setOpen(false)} title="Atualizar Poder de Classe">
                <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Criar nova Poder de Classe</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                            Nome da Abilidade de Classe
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
                        <label htmlFor="classDescription" className="block text-sm font-medium text-gray-300 mb-1">
                            Descrição da Abilidade de Classe
                        </label>
                        <textarea
                            id="classDescription"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="subclassId" className="block text-sm font-medium text-gray-300 mb-1">
                            Nivel para desbloquear
                        </label>
                        <input
                            type="number"
                            id="levelToUnlock"
                            name="level_to_unlock"
                            value={formData.level_to_unlock || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        />
                        
                    </div>
                    <button
                        type="button"
                        onClick={handleUpdateClassPower}
                        disabled={isPending}
                        className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Updating..." : "Update Power"}
                    </button>
                </form>
            </AppModal>
        </div>
    );
}