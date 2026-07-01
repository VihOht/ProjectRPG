import { useEffect, useState } from "react";
import type { UpdateCharacterOffsetsRequest, UpdateCharacterStatsRequest } from "../../types";
import { FiEdit } from "react-icons/fi";
import { useCharacter, useUpdateCharacterStats, useClass, useUpdateCharacterOffsets } from "../../hooks";
import { toast } from "react-hot-toast";
import { useAuthProvider } from "../../providers";
import { SheetSection } from "./SheetSection";

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
    const { user } = useAuthProvider();

    const is_admin = user?.role === "ADMIN"

    const { data: characterData } =
        useCharacter(characterId);

    const updateStats =
        useUpdateCharacterStats(characterId);

    const updateOffsets = useUpdateCharacterOffsets(characterId);

    const { data: classData, isLoading: isClassLoading } = useClass(characterData?.character.charClass || 0);

    const [stats, setStats] =
        useState<UpdateCharacterStatsRequest | null>(null);

    const [offset, setOffset] = useState<UpdateCharacterOffsetsRequest | null>(null);

    const [statLimits, setStatLimits] =
        useState<Record<keyof UpdateCharacterStatsRequest, StatLimitView> | null>(null);

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const {mutate: updateStatsMutate, error: updateStatsError } = updateStats;
    const {mutate: updateOffsetsMutate, error: updateOffsetsError } = updateOffsets;

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
                base: characterData.stat_limits.sanity.base,
                bonus: characterData.stat_limits.sanity.bonus,
                total: characterData.stat_limits.sanity.total_max,
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

            power: {
                base: characterData.stat_limits.power.base,
                bonus: characterData.stat_limits.power.bonus,
                total: characterData.stat_limits.power.total_max,
            },
            inventory_capacity: {
                base: characterData.stat_limits.inventory_capacity.base,
                bonus: characterData.stat_limits.inventory_capacity.bonus,
                total: characterData.stat_limits.inventory_capacity.total_max,
            },
            
        });

        setOffset({
            offset_life: characterData.character.offset_life,
            offset_sanity: characterData.character.offset_sanity,
            offset_mana: characterData.character.offset_mana,
            offset_ocultism: characterData.character.offset_ocultism,
            offset_power: characterData.character.offset_power,
            offset_defense: characterData.character.offset_defense,
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

    function handleChangeOffset(
        field: keyof UpdateCharacterOffsetsRequest,
        value: number
    ) {
        if (!isEditing) return;
        if (!stats || !statLimits) return;
        setOffset(prev => ({
            ...prev!,
            [field]: value,
        }));
    }

    function handleSave() {
        if (stats) {
            updateStatsMutate({
                life: stats.life,
                sanity: stats.sanity,
                mana: stats.mana,
                ocultism: stats.ocultism,
            });
        }

        if (is_admin && offset) {
            updateOffsetsMutate({
                offset_life: offset.offset_life,
                offset_sanity: offset.offset_sanity,
                offset_mana: offset.offset_mana,
                offset_ocultism: offset.offset_ocultism,
                offset_power: offset.offset_power,
                offset_defense: offset.offset_defense,
            });
        }

        setIsEditing(false);
    }

    useEffect(() => {
        if (updateStatsError) {
            // @ts-ignore
            toast.error(updateStatsError?.response?.data?.message || "Erro ao atualizar as estatísticas.");
        } 
    }, [updateStatsError]);

    useEffect(() => {
        if (updateOffsetsError) {
            toast.error(updateOffsetsError?.response?.data?.message || "Erro ao atualizar os offsets.");
        }
    }, [updateOffsetsError]);

    if (!stats || !statLimits || isClassLoading) {
    return (
        <div className="text-vaccineGray-200 mb-8 text-center">
            Carregando estatísticas...
        </div>
    );}

    if (!classData) {
        return (
            <div className="text-vaccineGray-200 mb-8 text-center">
                Classe do personagem não encontrada.
            </div>
        );
    }

    return (

        <SheetSection
            title="Estatísticas"
            actions={
                <button disabled={!open && !isEditing} onClick={() => {isEditing ? handleSave() : setIsEditing(true)}} className="mb-4 cursor-pointer px-4 py-2 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100">
                    {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                </button>
            }
            onOpenChange={(open) => setOpen(open)}
        >
            
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 `}>
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
                {classData.class.has_ocultism && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                Ocultismo
                            </label>
                            <input
                                type="string"
                                value={stats.ocultism}
                                onChange={(e) => handleChange("ocultism", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                className={`w-full bg-vaccineBlueTones-1000 text-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 `}
                            />
                            <p className="mt-1 text-sm text-gray-600">{stats.ocultism}/{statLimits.ocultism.total}</p>
                            <p className="text-xs text-gray-500">Base {statLimits.ocultism.base} + Bonus {statLimits.ocultism.bonus}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                Poder
                            </label>
                            <input
                                type="string"
                                value={statLimits.power.total}
                                readOnly={true}
                                className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                            />
                            <p className="text-xs text-gray-500 mt-2">Base {statLimits.power.base} + Bonus {statLimits.power.bonus}</p>
                        </div>
                    </>
                    
                )}
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
            {is_admin && (
                <div className="mt-4 bg-vaccineBlueTones-900/10 p-4 rounded-md">
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-vaccineGray-300 mb-2">Offsets</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                Offset Vida
                            </label>
                            <input
                                type="string"
                                value={offset?.offset_life || 0}
                                readOnly={!isEditing}
                                onChange={(e) => handleChangeOffset("offset_life", parseInt(e.target.value) || 0)}
                                className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                Offset Sanidade
                            </label>
                            <input
                                type="string"
                                value={offset?.offset_sanity || 0}
                                readOnly={!isEditing}
                                onChange={(e) => handleChangeOffset("offset_sanity", parseInt(e.target.value) || 0)}
                                className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                            />
                        </div>
                        {classData.class.has_ocultism && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                        Offset Ocultismo
                                    </label>
                                    <input
                                        type="string"
                                        value={offset?.offset_ocultism || 0}
                                        readOnly={!isEditing}
                                        onChange={(e) => handleChangeOffset("offset_ocultism", parseInt(e.target.value) || 0)}
                                        className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                        Offset Poder
                                    </label>
                                    <input
                                        type="string"
                                        value={offset?.offset_power || 0}
                                        readOnly={!isEditing}
                                        onChange={(e) => handleChangeOffset("offset_power", parseInt(e.target.value) || 0)}
                                        className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                                    />
                                </div> 
                            </>
                        )}
                        {classData.class.has_mana && (
                            <div>
                                <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                    Offset Mana
                                </label>
                                <input
                                    type="string"
                                    value={offset?.offset_mana || 0}
                                    readOnly={!isEditing}
                                    onChange={(e) => handleChangeOffset("offset_mana", parseInt(e.target.value) || 0)}
                                    className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-vaccineGray-300 mb-1">
                                Offset Defesa
                            </label>
                            <input
                                type="string"
                                value={offset?.offset_defense || 0}
                                readOnly={!isEditing}
                                onChange={(e) => handleChangeOffset("offset_defense", parseInt(e.target.value) || 0)}
                                className={`w-full bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-300`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </SheetSection>
    );
}