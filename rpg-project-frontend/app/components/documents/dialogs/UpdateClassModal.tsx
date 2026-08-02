
import { useState } from "react";
import { useUpdateClass, useClasses } from "../../../hooks";
import type { ClassItem, UpdateClassRequest} from '../../../types'
import { toast } from "react-hot-toast";
import { AppModal } from "../../ui/AppModal";
import { LucideEdit } from "lucide-react";

export interface UpdateClassModalProps {
    classData: ClassItem;
    refetch: () => void;
}



export default function UpdateClassModal({ classData, refetch }: UpdateClassModalProps) {

    const [open, setOpen] = useState(false);


    const [formData, setFormData] = useState<UpdateClassRequest>({
        name: classData?.name || "",
        description: classData?.description || "",
        base_life: classData?.base_life || 0,
        base_mana: classData?.base_mana || 0,
        base_sanity: classData?.base_sanity || 0,
        base_defense: classData?.base_defense || 0,
        base_ocultism: classData?.base_ocultism || 0,
        base_power: classData?.base_power || 0,
        base_inventory_capacity: classData?.base_inventory_capacity || 0,
        has_mana: classData?.has_mana || false,
        has_ocultism: classData?.has_ocultism || false,
    });

    const { mutate: updateClass, isPending } = useUpdateClass(classData.id);

    const handleUpdateClass = () => {
        updateClass(formData, {
            onSuccess: () => {
                refetch();
                setOpen(false);
                toast.success("Classe atualizada com sucesso!");
            },
            onError: (error) => {
                toast.error("Erro ao atualizar classe: " + (error instanceof Error ? error.response?.data?.message || error.message : "Erro desconhecido"));
            }
        });
    }

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }



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
                title="Modal para atualização de classe."
                onClose={() => setOpen(false)}
            >
                <form>
                    <div className="mb-4">
                        <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                            Nome da Classe
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
                            Descrição da Classe
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
                    <div className="mb-4 flex gap-4 justify-between align-center mt-4">
                        <div className="flex gap-2 mt-2">
                            <label className="flex items-center gap-1 text-sm text-gray-300">
                                Vida Base
                            </label>
                            <input
                                type="number"
                                name="base_life"
                                value={formData.base_life}
                                onChange={handleChange}
                                className="w-20 px-2 py-1 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <label className="flex items-center gap-1 text-sm text-gray-300">
                                Defesa Base
                            </label>
                            <input
                                type="number"
                                name="base_defense"
                                value={formData.base_defense}
                                onChange={handleChange}
                                className="w-20 px-2 py-1 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <label className="flex items-center gap-1 text-sm text-gray-300">
                                Sanidade Base
                            </label>
                            <input
                                type="number"
                                name="base_sanity"
                                value={formData.base_sanity}
                                onChange={handleChange}
                                className="w-20 px-2 py-1 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <label className="flex items-center gap-1 text-sm text-gray-300">
                                Capacidade de Inventário Base
                            </label>
                            <input
                                type="number"
                                name="base_inventory_capacity"
                                value={formData.base_inventory_capacity}
                                onChange={handleChange}
                                className="w-20 px-2 py-1 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex items-center gap-4 mt-8">
                        <label className="flex items-center gap-1 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                name="has_mana"
                                checked={formData.has_mana}
                                onChange={handleChange}
                                className="form-checkbox h-4 w-4 text-vaccinePurple bg-vaccineGray-800/20 border-gray-300 rounded focus:ring-vaccinePurple focus:ring-2 focus:ring-offset-0"
                            />
                            Tem Mana?
                        </label>
                        <label className="flex items-center gap-1 text-sm text-gray-300">
                            <input
                                type="checkbox"                            
                                name="has_ocultism"
                                checked={formData.has_ocultism}
                                onChange={handleChange}
                                className="form-checkbox h-4 w-4 text-vaccinePurple bg-vaccineGray-800/20 border-gray-300 rounded focus:ring-vaccinePurple focus:ring-2 focus:ring-offset-0"
                            />
                            Tem Occultism?
                        </label>
                    </div>
                    <div className="mb-4 flex gap-8 mt-8">

                        {formData.has_mana && (
                            <div className="mb-4 flex gap-2">
                                <label className="flex items-center gap-1 text-sm text-gray-300">
                                    Base Mana
                                </label>
                                <input
                                    type="number"
                                    name="base_mana"
                                    value={formData.base_mana}
                                    onChange={handleChange}
                                    className="w-20 px-2 py-1 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                                />
                            </div>
                        )}
                        {formData.has_ocultism && (
                            <>
                                <div className="mb-4 flex gap-2">
                                    <label className="flex items-center gap-1 text-sm text-gray-300">
                                        Base Ocultismo
                                    </label>
                                    <input
                                        type="number"
                                        name="base_ocultism"
                                        value={formData.base_ocultism}
                                        onChange={handleChange}
                                        className="w-20 px-2 py-1 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                                    />
                                </div>
                                <div className="mb-4 flex gap-2">
                                    <label className="flex items-center gap-1 text-sm text-gray-300">
                                        Base Poder
                                    </label>
                                    <input
                                        type="number"
                                        name="base_power"
                                        value={formData.base_power}
                                        onChange={handleChange}
                                        className="w-20 px-2 py-1 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleUpdateClass}
                        disabled={isPending}
                        className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Updating..." : "Update Class"}
                    </button>
                </form>
            </AppModal>
        </div>
    );
}