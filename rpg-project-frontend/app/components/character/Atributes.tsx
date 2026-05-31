import { useState } from "react";
import type { CharacterAttributeItem, CharacterPericiaItem } from "../../types";
import { FiEdit } from "react-icons/fi";

interface CharacterAttributesProps {
    attributes: CharacterAttributeItem[];
    pericias: CharacterPericiaItem[];
    onAttributeChange: (attributeId: number, field: string, value: number) => void;
    onPericiaChange: (periciaId: number, field: string, value: number) => void;
    onUpdate: () => void;
}

export function CharacterAttributes({
    attributes,
    pericias,
    onAttributeChange,
    onPericiaChange,
    onUpdate,
}: CharacterAttributesProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Group pericias by attribute_id
    const periciasByAttribute: Record<number, CharacterPericiaItem[]> = {};
    pericias.forEach((pericia) => {
        if (!periciasByAttribute[pericia.attribute_id]) {
            periciasByAttribute[pericia.attribute_id] = [];
        }
        periciasByAttribute[pericia.attribute_id].push(pericia);
    });

    function handleAttributeChange(attributeId: number, field: string, value: number) {
        if (isEditing) {
            onAttributeChange(attributeId, field, value);
        }
    }

    function handlePericiaChange(periciaId: number, field: string, value: number) {
        if (isEditing) {
            onPericiaChange(periciaId, field, value);
        }
    }

    return (
        <section className="mb-8">
            <div className="items-center flex justify-between mb-4">
                <h2 className="text-3xl font-walthari font-semibold mb-4 text-vaccineGray-300">
                    Atributos e Perícias
                </h2>
                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        if (isEditing) {
                            onUpdate();
                        }
                    }}
                    className="mb-4 px-4 py-2 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100"
                >
                    {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-vaccineGray text-vaccineGray-200">
                            <th className="border font-trajanPBold bg-vaccineBlueTones-1000/70 color-black border-vaccineGray-300 px-4 py-2 text-left">
                                Atributo
                            </th>
                            <th className="border font-trajanPBold bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-center">
                                Base
                            </th>
                            <th className="border font-trajanPBold bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-center">
                                Total
                            </th>
                            <th className="border font-trajanPBold bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-left">
                                Perícia
                            </th>
                            <th className="border font-trajanPBold bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-center">
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {attributes.map((attribute) => {
                            const attributePericias = periciasByAttribute[attribute.attribute_id] || [];
                            const hasNoPericias = attributePericias.length === 0;

                            return (
                                
                                <tr>
                                    <td className="border font-trajanPBold bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 font-medium text-vaccineGray-200">
                                        {attribute.name}
                                    </td>
                                    <td className="border bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-2 py-2 text-vaccineGray-400">
                                        <input
                                            type="number"
                                            value={attribute.base}
                                            onChange={(e) =>
                                                handleAttributeChange(
                                                    attribute.attribute_id,
                                                    "base",
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            readOnly={!isEditing}
                                            className={`w-full px-2 py-1 text-center ${
                                                isEditing ? "border-gray-400 border" : ""
                                            } rounded focus:outline-none focus:ring-1 focus:ring-vaccineRed`}
                                        />
                                    </td>
                                    <td className="border bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-2 py-2 ">
                                        <input
                                            type="number"
                                            value={attribute.total}
                                            readOnly={true}
                                            className="w-full px-2 py-1 text-center font-bold rounded focus:outline-none bg-gray-300 "
                                        />
                                    </td>
                                    {/* Pericia header cell */}
                                    {hasNoPericias ? (
                                        <td className="border bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-center text-vaccineGray-400" colSpan={2}>
                                            Sem perícias
                                        </td>
                                    ) : (
                                        <>
                                        <td className="border font-trajanPRegular bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-left text-vaccineGray-400">
                                            {attributePericias.map((pericia) => (
                                                <div key={pericia.pericia_id} className="mb-2">
                                                    {pericia.name}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border font-trajanPRegular bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-left text-vaccineGray-400">
                                            {attributePericias.map((pericia) => (
                                                <input
                                                    key={pericia.pericia_id}
                                                    type="number"
                                                    value={pericia.total}
                                                    onChange={(e) =>
                                                        handlePericiaChange(
                                                            pericia.pericia_id,
                                                            "value",
                                                            parseInt(e.target.value) || 0
                                                        )
                                                    }
                                                    readOnly={!isEditing}
                                                    className={`w-full px-2 py-1 text-center ${
                                                        isEditing ? "border-gray-400 border" : ""
                                                    } rounded focus:outline-none focus:ring-1 focus:ring-vaccineRed`}
                                                />
                                            ))}
                                        </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}