
import { useState } from "react";
import { useCreateAttributePower, useAttributePowers } from "../../../hooks";
import type { CreateAttributePowerRequest, ListAttributesResponse } from '../../../types'
import toast from "react-hot-toast";

export interface CreateAttributePowerFormProps {
    onSucess: () => void;
    attributesData: ListAttributesResponse
}


export default function CreateAttributePowerForm({ onSucess, attributesData }: CreateAttributePowerFormProps) {
    
    const [formData, setFormData] = useState<CreateAttributePowerRequest>({
        name: "",
        description: "",
        attribute_id: -1,
        level_to_unlock: undefined,
    });
    

    const { refetch } = useAttributePowers();

    const { mutate: createAttributePower, isPending } = useCreateAttributePower();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }

    const handleCreateAttributePower = () => {
        if (formData.attribute_id === -1) {
            toast.error("Please select an attribute for the power.");
            return;
        }
        createAttributePower(formData, {
            onSuccess: () => {
                toast.success("Attribute power created successfully!");
                onSucess();
                refetch();
            },
            onError: () => {
                toast.error("Failed to create attribute power. Please try again.");
            },
        });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Criar nova Abilidade de Atributo</h2>
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
                <div className="mb-4">
                    <label htmlFor="attributeId" className="block text-sm font-medium text-gray-300 mb-1">
                        Atributo
                    </label>
                    <select
                        id="attributeId"
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
                    onClick={handleCreateAttributePower}
                    disabled={isPending}
                    className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Criando..." : " Criar Poder de Atributo"}
                </button>
            </form>
        </div>
    );
}