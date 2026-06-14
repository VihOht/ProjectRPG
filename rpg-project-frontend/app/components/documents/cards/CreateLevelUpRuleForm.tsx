
import { useEffect, useState } from "react";
import { useCreateLevelUpRule, useLevelUpRules } from "../../../hooks";
import type { CreateLevelUpRuleRequest } from '../../../types'
import toast from "react-hot-toast";

export interface CreateLevelUpRuleFormProps {
    onSucess: () => void;
}


export default function CreateLevelUpRuleForm({ onSucess }: CreateLevelUpRuleFormProps) {

    const [formData, setFormData] = useState<CreateLevelUpRuleRequest>({
        "level": 1,
        "description": "",
        "experience_required": 0,
    });

  
    const { refetch } = useLevelUpRules();
    const { mutate: createLevelUpRule, isPending } = useCreateLevelUpRule();

    

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? type === "decimal" ? parseFloat(value) : Number(value) : value,
        }));
    }


    const handleCreateLevelUpRule = () => {
        createLevelUpRule(formData, {
            onSuccess: () => {
                toast.success("Level up rule created successfully!");
                onSucess();
                refetch();
            },
            onError: (error) => {
                toast.error("Failed to create level up rule: " + (error.response?.data?.message || "Please try again."));
            },
        });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Criar nova Regra de Conversão</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                        Nível do Level Up
                    </label>
                    <input
                        type="number"
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        placeholder="Ex: 2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="classDescription" className="block text-sm font-medium text-gray-300 mb-1">
                        Experiência Necessária                 </label>
                    <input
                        type="number"
                        id="experience_required"
                        name="experience_required"
                        value={formData.experience_required}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        placeholder="Ex: 1000"
                    />
                </div>
                <div>
                    <label htmlFor="subclassId" className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição do Level Up
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        placeholder="Ex: Ao atingir este nível, o personagem ganha 1 ponto de atributo para distribuir como desejar."
                    />
                </div>
                <button
                    type="button"
                    onClick={handleCreateLevelUpRule}
                    disabled={isPending}
                    className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Criando..." : "Criar Regra de Level Up"}
                </button>
            </form>
        </div>
    );
}