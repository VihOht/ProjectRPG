import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { LucidePlus } from "lucide-react";
import type { CreateRitualRequest } from "../../../types"
import { useSubclasses, useClasses } from "../../../hooks";
import { useCreateRitual } from "../../../hooks/useRituals";
import { toast } from "react-hot-toast";


export default function CreateRitualModal() {
    const [open, setOpen] =
        useState(false);

    const { data: subclasses } = useSubclasses();
    const { data: classes } = useClasses();
    const { mutate: createRitual, isPending: isCreatingRitual } = useCreateRitual();
    
    const filteredSubclasses = subclasses?.subclasses.filter((subclass) => classes?.classes.some((charClass) => charClass.id === subclass.class_id && charClass.has_ocultism));

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        power_level: 0,
        ocultism_cost: 0,
        subclass_id: null,
    } as CreateRitualRequest);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "power_level" || name === "ocultism_cost" || name === "subclass_id" ? Number(value) : value,
        }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createRitual(formData, {
            onSuccess: () => {
                setOpen(false);
                setFormData({
                    name: "",
                    description: "",
                    power_level: 0,
                    ocultism_cost: 0,
                    subclass_id: null,
                });
            },
            onError: (error) => {
                toast.error("Erro ao criar ritual: " + error.response?.data?.message || "Ocorreu um erro inesperado.");
            }
        });
    }

    return (
        <>  
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                <LucidePlus className="w-4 h-4 mr-2 inline-block" />Ritual
            </button>
            <AppModal
                open={open}
                title="Criar Rituais"
                onClose={() => setOpen(false)}
                resize={true}
            >
                <form className="flex flex-col gap-4 text-vaccineGray-500" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ritualName">Nome do Ritual</label>
                        <input value={formData.name} onChange={handleInputChange} type="text" id="ritualName" name="name" className="p-2 border rounded-md bg-vaccineGray-50 text-vaccineGray-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ritualDescription">Descrição</label>
                        <textarea value={formData.description} onChange={handleInputChange} id="ritualDescription" name="description" className="p-2 border rounded-md bg-vaccineGray-50 text-vaccineGray-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ritualPowerLevel">Nível de Poder</label>
                        <input value={formData.power_level} onChange={handleInputChange} type="number" id="ritualPowerLevel" name="power_level" className="p-2 border rounded-md bg-vaccineGray-50 text-vaccineGray-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ritualOcultismCost">Custo de Ocultismo</label>
                        <input value={formData.ocultism_cost} onChange={handleInputChange} type="number" id="ritualOcultismCost" name="ocultism_cost" className="p-2 border rounded-md bg-vaccineGray-50 text-vaccineGray-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ritualSubclass">Subclasse</label>
                        <select value={undefined} onChange={handleInputChange} id="ritualSubclass" name="subclass_id" className="p-2 border rounded-md bg-vaccineGray-50 text-vaccineGray-500">
                            <option value={0}>Selecione uma subclasse</option>
                            {filteredSubclasses?.map((subclass) => (
                                <option key={subclass.id} value={subclass.id}>{subclass.name}</option>
                            ))}
                        </select>
                    </div>
                    <button disabled={isCreatingRitual} type="submit" className={`${ isCreatingRitual ? 'bg-vaccineGray-400' : 'bg-vaccinePurple' } px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition`}>Criar Ritual</button>
                </form>
            </AppModal>
        </>
        
    );
}