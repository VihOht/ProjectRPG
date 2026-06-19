import { AppModal } from "../../ui/AppModal";
import { useUpdateSpecialAbility, useCharacter } from "../../../hooks";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { LucideEdit } from "lucide-react";
import type { StandarErrorResponse } from "../../../types/common";

export interface UpdateSpecialAbilityModalProps {
    ability: any; // Replace 'any' with the actual type for the ability object
}

export default function UpdateSpecialAbilityModal({ ability }: UpdateSpecialAbilityModalProps) {
    const { mutate: updateSpecialAbility, isPending: isUpdatingSpecialAbility } = useUpdateSpecialAbility(ability.id);
    const { refetch: refetchCharacter } = useCharacter(ability.character_id);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(ability.name);
    const [description, setDescription] = useState(ability.description);

    const handleUpdateSpecialAbility = () => {
        updateSpecialAbility(
            { name, description },
            {
                onSuccess: () => {
                    toast.success('Habilidade especial atualizada com sucesso!');
                    setName('');
                    setDescription('');
                    setOpen(false);
                    refetchCharacter();
                },
                onError: (error) => {
                    toast.error('Erro ao atualizar habilidade especial: ' + (error as StandarErrorResponse).response?.data?.message || 'Ocorreu um erro inesperado.');
                }
            }
        );
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                <LucideEdit className="size-5" />
            </button>
            <AppModal open={open} onClose={() => setOpen(false)} title="Atualizar Habilidade Especial">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-vaccineGray-300 mb-1">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 text-vaccineGray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-vaccineGray-300 mb-1">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 text-vaccineGray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
                            rows={4}
                        />
                    </div>
                    <button
                        onClick={handleUpdateSpecialAbility}
                        disabled={isUpdatingSpecialAbility}
                        className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50"
                    >
                        Atualizar
                    </button>
                </div>
            </AppModal>
        </>
    );
}