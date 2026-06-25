import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { useRituals, useAssignRitualToCharacter, useUnassignRitualFromCharacter, useCharacter, useSubclasses } from "../../../hooks";

import { toast } from "react-hot-toast";
import { LucidePlus } from "lucide-react";


export interface RitualItemProps {
    character_id: number;
}

export default function AssignRitualModal(
    { character_id }: RitualItemProps
) {
    const [open, setOpen] =
        useState(false);

    const {data: rituals, isLoading, refetch} = useRituals();
   

    const { data: subclasses } = useSubclasses();
    const { data: character } = useCharacter(character_id);
    const { mutate: assignRitual, isPending: isAssigningRitual } = useAssignRitualToCharacter(character_id);
    const { mutate: unassignRitual, isPending: isUnassigningRitual } = useUnassignRitualFromCharacter(character_id);



    const onAssignRitual = (id: number) => {
        assignRitual(id, {
            onSuccess: () => {
                refetch();
                toast.success("Ritual atribuído com sucesso!");
            }
        });
    }

    const onUnassignRitual = (id: number) => {
        unassignRitual(id, {
            onSuccess: () => {
                refetch();
                toast.success("Ritual removido com sucesso!");
            }
        });
    }
    return (
        <>  
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                <LucidePlus className="w-4 h-4" />
            </button>
            <AppModal
                open={open}
                title="Rituais"
                onClose={() => setOpen(false)}

            >
                { rituals && rituals.rituals.length > 0 ? (
                    <div className="overflow-y-auto w-full h-[80vh]">
                        <ul className="list-disc w-full">
                            {rituals.rituals.map((ritual) => {
                                
                                const isAssigned = (character && character.character.rituals.some((rit) => rit.id === ritual.id)) ? true : false;
                                const subclass = subclasses?.subclasses.find((sub) => sub.id === ritual.subclass_id);
                                return (
                                    <li key={ritual.id} className="mb-2">
                                        <div className="flex gap-2 justify-between w-full border rounded-md">
                                            <div className="p-4 w-full bg-vaccineGray-50">
                                                <div className="flex w-full justify-between items-center gap-2">
                                                    <h3 className="text-xl font-semibold text-vaccinePurple">{ritual.name} <span className="text-vaccineGray-400"> (poder {ritual.power_level})</span> - {subclass?.name || 'Neutro'}</h3>
                                                    {isAssigned ? (
                                                        <button
                                                            onClick={() => onUnassignRitual(ritual.id)}
                                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={isUnassigningRitual}
                                                        >
                                                            Desatribuir
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => onAssignRitual(ritual.id)}
                                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={isAssigningRitual}
                                                        >
                                                            Atribuir
                                                        </button>
                                                    )}
                                                </div>

                                                <p className="text-vaccineGray-400">{ritual.description}</p>
                                                <p className="text-vaccineGray-400">Custo de Ocultismo: {ritual.ocultism_cost}</p>
                                            </div>
                                            
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[80vh]">
                        {isLoading ? (
                            <p className="text-vaccineGray-400">Carregando rituais...</p>
                        ) : (
                            <p className="text-vaccineGray-400">Nenhum ritual encontrado.</p>
                        )}
                    </div>
                )}
            </AppModal>
        </>
        
    );
}