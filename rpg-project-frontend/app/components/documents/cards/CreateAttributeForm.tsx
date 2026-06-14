
import { useState } from "react";
import { useCreateAttribute, useAttributes } from "../../../hooks";
import type { CreateAttributeRequest } from '../../../types'
import toast from "react-hot-toast";
export interface CreateAttributeFormProps {
    onSucess: () => void;
}


export default function CreateAttributeForm({ onSucess }: CreateAttributeFormProps) {

    const [formData, setFormData] = useState<CreateAttributeRequest>({
        name: "",
        description: "",
    });

  
    const { mutate: createAttribute, isPending } = useCreateAttribute();
    const { refetch } = useAttributes();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }


    const handleCreateAttribute = () => {
        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        createAttribute(formData, {
            onSuccess: () => {
                toast.success("Attribute created successfully!");
                onSucess();
                refetch();
            },
            onError: () => {
                toast.error("Failed to create attribute. Please try again.");
            },
        });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Criar novo Atributo</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                        Nome do Atributo
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
                        Descrição do Atributo
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
                <button
                    type="button"
                    onClick={handleCreateAttribute}
                    disabled={isPending}
                    className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Criando..." : "Criar Atributo"}
                </button>
            </form>
        </div>
    );
}