import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { useAssignWizardcraftToCharacter, useUnassignWizardcraftFromCharacter, useCharacter, useWizardcrafts } from "../../../hooks";

import { toast } from "react-hot-toast";
import { LucidePlus } from "lucide-react";


export interface WizardcraftItemProps {
    character_id: number;
}

export default function AssignWizardcraftModal(
    { character_id }: WizardcraftItemProps
) {
    const [open, setOpen] =
        useState(false);

    const {data: wizardcrafts, isLoading, refetch} = useWizardcrafts();
   
    const { data: character } = useCharacter(character_id);
    const { mutate: assignWizardcraft, isPending: isAssigningWizardcraft } = useAssignWizardcraftToCharacter(character_id);
    const { mutate: unassignWizardcraft, isPending: isUnassigningWizardcraft } = useUnassignWizardcraftFromCharacter(character_id);



    const onAssignWizardcraft = (id: number) => {
        assignWizardcraft(id, {
            onSuccess: () => {
                refetch();
                toast.success("Feitiço atribuído com sucesso!");
            }
        });
    }

    const onUnassignWizardcraft = (id: number) => {
        unassignWizardcraft(id, {
            onSuccess: () => {
                refetch();
                toast.success("Feitiço removido com sucesso!");
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
                title="Feitiços"
                onClose={() => setOpen(false)}

            >
                { wizardcrafts && wizardcrafts.wizardcrafts.length > 0 ? (
                    <div className="overflow-y-auto w-full h-[80vh]">
                        <ul className="list-disc w-full">
                            {wizardcrafts.wizardcrafts.map((wizardcraft) => {
                                
                                const isAssigned = (character && character.character.wizardcrafts.some((wc) => wc.id === wizardcraft.id)) ? true : false;
                                return (
                                    <li key={wizardcraft.id} className="mb-2">
                                        <div className="w-full border rounded-md p-4">
                                            <div className="flex w-full justify-between items-center gap-2">
                                                <h3 className="text-xl font-semibold text-vaccinePurple">{wizardcraft.name}</h3>
                                                {isAssigned ? (
                                                    <button
                                                        onClick={() => onUnassignWizardcraft(wizardcraft.id)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={isUnassigningWizardcraft}
                                                    >
                                                        Desatribuir
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onAssignWizardcraft(wizardcraft.id)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={isAssigningWizardcraft}
                                                    >
                                                        Atribuir
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <p className="text-vaccineGray-400">{wizardcraft.description}</p>
                                            <p className="text-vaccineGray-400">Custo de Mana: {wizardcraft.mana_cost}</p>
                                        
                                        
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[80vh]">
                        {isLoading ? (
                            <p className="text-vaccineGray-400">Carregando feitiços...</p>
                        ) : (
                            <p className="text-vaccineGray-400">Nenhum feitiço encontrado.</p>
                        )}
                    </div>
                )}
            </AppModal>
        </>
        
    );
}