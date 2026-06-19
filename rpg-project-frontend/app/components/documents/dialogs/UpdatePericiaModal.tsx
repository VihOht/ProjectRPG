
import { useState } from "react";
import { useUpdatePericia, usePericias } from "../../../hooks";
import type { UpdatePericiaRequest, PericiaItem } from '../../../types'
import toast from "react-hot-toast";
import { LucideEdit } from "lucide-react";
import { AppModal } from "../../ui/AppModal";
export interface UpdatePericiaFormProps {
    periciaData: PericiaItem
}


export default function UpdatePericiaForm({ periciaData }: UpdatePericiaFormProps) {

    const [formData, setFormData] = useState<UpdatePericiaRequest>({
        name: periciaData.name,
        description: periciaData.description
    });

    const { refetch } = usePericias();  
    const { mutate: updatePericia, isPending } = useUpdatePericia(periciaData.id);

    const [open, setOpen] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }


    const handleUpdatePericia = () => {
        updatePericia(formData, {
            onSuccess: () => {
                toast.success("Pericia atualizada com sucesso!");
                setOpen(false);
                refetch();
            },
            onError: () => {
                toast.error("Falha ao atualizar perícia. Por favor, tente novamente.");
            },
        });
    };

    return (
        <div>
            <button onClick={() => setOpen(true)} className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition">
                <LucideEdit className="w-4 h-4" />
            </button>
            <AppModal open={open} onClose={() => setOpen(false)} title="Atualizar Perícia">
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
                    <button
                        type="button"
                        onClick={handleUpdatePericia}
                        disabled={isPending}
                        className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Atualizando..." : "Atualizar Perícia"}
                    </button>
                </form>
            </AppModal>
        </div>
    );
}