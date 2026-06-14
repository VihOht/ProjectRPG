
import { useState } from "react";
import { useAttributes, useCreatePericia, usePericias } from "../../../hooks";
import type { CreatePericiaRequest } from '../../../types'
import toast from "react-hot-toast";
export interface CreatePericiaFormProps {
    onSucess: () => void;
}


export default function CreateClassPowerForm({ onSucess }: CreatePericiaFormProps) {

    const [formData, setFormData] = useState<CreatePericiaRequest>({
        name: "",
        description: "",
        attribute_id: -1,
    });

    const { data: attributesData } = useAttributes();
    const { refetch } = usePericias();  
    const { mutate: createPericia, isPending } = useCreatePericia();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }


    const handleCreatePericia = () => {
        if (!formData.attribute_id) {
            toast.error("Please select an attribute for the proficiency.");
            return;
        }
        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        createPericia(formData, {
            onSuccess: () => {
                toast.success("Proficiency created successfully!");
                onSucess();
                refetch();
            },
            onError: () => {
                toast.error("Failed to create proficiency. Please try again.");
            },
        });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Criar nova Perícia</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                        Nome da Perícia
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
                        Descrição da Perícia
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
                <div className="mb-4">
                    <label htmlFor="classId" className="block text-sm font-medium text-gray-300 mb-1">
                        Atributo
                    </label>
                    <select
                        id="classId"
                        name="attribute_id"
                        value={formData.attribute_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                    >
                        <option value="">Selecione um atributo</option>
                        {attributesData?.attributes.map((attr) => (
                            <option key={attr.id} value={attr.id}>
                                {attr.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={handleCreatePericia}
                    disabled={isPending}
                    className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Criando..." : "Criar Perícia"}
                </button>
            </form>
        </div>
    );
}