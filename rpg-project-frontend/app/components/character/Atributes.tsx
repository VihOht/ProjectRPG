import { useState } from "react";
import type { characterAttribute, characterAttributes } from "../../types";
import { FiEdit } from "react-icons/fi";

interface characterAttributesProps {
    atributes: characterAttributes;
    handleAttributeChange: (index: number, field: string, value: number) => void;
}

export function CharacterAttributes({
    atributes,
    handleAttributeChange
}: characterAttributesProps) {
    const [isEditing, setIsEditing] = useState(false); 

    function handleChange(index: number, field: string, value: number) {
        if (isEditing) {
            handleAttributeChange(index, field, value);
        }
    }

    return (
    <section className="mb-8">
                <div className="itens-center flex justify-between mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-vaccineRed">
                        Atributos
                    </h2>
                    <button onClick={() => setIsEditing(!isEditing)} className="mb-4 px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors">
                        {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-vaccineGray text-vaccineBlack">
                                <th className="border bg-vaccineGray-300 color-black border-gray-300 px-4 py-2 text-left">
                                    Atributo
                                </th>
                                <th className="border bg-vaccineGray-300 border-gray-300 px-4 py-2 text-center">
                                    Base
                                </th>
                                <th className="border bg-vaccineGray-300 border-gray-300 px-4 py-2 text-center">
                                    Bônus
                                </th>
                                <th className="border bg-vaccineGray-300 border-gray-300 px-4 py-2 text-center">
                                    Total
                                </th>
                                <th className="border bg-vaccineGray-300 border-gray-300 px-4 py-2 text-center">
                                    DT
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {atributes.map((atributo, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border bg-vaccineGray-300 border-gray-300 px-4 py-2 font-medium">
                                        {atributo.nome}
                                    </td>
                                    <td className="border bg-vaccineGray-300 border-gray-300 px-2 py-2">
                                        <input
                                            type="number"
                                            value={atributo.base}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "base",
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            readOnly={!isEditing}
                                            className={`w-full px-2 py-1 text-center ${isEditing ? 'border-gray-400 border' : ''} rounded focus:outline-none focus:ring-1 focus:ring-vaccineRed`}
                                        />
                                    </td>
                                    <td className="border bg-vaccineGray-300 border-gray-300 px-2 py-2">
                                        <input
                                            type="number"
                                            value={atributo.bonus}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "bonus",
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            readOnly={!isEditing}
                                            className={`w-full px-2 py-1 text-center ${isEditing ? 'border-gray-400 border' : ''} rounded focus:outline-none focus:ring-1 focus:ring-vaccineRed`}
                                        />
                                    </td>
                                    <td className="border bg-vaccineGray-300 border-gray-300 px-2 py-2">
                                        <input
                                            type="number"
                                            value={atributo.total}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "total",
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            readOnly={!isEditing}
                                            className={`w-full px-2 py-1 text-center ${isEditing ? 'border-gray-400 border' : ''} rounded focus:outline-none focus:ring-1 focus:ring-vaccineRed`}
                                        />
                                    </td>
                                    <td className="border bg-vaccineGray-300 border-gray-300 px-2 py-2">
                                        <input
                                            type="number"
                                            value={atributo.dt}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "dt",
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            readOnly={!isEditing}
                                            className={`w-full px-2 py-1 text-center ${isEditing ? 'border-gray-400 border' : ''} rounded focus:outline-none focus:ring-1 focus:ring-vaccineRed`}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
    )
}