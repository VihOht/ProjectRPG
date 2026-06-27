import { useConversionRules, useLevelUpRules, useDeleteConversionRule, useDeleteLevelUpRule, useAttributes, usePericias } from "../../../hooks"
import { useEffect, useState } from "react";
import type { ConversionRuleItem, LevelUpRuleItem, AttributeItem, PericiaItem } from "../../../types";
import { useAuthProvider } from "../../../providers"
import ConversionRulesModal from "../dialogs/ConversionRulesModal";



export default function ConversionTab() {

    const { user } = useAuthProvider();

    const [isAdmin, setIsAdmin] = useState(false);

    const { data: conversionRulesData, refetch: refetchConversionRules } = useConversionRules();
    const { data: levelUpRulesData, refetch: refetchLevelUpRules } = useLevelUpRules();

    
    const { mutate: deleteConversionRule } = useDeleteConversionRule();
    const { mutate: deleteLevelUpRule } = useDeleteLevelUpRule();
    
    const { data: attributesData } = useAttributes();
    const { data: periciasData } = usePericias();
    const [conversionRules, setConversionRules] = useState<ConversionRuleItem[]>([]);
    const [levelUpRules, setLevelUpRules] = useState<LevelUpRuleItem[]>([]);
    const [attributes, setAttributes] = useState<AttributeItem[]>([]);
    const [pericias, setPericias] = useState<PericiaItem[]>([]);

    useEffect(() => {
        if (conversionRulesData) {
            setConversionRules(conversionRulesData.conversion_rules);
        }
    }, [conversionRulesData, refetchConversionRules]);

    useEffect(() => {
        if (levelUpRulesData) {
            setLevelUpRules(levelUpRulesData.level_up_rules.sort((a, b) => a.level - b.level));
        }
    }, [levelUpRulesData, refetchLevelUpRules]);

    useEffect(() => {
        if (attributesData) {
            setAttributes(attributesData.attributes);
        }
    }, [attributesData]);

    useEffect(() => {
        if (periciasData) {
            setPericias(periciasData.pericias);
        }
    }, [periciasData]);

    useEffect(() => {
        if (!user) return;
        setIsAdmin(user.role === "ADMIN");
    }, [user]);

    const ruleStatConvertor = (stat: string) => {
        switch (stat) {
            case "life":
                return "Vida";
            case "sanity":
                return "Sanidade";
            case "defense":
                return "Defesa";
            case "mana":
                return "Mana";
            case "ocultism":
                return "Ocultismo";
            case "power":
                return "Poder";
            default:
                return stat;
        }
    };
    
    if (!conversionRulesData || !levelUpRulesData || !periciasData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="w-full space-y-6 px-2">
            <div className="flex items-center justify-between mb-6 p-2">
                <h2 className="text-xl font-bold mb-4 text-vaccineGray-200 pr-2">Regras de Conversão</h2>
                {isAdmin && (
                    <ConversionRulesModal />
                )}
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-vaccineGray-300">Regras de Conversão de Atributos e Pericias</h3>

                {conversionRules.length === 0 ? (
                    <p className="text-vaccineGray-400">Nenhuma regra de conversão encontrada.</p>
                ) : (
                    <ul className="space-y-2">
                        {conversionRules.map((rule) => (
                            <li key={rule.id} className="bg-vaccineGray-800/20 p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <span className="text-sm text-vaccineGray-200">
                                        {ruleStatConvertor(rule.stat)} += {rule.rate} * {rule.conversion_type == "attribute" ? attributes.find((attr) => attr.id === rule.attribute_id)?.name || "Atributo não encontrado" : pericias.find((pericia) => pericia.id === rule.pericia_id)?.name || "Perícia não encontrada"} {rule.conversion_type == "attribute" ? "(Atributo)" : "(Perícia)"}
                                        </span>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => {if (confirm("Tem certeza que deseja excluir esta regra de conversão?")) {
                                            deleteConversionRule(rule.id);
                                            refetchConversionRules();
                                        }}}
                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                                    >
                                        Excluir
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2 text-vaccineGray-300">Regras de Level Up</h3>
                {levelUpRules.length === 0 ? (
                    <p className="text-vaccineGray-400">Nenhuma regra de level up encontrada.</p>
                ) : (
                    <ul className="space-y-2">
                        {levelUpRules.map((rule) => (
                            <li key={rule.id} className="bg-vaccineGray-800/20 p-4 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-vaccineGray-200">
                                        Nivel {rule.level}
                                    </p>
                                    <p className="text-sm text-vaccineGray-400">
                                        Experiência Necessária: {rule.experience_required}
                                    </p>
                                    <p className="text-sm text-vaccineGray-400">
                                        Descrição: {rule.description}
                                    </p>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => {if (confirm("Tem certeza que deseja excluir esta regra de level up?")) {
                                            deleteLevelUpRule(rule.id);
                                            refetchLevelUpRules();
                                        }}}
                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                                    >
                                        Excluir
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}