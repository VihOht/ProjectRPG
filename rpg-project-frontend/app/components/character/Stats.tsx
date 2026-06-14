import { useEffect, useState } from "react";
import type { UpdateCharacterStatsRequest } from "../../types";
import { FiEdit } from "react-icons/fi";
import { useCharacter, useUpdateCharacterStats, useClass } from "../../hooks";
import { toast } from "react-hot-toast";

type StatLimitView = {
    base: number;
    bonus: number;
    total: number;
};

interface characterStatsProps {
    characterId: number;
}

export function CharacterStats({
    characterId,
}: characterStatsProps) {
    const { data: characterData } =
        useCharacter(characterId);

    const updateStats =
        useUpdateCharacterStats(characterId);

    const { data: classData, isLoading: isClassLoading } = useClass(characterData?.character.charClass || 0);

    const [stats, setStats] =
        useState<UpdateCharacterStatsRequest | null>(null);

    const [statLimits, setStatLimits] =
        useState<Record<keyof UpdateCharacterStatsRequest, StatLimitView> | null>(null);

    const [isEditing, setIsEditing] = useState(false);

    const {mutate: updateStatsMutate, error: updateStatsError } = updateStats;

    useEffect(() => {
        if (!characterData) return;

        setStats({
            life: characterData.character.life,
            sanity: characterData.character.sanity,
            mana: characterData.character.mana,
            ocultism: characterData.character.ocultism,
        });

        setStatLimits({
            life: {
                base: characterData.stat_limits.life.base,
                bonus: characterData.stat_limits.life.bonus,
                total: characterData.stat_limits.life.total_max,
            },

            sanity: {
                base: characterData.stat_limits.defense.base,
                bonus: characterData.stat_limits.defense.bonus,
                total: characterData.stat_limits.defense.total_max,
            },

            defense: {
                base: characterData.stat_limits.defense.base,
                bonus: characterData.stat_limits.defense.bonus,
                total: characterData.stat_limits.defense.total_max,
            },

            mana: {
                base: characterData.stat_limits.mana.base,
                bonus: characterData.stat_limits.mana.bonus,
                total: characterData.stat_limits.mana.total_max,
            },

            ocultism: {
                base: characterData.stat_limits.ocultism.base,
                bonus: characterData.stat_limits.ocultism.bonus,
                total: characterData.stat_limits.ocultism.total_max,
            },
        });
    }, [characterData]);

    function handleChange(
        field: keyof UpdateCharacterStatsRequest,
        value: number
    ) {
        if (!isEditing) return;
        if (!stats || !statLimits) return;
        setStats(prev => ({
            ...prev!,
            [field]: (value >= 0 && value <= statLimits?.[field]?.total ? value : value > statLimits?.[field]?.total ? statLimits?.[field]?.total : prev?.[field] || 0),
        }));
    }

    function handleSave() {
        if (!stats) return;

        updateStatsMutate({
            life: stats.life,
            sanity: stats.sanity,
            mana: stats.mana,
            ocultism: stats.ocultism,
        });

        setIsEditing(false);
    }

    useEffect(() => {
        if (updateStatsError) {
            toast.error(updateStatsError?.response?.data?.message || "Erro ao atualizar as estatísticas.");
        } 
    }, [updateStatsError]);

    if (!stats || !statLimits || isClassLoading) {
    return (
        <div className="text-vaccineGray-200">
            Carregando estatísticas...
        </div>
    );}

    if (!classData) {
        return (
            <div className="text-vaccineGray-200">
                Classe do personagem não encontrada.
            </div>
        );
    }

    return (
        <section className="mb-8">
                    <div className="itens-center flex justify-between mb-4">
                        <h2 className="text-3xl font-walthari font-semibold mb-4 text-vaccineGray-300">
                            Estatísticas
                        </h2>
                        <button onClick={() => {isEditing ? handleSave() : setIsEditing(true)}} className="mb-4 px-4 py-2 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100">
                            {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                Vida
                            </label>
                            <input
                                type="string"
                                value={stats.life}
                                onChange={(e) => handleChange("life", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                            />
                            <p className="mt-1 text-sm text-gray-600">{stats.life}/{statLimits.life.total}</p>
                            <p className="text-xs text-gray-500">Base {statLimits.life.base} + Bonus {statLimits.life.bonus}</p>
                        </div>
                        {classData.class.has_ocultism && (
                            <div>
                                <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                    Ocultismo
                                </label>
                                <input
                                    type="string"
                                    value={stats.ocultism}
                                    onChange={(e) => handleChange("ocultism", parseInt(e.target.value) || 0)}
                                    readOnly={!isEditing}
                                    className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 `}
                                />
                                <p className="mt-1 text-sm text-gray-600">{stats.ocultism}/{statLimits.ocultism.total}</p>
                                <p className="text-xs text-gray-500">Base {statLimits.ocultism.base} + Bonus {statLimits.ocultism.bonus}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                Sanidade
                            </label>
                            <input
                                type="string"
                                value={stats.sanity}
                                onChange={(e) => handleChange("sanity", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}                            
                                className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                            />
                            <p className="mt-1 text-sm text-gray-600">{stats.sanity}/{statLimits.sanity.total}</p>
                            <p className="text-xs text-gray-500">Base {statLimits.sanity.base} + Bonus {statLimits.sanity.bonus}</p>
                        </div>
                        {classData.class.has_mana && (
                            <div>
                                <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                    Mana
                                </label>
                                <input
                                    type="string"
                                    value={stats.mana}
                                    onChange={(e) => handleChange("mana", parseInt(e.target.value) || 0)}
                                    readOnly={!isEditing}
                                    className={`w-full bg-vaccineBlueTones-1000 text-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100`}
                                />
                                <p className="mt-1 text-sm text-gray-600">{stats.mana}/{statLimits.mana.total}</p>
                                <p className="text-xs text-gray-500">Base {statLimits.mana.base} + Bonus {statLimits.mana.bonus}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                Defesa
                            </label>
                            <input
                                type="string"
                                value={statLimits.defense.total}
                                readOnly={true}
                                className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                            />
                            <p className="text-xs text-gray-500 mt-2">Base {statLimits.defense.base} + Bonus {statLimits.defense.bonus}</p>
                        </div>
                    </div>
                </section>
    );
}