
import { useState } from "react";
import { useUpdateAttribute } from "../../../hooks";
import type { AttributeItem, UpdateAttributeRequest } from '../../../types'
import toast from "react-hot-toast";
import { AppModal } from "../../ui/AppModal";
import { LucideEdit } from "lucide-react";

export interface UpdateAttributeModalProps {
    attributeData: AttributeItem
    refetch: () => void;
}


export default function UpdateAttributeModal({ attributeData, refetch }: UpdateAttributeModalProps) {

    const [formData, setFormData] = useState<UpdateAttributeRequest>({
        name: attributeData.name,
        description: attributeData.description,
    });

    const [open, setOpen] = useState(false);
  
    const { mutate: updateAttribute, isPending } = useUpdateAttribute(attributeData.id);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }


    const handleUpdateAttribute = () => {
        updateAttribute(formData, {
            onSuccess: () => {
                toast.success("Attribute updated successfully!");
                refetch();
            },
            onError: () => {
                toast.error("Failed to update attribute. Please try again.");
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
            <AppModal open={open} onClose={() => setOpen(false)} title="Atualizar Atributo">

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
                        onClick={handleUpdateAttribute}
                        disabled={isPending}
                        className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Atualizando..." : "Atualizar Atributo"}
                    </button>
                </form>
            </AppModal>
        </div>
    );
}