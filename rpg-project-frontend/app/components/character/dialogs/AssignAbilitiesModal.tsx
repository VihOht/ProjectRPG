import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { 
    useAbilities,
    useCharacter,
    useAssignAbilityToCharacter,
    useUnassignAbilityFromCharacter,
    useDeleteSpecialAbility,
 } from "../../../hooks";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { LucideDelete, LucidePlus } from "lucide-react";
import CreateSpecialAbilityModal from "./CreateSpecialAbilityModal";
import EditSpecialAbilityModal from "./EditSpecialAbilityModal";
import type { StandarErrorResponse } from "../../../types/common";



export interface AssignAbilitiesModalProps {
    characterId: number;
}

export default function AssignAbilitiesModal({ characterId }: AssignAbilitiesModalProps) {
    const [open, setOpen] = useState(false);
    const { data: characterData, refetch: refetchCharacter } = useCharacter(characterId);
    const { data: abilitiesData } = useAbilities();
    const { mutate: assignAbility, isPending: isAssigning } = useAssignAbilityToCharacter(characterId);
    const { mutate: unassignAbility, isPending: isUnassigning } = useUnassignAbilityFromCharacter(characterId);
    const { mutate: deleteSpecialAbility, isPending: isDeletingSpecialAbility } = useDeleteSpecialAbility();


    const handleAssignAbility = (abilityId: number) => {
        assignAbility(abilityId, {
            onSuccess: () => {
                refetchCharacter();
                toast.success('Habilidade atribuída com sucesso!');
            },
            onError: (error: unknown) => {
                toast.error('Erro ao atribuir habilidade: ' + (error as StandarErrorResponse).response?.data?.message || 'Ocorreu um erro inesperado.');
            }
        });
    };

    const handleUnassignAbility = (abilityId: number) => {
        unassignAbility(abilityId, {
            onSuccess: () => {
                refetchCharacter();
                toast.success('Habilidade desatribuída com sucesso!');
            },
            onError: (error: unknown) => {
                toast.error('Erro ao desatribuir habilidade: ' + (error as StandarErrorResponse).response?.data?.message || 'Ocorreu um erro inesperado.');
            }
        });
    };
    
    const handleDeleteSpecialAbility = (abilityId: number) => {
        deleteSpecialAbility(abilityId, {
            onSuccess: () => {
                refetchCharacter();
                toast.success('Habilidade especial deletada com sucesso!');
            },
            onError: (error) => {
                toast.error('Erro ao deletar habilidade especial: ' + (error as StandarErrorResponse).response?.data?.message || 'Ocorreu um erro inesperado.');
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                <LucidePlus className="size-5" />
            </button>
            <AppModal open={open} onClose={() => setOpen(false)} title="Atribuir Habilidades">
                <Tabs defaultValue="class" className="w-fulL">
                    <TabsList className="bg-vaccineGray-800/50 w-full border-b border-vaccineGray-300/20 mb-4">
                        <TabsTrigger value="class" className="data-[state=active]:border-vaccinePurple data-[state=active]:border-b-2 text-vaccineGray-300">
                            Habilidades de Classe
                        </TabsTrigger>
                        <TabsTrigger value="special" className="data-[state=active]:border-vaccinePurple data-[state=active]:border-b-2 text-vaccineGray-300">
                            Habilidades Especiais
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="class">
                        <div className="space-y-4">
                            {abilitiesData?.abilities.map((ability) => {
                                const isAssigned = characterData?.character.abilities.some((charAbility) => charAbility.id === ability.id);

                                return (
                                    <div key={ability.id} className="flex items-center justify-between p-4 border rounded-md">
                                        <div className="flex-1 w-80 pr-2">
                                            <h3 className="font-medium text-vaccineGray-300">{ability.name}</h3>
                                            <p className="text-sm text-vaccineGray-600 break-words">{ability.description}</p>
                                        </div>
                                        {isAssigned ? (
                                            <button
                                                onClick={() => handleUnassignAbility(ability.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isUnassigning}
                                            >
                                                Desatribuir
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAssignAbility(ability.id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isAssigning}
                                            >
                                                Atribuir
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>
                    <TabsContent value="special">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <CreateSpecialAbilityModal characterId={characterId} />
                            </div>
                            {characterData?.character.special_abilities.length === 0 ? (
                                <p className="text-vaccineGray-400">Nenhuma habilidade especial encontrada.</p>
                            ) : (
                                characterData?.character.special_abilities.map((ability) => {
                                    return (
                                        <div key={ability.id} className="flex items-center justify-between p-4 border rounded-md">
                                            <div className="flex-1 w-80 pr-2">
                                                <h3 className="font-medium text-vaccineGray-300">{ability.name}</h3>
                                                <p className="text-sm text-vaccineGray-600 break-words">{ability.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <EditSpecialAbilityModal ability={ability} />
                                                <button
                                                    onClick={() => handleDeleteSpecialAbility(ability.id)}
                                                    disabled={isDeletingSpecialAbility}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <LucideDelete className="size-5" />
                                                </button>
                                            </div>
                                            
                                        </div>
                                );
                            }))}
                        </div>
                    </TabsContent>
                </Tabs>
            </AppModal>
        </>
    );
}