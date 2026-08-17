
import { useState, type ChangeEvent } from "react";
import { useUpdateRace } from "../../../hooks";
import type { RaceItem, UpdateRaceRequest } from '../../../types'
import { toast } from "react-hot-toast";
import { AppModal } from "../../ui/AppModal";
import { LucideEdit } from "lucide-react";

export interface UpdateRaceModalProps {
    raceData: RaceItem;
    refetch: () => void;
}



export default function UpdateRaceModal({ raceData, refetch }: UpdateRaceModalProps) {

    const [open, setOpen] = useState(false);


    const [formData, setFormData] = useState<UpdateRaceRequest>({
        name: raceData?.name || "",
        description: raceData?.description || "",
    });

    const { mutate: updateRace, isPending } = useUpdateRace(raceData.id);

    const handleUpdateRace = () => {
        updateRace(formData, {
            onSuccess: () => {
                refetch();
                setOpen(false);
                toast.success("Espécie atualizada com sucesso!");
            },
            onError: () => {
                toast.error("Erro ao atualizar espécie.");
            }
        });
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
                title="Atualizar espécie"
                onClose={() => setOpen(false)}
            >
                <form>
                    <div className="mb-4">
                        <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                            Nome da Espécie
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
                            Descrição da Espécie
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
                        onClick={handleUpdateRace}
                        disabled={isPending}
                        className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Atualizando..." : "Atualizar espécie"}
                    </button>
                </form>
            </AppModal>
        </div>
    );
}
