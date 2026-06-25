import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { LucidePlus } from "lucide-react";
import type {  CreateWizardcraftRequest } from "../../../types"
import {  useCreateWizardcraft } from "../../../hooks";
import { toast } from "react-hot-toast";


export default function CreateWizardcraftModal() {
    const [open, setOpen] =
        useState(false);

    const { mutate: createWizardcraft, isPending: isCreatingWizardcraft } = useCreateWizardcraft();
    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        mana_cost: 0,
    } as CreateWizardcraftRequest);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "name" || name === "description" ? value : Number(value),
        }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createWizardcraft(formData, {
            onSuccess: () => {
                setOpen(false);
                setFormData({
                    name: "",
                    description: "",
                    mana_cost: 0,   
                });
            },
            onError: (error) => {
                toast.error("Erro ao criar feitiço: " + error.response?.data?.message || "Ocorreu um erro inesperado.");
            }
        });
    }

    return (
        <>  
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                <LucidePlus className="w-4 h-4 mr-2 inline-block" />Feitiço
            </button>
            <AppModal
                open={open}
                title="Criar Feitiços"
                onClose={() => setOpen(false)}
                resize={true}
            >
                <form className="flex flex-col gap-4 text-vaccineGray-500" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">Nome do Feitiço</label>
                        <input value={formData.name} onChange={handleInputChange} type="text" id="name" name="name" className="p-2 border rounded-md bg-vaccineGray-50 text-vaccineGray-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">Descrição</label>
                        <textarea value={formData.description} onChange={handleInputChange} id="description" name="description" className="p-2 border rounded-md bg-vaccineGray-50 text-vaccineGray-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="mana_cost">Custo de Mana</label>
                        <input value={formData.mana_cost} onChange={handleInputChange} type="number" id="mana_cost" name="mana_cost" className="p-2 border rounded-md bg-vaccineGray-50 text-vaccineGray-500" />
                    </div>
                    <button disabled={isCreatingWizardcraft} type="submit" className={`${ isCreatingWizardcraft ? 'bg-vaccineGray-400' : 'bg-vaccinePurple' } px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition`}>Criar Feitiço</button>
                </form>
            </AppModal>
        </>
        
    );
}