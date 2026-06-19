
import { useEffect, useState } from "react";
import { useClasses, useUpdateAbility } from "../../../hooks";
import type { AbilityItem, SubclassItem, UpdateAbilityRequest } from '../../../types'
import toast from "react-hot-toast";
import { LucideEdit } from "lucide-react";
import { AppModal } from "../../ui/AppModal";

export interface UpdateClassAbilityFormProps {
    abilityData: AbilityItem;
}


export default function UpdateClassAbilityForm({ abilityData }: UpdateClassAbilityFormProps) {

    const [formData, setFormData] = useState<UpdateAbilityRequest>({
        name: abilityData.name,
        description: abilityData.description,
        subclass_id: abilityData.subclass_id
    });

    const { data: classesData, refetch } = useClasses();
    
    const [filteredSubclasses, setFilteredSubclasses] = useState<SubclassItem[]>([]);

    const [open, setOpen] = useState(false);

    const { mutate: updateAbility, isPending } = useUpdateAbility(abilityData.id);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value==="null" ? null : value,
        }));
    }

    useEffect(() => {
        const allSubclasses = classesData?.classes.flatMap(cls => cls.subclasses) || [];
        const relatedSubclasses = allSubclasses.filter(subcls => subcls.class_id === abilityData.class_id);
        setFilteredSubclasses(relatedSubclasses);
    }, [abilityData.class_id, classesData]);

    const handleUpdateAbility = () => {
        updateAbility(formData, {
            onSuccess: () => {
                setOpen(false);
                toast.success("Ability updated successfully!");
                refetch();
            },
            onError: () => {
                toast.error("Failed to update ability. Please try again.");
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
            <AppModal open={open} title="Update Class Ability" onClose={() => setOpen(false)}>
                <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Atualizar Abilidade de Classe</h2>
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
                            Subclasse (opcional)
                        </label>
                        <select
                            id="subclassId"
                            name="subclass_id"
                            value={Number(formData.subclass_id) || -1}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        >
                            <option value="-1">Selecione uma subclasse</option>
                            {filteredSubclasses.map((subcls) => (
                                <option key={subcls.id} value={subcls.id}>
                                    {subcls.name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <button
                        type="button"
                        onClick={handleUpdateAbility}
                        disabled={isPending}
                        className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Updating..." : "Update Ability"}
                    </button>
                </form>
            </AppModal>
        </div>
    );
}