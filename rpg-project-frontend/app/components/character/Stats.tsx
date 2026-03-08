import { useState } from "react";
import type { characterStats } from "../../types";
import { FiEdit } from "react-icons/fi";

type StatLimitView = {
    base: number;
    bonus: number;
    total: number;
};

interface characterStatsProps {
    charStats: characterStats;
    handleStatChange: (field: keyof characterStats, value: number) => void;
    update: () => void;
    statLimits: Record<keyof characterStats, StatLimitView>;
    className?: string;
    secondClassName?: string;
}

export function CharacterStats({
    charStats,
    handleStatChange,
    update,
    statLimits,
    className = "",
    secondClassName = "",
}: characterStatsProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Check if character is a Mage (show mana)
    const isMage = className.toLowerCase().includes("mage") || secondClassName.toLowerCase().includes("mage");
    
    // Check if character is a Witch (show ocultism)
    const isWitch = className.toLowerCase().includes("witch") || secondClassName.toLowerCase().includes("witch");

    function handleChange(field: keyof characterStats, value: number) {
        if (isEditing) {
            handleStatChange(field, value);
        }
    }

    return (
        <section className="mb-8">
                    <div className="itens-center flex justify-between mb-4">
                        <h2 className="text-2xl font-semibold mb-4 text-vaccineRed">
                            Estatísticas
                        </h2>
                        <button onClick={() => {setIsEditing(!isEditing); if (isEditing) {update()}}} className="mb-4 px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors">
                            {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vida
                            </label>
                            <input
                                type="number"
                                value={charStats.pv}
                                onChange={(e) => handleChange("pv", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                min={0}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                            />
                            <p className="mt-1 text-sm text-gray-600">{charStats.pv}/{statLimits.pv.total}</p>
                            <p className="text-xs text-gray-500">Base {statLimits.pv.base} + Bonus {statLimits.pv.bonus}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Defesa
                            </label>
                            <input
                                type="number"
                                value={charStats.defesa}
                                onChange={(e) => handleChange("defesa", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                min={0}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                            />
                            <p className="mt-1 text-sm text-gray-600">{charStats.defesa}/{statLimits.defesa.total}</p>
                            <p className="text-xs text-gray-500">Base {statLimits.defesa.base} + Bonus {statLimits.defesa.bonus}</p>
                        </div>
                        {isWitch && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ocultismo
                                </label>
                                <input
                                    type="number"
                                    value={charStats.ocult}
                                    onChange={(e) => handleChange("ocult", parseInt(e.target.value) || 0)}
                                    readOnly={!isEditing}
                                    min={0}
                                    className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                                />
                                <p className="mt-1 text-sm text-gray-600">{charStats.ocult}/{statLimits.ocult.total}</p>
                                <p className="text-xs text-gray-500">Base {statLimits.ocult.base} + Bonus {statLimits.ocult.bonus}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sanidade
                            </label>
                            <input
                                type="number"
                                value={charStats.san}
                                onChange={(e) => handleChange("san", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                min={0}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                            />
                            <p className="mt-1 text-sm text-gray-600">{charStats.san}/{statLimits.san.total}</p>
                            <p className="text-xs text-gray-500">Base {statLimits.san.base} + Bonus {statLimits.san.bonus}</p>
                        </div>
                        {isMage && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mana
                                </label>
                                <input
                                    type="number"
                                    value={charStats.mana}
                                    onChange={(e) => handleChange("mana", parseInt(e.target.value) || 0)}
                                    readOnly={!isEditing}
                                    min={0}
                                    className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                                />
                                <p className="mt-1 text-sm text-gray-600">{charStats.mana}/{statLimits.mana.total}</p>
                                <p className="text-xs text-gray-500">Base {statLimits.mana.base} + Bonus {statLimits.mana.bonus}</p>
                            </div>
                        )}
                    </div>
                </section>
    );
}