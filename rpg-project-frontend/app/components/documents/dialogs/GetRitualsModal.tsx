import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { useDeleteRitual, useRituals, useSubclass, useToggleRitualVisibility } from "../../../hooks";
import { useAuthProvider } from "../../../providers";
import { LucideDelete, LucideEye, LucideEyeOff } from "lucide-react";
import CreateRitualModal from "./CreateRitualModal";
import { toast } from "react-hot-toast";


export default function GetRitualsModal(
) {
    const [open, setOpen] =
        useState(false);

    const {data: rituals, isLoading, refetch} = useRituals();
    const { user } = useAuthProvider();

    const { mutate: deleteRitual, isPending: isDeletingRitual } = useDeleteRitual();

    const onDeleteRitual = (id: number) => {
        if (!confirm("Tem certeza que deseja deletar este ritual?") || !confirm("Esta ação não pode ser desfeita.")) {
            return;
        }
        deleteRitual(id, {
            onSuccess: () => {
                refetch();
            }
        });
    }
                

    const isAdmin = user?.role === "ADMIN";

    return (
        <>  
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 min-w-[100px] bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                Rituais
            </button>
            <AppModal
                open={open}
                title="Rituais"
                onClose={() => setOpen(false)}

            >
                { rituals && rituals.rituals.length > 0 ? (
                    <div className="overflow-y-auto w-full h-auto">
                        <div className="flex justify-end mb-4 w-full">
                            {isAdmin && (
                                <CreateRitualModal />
                            )}
                        </div>
                        <ul className="list-disc w-full">
                            {rituals.rituals.map((ritual) => (
                                <RitualItem key={ritual.id} ritual={ritual} isAdmin={isAdmin} onDelete={onDeleteRitual} isDeleting={isDeletingRitual} />
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-auto mb-4">
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

const RitualItem = ({ ritual, isAdmin, onDelete, isDeleting }: { ritual: any, isAdmin: boolean, onDelete: (id: number) => void, isDeleting: boolean }) => {
    
    const { data: subclass } = useSubclass(ritual.subclass_id);
    const { mutate: toggleRitual, isPending: isTogglingRitual } = useToggleRitualVisibility();
    const { refetch: refetchRituals } = useRituals();

    const onToggleRitual = (id: number) => {
        toggleRitual(id, {
            onSuccess: () => {
                refetchRituals();
                toast.success("Visibilidade do ritual alterada com sucesso!");
            },
            onError: (error) => {
                toast.error("Erro ao alterar visibilidade do ritual: " + error.response?.data?.message || "Ocorreu um erro inesperado.");
            }
            
        });
    }

    return (
        <li key={ritual.id} className="mb-2">
            <div className="flex gap-2 justify-between w-full border rounded-md">
                <div className="p-4  bg-vaccineGray-50">
                    <h3 className="text-xl font-semibold text-vaccinePurple">{ritual.name} <span className="text-vaccineGray-400"> (poder {ritual.power_level})</span> - {subclass?.subclass.name || 'Neutro'}</h3>
                    <p className="text-vaccineGray-400">{ritual.description}</p>
                    <p className="text-vaccineGray-400">Custo de Ocultismo: {ritual.ocultism_cost}</p>
                </div>
                {isAdmin && (
                    <div className="flex justify-end">
                        <div className="flex flex-col gap-2 justify-center items-center p-4">
                            {!ritual.hidden ? (
                                <button disabled={isTogglingRitual} onClick={() => onToggleRitual(ritual.id)} className={`${ isTogglingRitual ? 'bg-vaccineGray-400' : 'bg-vaccinePurple' } px-4 py-2 text-white rounded-md hover:bg-vaccinePurple/80 transition`}>
                                    <LucideEye className="w-4 h-4" />
                                </button>
                            ) : (
                                <button disabled={isTogglingRitual} onClick={() => onToggleRitual(ritual.id)} className={`${ isTogglingRitual ? 'bg-vaccineGray-400' : 'bg-vaccinePurple' } px-4 py-2 text-white rounded-md hover:bg-vaccinePurple/80 transition`}>
                                    <LucideEyeOff className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-center p-4">
                            <button disabled={isDeleting} onClick={() => onDelete(ritual.id)} className={`${ isDeleting ? 'bg-vaccineGray-400' : 'bg-vaccinePurple' } px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition`}><LucideDelete className="w-4 h-4" /></button>
                        </div>
                    </div>
                
                )}
            </div>
        </li>
    );
}