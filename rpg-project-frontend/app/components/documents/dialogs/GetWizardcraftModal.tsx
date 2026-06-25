import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { useWizardcrafts, useDeleteWizardcraft, useToggleWizardcraftVisibility } from "../../../hooks";
import { useAuthProvider } from "../../../providers";
import { LucideDelete, LucideEye, LucideEyeOff } from "lucide-react";
import type { WizardcraftItem } from "../../../types";
import { toast } from "react-hot-toast";
import CreateWizardcraftModal from "./CreateWizardcraftModal";


export default function GetWizardcraftModal() {
    const [open, setOpen] =
        useState(false);

    const {data: wizardcrafts, isLoading, refetch} = useWizardcrafts();
    const { user } = useAuthProvider();

    const { mutate: deleteWizardcraft, isPending: isDeletingWizardcraft } = useDeleteWizardcraft();

    const onDeleteWizardcraft = (id: number) => {
        if (!confirm("Tem certeza que deseja deletar este feitiço?") || !confirm("Esta ação não pode ser desfeita.")) {
            return;
        }
        deleteWizardcraft(id, {
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
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                Feitiços
            </button>
            <AppModal
                open={open}
                title="Feitiços"
                onClose={() => setOpen(false)}
            >   
                { wizardcrafts && wizardcrafts.wizardcrafts.length > 0 ? (
                    <div className="overflow-y-auto w-full h-[80vh]">
                        {isAdmin && (
                            <div className="flex justify-end mb-4 w-full">
                                <CreateWizardcraftModal />
                            </div>
                        )}
                        <ul className="list-disc w-full overflow-y-auto">
                            {wizardcrafts.wizardcrafts.map((wizardcraft) => (
                                <WizardcraftItem key={wizardcraft.id} wizardcraft={wizardcraft} isAdmin={isAdmin} onDelete={onDeleteWizardcraft} isDeleting={isDeletingWizardcraft} />
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[80vh]">
                        {isAdmin && (
                            <div className="flex justify-end mb-4 w-full">
                                <CreateWizardcraftModal />
                            </div>
                        )}
                        <div className="flex flex-col items-center justify-center gap-4">
                            {isLoading ? (
                                <p className="text-vaccineGray-400">Carregando Feitiços...</p>
                            ) : (
                                <p className="text-vaccineGray-400">Nenhum feitiço encontrado.</p>
                            )}
                        </div>
                    </div>
                )}
            </AppModal>
        </>
        
    );
}

const WizardcraftItem = ({ wizardcraft, isAdmin, onDelete, isDeleting }: { wizardcraft: WizardcraftItem, isAdmin: boolean, onDelete: (id: number) => void, isDeleting: boolean }) => {

    const { mutate: toggleWizardcraft, isPending: isTogglingWizardcraft } = useToggleWizardcraftVisibility();
    const { refetch: refetchWizardcrafts } = useWizardcrafts();


    const onToggleWizardcraft = (id: number) => {
        toggleWizardcraft(id, {
            onSuccess: () => {
                refetchWizardcrafts();
                toast.success("Visibilidade do feitiço alterada com sucesso!");
            },
            onError: (error) => {
                toast.error("Erro ao alterar visibilidade do feitiço: " + error.response?.data?.message || "Ocorreu um erro inesperado.");
            }       
        });
    }


    return (
        <li key={wizardcraft.id} className="mb-2">
            <div className="flex gap-2 justify-between w-full border rounded-md">
                <div className="p-4  bg-vaccineGray-50">

                    <h3 className="text-xl font-semibold text-vaccinePurple">{wizardcraft.name}</h3>
                    <p className="text-vaccineGray-400">{wizardcraft.description}</p>
                    <p className="text-vaccineGray-400">Custo de Mana: {wizardcraft.mana_cost}</p>
                </div>
                {isAdmin && (
                    <div className="flex justify-end">  
                        <div className="flex flex-col gap-2 justify-center items-center p-4">
                            {!wizardcraft.hidden ? (
                                <button disabled={isTogglingWizardcraft} onClick={() => onToggleWizardcraft(wizardcraft.id)} className={`${ isTogglingWizardcraft ? 'bg-vaccineGray-400' : 'bg-vaccinePurple' } px-4 py-2 text-white rounded-md hover:bg-vaccinePurple/80 transition`}>
                                    <LucideEye className="w-4 h-4" />
                                </button>
                            ) : (
                                <button disabled={isTogglingWizardcraft} onClick={() => onToggleWizardcraft(wizardcraft.id)} className={`${ isTogglingWizardcraft ? 'bg-vaccineGray-400' : 'bg-vaccinePurple' } px-4 py-2 text-white rounded-md hover:bg-vaccinePurple/80 transition`}>
                                    <LucideEyeOff className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-center p-4">
                            <button disabled={isDeleting} onClick={() => onDelete(wizardcraft.id)} className={`${ isDeleting ? 'bg-vaccineGray-400' : 'bg-vaccinePurple' } px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition`}><LucideDelete className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
}