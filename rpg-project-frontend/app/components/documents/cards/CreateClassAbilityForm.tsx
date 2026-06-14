
import { useEffect, useState } from "react";
import { useClasses, useCreateAbility } from "../../../hooks";
import type { CreateAbilityRequest, SubclassItem } from '../../../types'
import toast from "react-hot-toast";

export interface CreateClassAbilityFormProps {
    onSucess: () => void;
}


export default function CreateClassAbilityForm({ onSucess }: CreateClassAbilityFormProps) {

    const [formData, setFormData] = useState<CreateAbilityRequest>({
        name: "",
        description: "",
        class_id: undefined,
        subclass_id: undefined,
    });

    const { data: classesData, refetch } = useClasses();
    

    const [filteredSubclasses, setFilteredSubclasses] = useState<SubclassItem[]>([]);

    const { mutate: createAbility, isPending } = useCreateAbility();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }

    useEffect(() => {
        if (formData.class_id && classesData) {
            const selectedClass = classesData.classes.find((cls) => cls.id === Number(formData.class_id));
            if (selectedClass) {
                setFilteredSubclasses(selectedClass.subclasses || []);
            }
        }
    }, [formData.class_id, classesData]);

    const handleCreateAbility = () => {
        if (!formData.class_id) {
            toast.error("Please select a class for the ability.");
            return;
        }
        createAbility(formData, {
            onSuccess: () => {
                toast.success("Ability created successfully!");
                onSucess();
                refetch();
            },
            onError: () => {
                toast.error("Failed to create ability. Please try again.");
            },
        });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Criar nova Abilidade de Classe</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                        Nome da Abilidade de Classe
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
                        Descrição da Abilidade de Classe
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
                <div className="mb-4">
                    <label htmlFor="classId" className="block text-sm font-medium text-gray-300 mb-1">
                        Classe
                    </label>
                    <select
                        id="classId"
                        name="class_id"
                        value={formData.class_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                    >
                        <option value="">Selecione uma classe</option>
                        {classesData?.classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="subclassId" className="block text-sm font-medium text-gray-300 mb-1">
                        Subclasse (opcional)
                    </label>
                    <select
                        id="subclassId"
                        name="subclass_id"
                        value={formData.subclass_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                    >
                        <option value="">Selecione uma subclasse</option>
                        {filteredSubclasses.map((subcls) => (
                            <option key={subcls.id} value={subcls.id}>
                                {subcls.name}
                            </option>
                        ))}
                    </select>

                </div>
                <button
                    type="button"
                    onClick={handleCreateAbility}
                    disabled={isPending}
                    className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Creating..." : "Create Ability"}
                </button>
            </form>
        </div>
    );
}