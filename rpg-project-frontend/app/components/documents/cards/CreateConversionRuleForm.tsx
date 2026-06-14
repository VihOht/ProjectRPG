
import { useEffect, useState } from "react";
import { usePericias, useAttributes, useCreateConversionRule, useConversionRules } from "../../../hooks";
import type { CreateConversionRuleRequest, AttributeItem, PericiaItem, SubclassItem } from '../../../types'
import toast from "react-hot-toast";

export interface CreateConversionRuleFormProps {
    onSucess: () => void;
}


export default function CreateConversionRuleForm({ onSucess }: CreateConversionRuleFormProps) {

    const [formData, setFormData] = useState<CreateConversionRuleRequest>({
        conversion_type: "attribute",
        target_id: -1,
        stat: "life",
        rate: 0,
    });

    const { data: attributesData } = useAttributes();
    const { data: periciasData } = usePericias();

    const { refetch } = useConversionRules();
    const { mutate: createConversionRule, isPending } = useCreateConversionRule();

    

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" && value === "") ? '0' : (type === "number" && value !== "") ? type === "decimal" ? parseFloat(value) : Number(value) : value,
        }));
    }


    const handleCreateConversionRule = () => {
        if (!formData.target_id) {
            toast.error("Please select a target for the conversion rule.");
            return;
        }
        createConversionRule(formData, {
            onSuccess: () => {
                toast.success("Conversion rule created successfully!");
                onSucess();
                refetch();
            },
            onError: (error) => {
                toast.error("Failed to create conversion rule: " + (error.response?.data?.message || "Please try again."));
            },
        });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-vaccineGray-200">Criar nova Regra de Conversão</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="className" className="block text-sm font-medium text-gray-300 mb-1">
                        Tipo de Conversão
                    </label>
                    <select
                        id="conversion_type"
                        name="conversion_type"
                        value={formData.conversion_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                    >
                        <option value="attribute">Conversão de Atributo</option>
                        <option value="pericia">Conversão de Perícia</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="classDescription" className="block text-sm font-medium text-gray-300 mb-1">
                        Escolha o alvo da regra de conversão                    </label>
                    <select
                        id="target_id"
                        name="target_id"
                        value={formData.target_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                    >
                        <option value="">Selecione um alvo</option>
                        {formData.conversion_type === "attribute" && attributesData?.attributes.map((attr: AttributeItem) => (
                            <option key={attr.id} value={attr.id}>
                                {attr.name}
                            </option>
                        ))}
                        {formData.conversion_type === "pericia" && periciasData?.pericias.map((pericia: PericiaItem) => (
                            <option key={pericia.id} value={pericia.id}>
                                {pericia.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="subclassId" className="block text-sm font-medium text-gray-300 mb-1">
                        Taxa de Conversão
                    </label>
                    <input
                        type="decimal"
                        id="conversion_rate"
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
                        placeholder="Ex: 1.5"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleCreateConversionRule}
                    disabled={isPending}
                    className="px-4 py-2 mt-4 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Criando..." : "Criar Regra de Conversão"}
                </button>
            </form>
        </div>
    );
}