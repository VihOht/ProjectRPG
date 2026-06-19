import { AppModal } from "../../ui/AppModal";
import { useCreateSpecialAbility, useCharacter } from "../../../hooks";
import { toast } from "react-hot-toast";
import { useState } from "react";

export interface CreateSpecialAbilityModalProps {
    characterId: number;
}

export default function CreateSpecialAbilityModal({ characterId }: CreateSpecialAbilityModalProps) {
    const { mutate: createSpecialAbility, isPending: isCreatingSpecialAbility } = useCreateSpecialAbility();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { refetch: refetchCharacter } = useCharacter(characterId);

    const handleCreateSpecialAbility = () => {
        createSpecialAbility(
            { name, description, character_id: characterId },
            {
                onSuccess: () => {
                    toast.success('Habilidade especial criada com sucesso!');
                    setName('');
                    setDescription('');
                    setOpen(false);
                    refetchCharacter();
                },
                onError: (error) => {
                    toast.error('Erro ao criar habilidade especial: ' + (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Ocorreu um erro inesperado.');
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
                Criar Habilidade Especial
            </button>
            <AppModal open={open} onClose={() => setOpen(false)} title="Criar Habilidade Especial">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-vaccineGray-300 mb-1">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-vaccineGray-800 text-vaccineGray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-vaccineGray-300 mb-1">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-vaccineGray-800 text-vaccineGray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
                            rows={4}
                        />
                    </div>
                    <button
                        onClick={handleCreateSpecialAbility}
                        disabled={isCreatingSpecialAbility}
                        className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50"
                    >
                        Criar
                    </button>
                </div>
            </AppModal>
        </>
    );
}