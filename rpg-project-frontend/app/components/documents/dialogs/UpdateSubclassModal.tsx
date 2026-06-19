
import { useState } from "react";
import { useUpdateSubclass, useClasses } from "../../../hooks";
import type { UpdateSubclassRequest, SubclassItem } from '../../../types'
import { toast } from "react-hot-toast";
import { LucideEdit } from "lucide-react";
import { AppModal } from "../../ui/AppModal";

export interface UpdateSubclassFormProps {
    subclassData: SubclassItem;
}


export default function UpdateSubclassForm({ subclassData }: UpdateSubclassFormProps) {

    const [formData, setFormData] = useState<UpdateSubclassRequest>({
        name: subclassData.name,
        description: subclassData.description,
    });

    const [open, setOpen] = useState(false);

    const { refetch } = useClasses();

    const { mutate: updateSubclass, isPending } = useUpdateSubclass(subclassData.id);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }

    const handleUpdateSubclass = () => {
        updateSubclass(formData, {
            onSuccess: () => {
                toast.success("Subclasse atualizada com sucesso!");
                setOpen(false);
                refetch();
            }
            ,
            onError: () => {
                toast.error("Falha ao atualizar subclasse. Por favor, tente novamente.");
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
            <AppModal open={open} onClose={() => setOpen(false)} title="Atualizar Subclasse">
                <form>
                    <div className="mb-4">
                        <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                            Nome da Subclasse
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
                            Descrição da Subclasse
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
                        onClick={() => {  handleUpdateSubclass() }}
                        disabled={isPending}
                        className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Atualizando..." : "Atualizar Subclasse"}
                    </button>
                </form>
            </AppModal>
        </div>
    );
}