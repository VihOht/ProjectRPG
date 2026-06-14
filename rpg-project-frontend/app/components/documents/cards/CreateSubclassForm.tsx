
import { useState } from "react";
import { useClasses, useCreateSubclass } from "../../../hooks";
import type { CreateSubclassRequest} from '../../../types'

export interface CreateSubclassFormProps {
    onSucess: () => void;
}


export default function CreateSubclassForm({ onSucess }: CreateSubclassFormProps) {

    const [formData, setFormData] = useState<CreateSubclassRequest>({
        name: "",
        description: "",
        class_id: 0,
    });

    const { data: classesData, refetch } = useClasses();

    const { mutate: createSubclass, isPending } = useCreateSubclass();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? Number(value) : value,
        }));
    }





    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Criar nova Subclasse</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                        Nome da Subclasse
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
                        Descrição da Subclasse
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
                        Classe Pai
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
                <button
                    type="button"
                    onClick={() => { createSubclass(formData, { onSuccess: onSucess }), refetch() }}
                    disabled={isPending}
                    className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Creating..." : "Create Subclass"}
                </button>
            </form>
        </div>
    );
}