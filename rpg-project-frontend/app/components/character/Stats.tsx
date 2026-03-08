import { useState } from "react";
import type { characterStats } from "../../types";
import { FiEdit } from "react-icons/fi";

interface characterStatsProps {
    charStats: characterStats;
    handleStatChange: (field: keyof characterStats, value: number) => void;
    update: () => void;
}

export function CharacterStats({
    charStats,
    handleStatChange,
    update
}: characterStatsProps) {
    const [isEditing, setIsEditing] = useState(false);

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
                                PV
                            </label>
                            <input
                                type="number"
                                value={charStats.pv}
                                onChange={(e) => handleChange("pv", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                            />
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
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ocult
                            </label>
                            <input
                                type="number"
                                value={charStats.ocult}
                                onChange={(e) => handleChange("ocult", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                San
                            </label>
                            <input
                                type="number"
                                value={charStats.san}
                                onChange={(e) => handleChange("san", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mana
                            </label>
                            <input
                                type="number"
                                value={charStats.mana}
                                onChange={(e) => handleChange("mana", parseInt(e.target.value) || 0)}
                                readOnly={!isEditing}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                            />
                        </div>
                    </div>
                </section>
    );
}