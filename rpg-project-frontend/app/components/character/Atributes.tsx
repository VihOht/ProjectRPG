import { useEffect, useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";

import {
    useCharacterAttributes,
    useUpdateCharacterPericias,
} from "../../hooks";

import type {
    CharacterAttributeItem
} from "../../types";

interface CharacterAttributesProps {
    characterId: number;
}

export function CharacterAttributes({
    characterId,
}: CharacterAttributesProps) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, isLoading } = useCharacterAttributes(characterId);

    const updatePericias = useUpdateCharacterPericias(characterId); 

    const [attributes, setAttributes] = useState<CharacterAttributeItem[]>([]);

    useEffect(() => {
        if (data?.attributes) {
            setAttributes(data.attributes);
        }
    }, [data]);

    const allPericias = useMemo(() => {
        return attributes.flatMap(attr => attr.pericias);
    }, [attributes]);

    function handlePericiaChange(periciaId: number, value: number) {
        setAttributes((current) =>
            current.map((attr) => ({
                ...attr,
                pericias: attr.pericias.map((pericia) =>
                    pericia.pericia_id === periciaId
                        ? { 
                            ...pericia,
                            value 
                        }
                        : pericia
                ),
            }))
        );

        // update attr total
        setAttributes((current) =>
            current.map((attr) => ({
                ...attr,
                value: attr.pericias.reduce((sum, pericia) => sum + pericia.value, 0),
            }))
        );
    }

    function handleSave() {
        updatePericias.mutate({
            pericias: allPericias.map(pericia => ({
                pericia_id: pericia.pericia_id,
                value: pericia.value,
            })),
        });

        setIsEditing(false);
    }

    if (isLoading) {
        return (
            <div className="text-vaccineGray-200">
                Carregando atributos...
            </div>
        );
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
                            handleSave();
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
                            const pericias = attribute.pericias || [];
                            return (
                                <tr key={attribute.attribute_id}>
                                    <td className="border font-trajanPBold bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 font-medium text-vaccineGray-200">
                                        {attribute.name}
                                    </td>

                                    <td className="border bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-2 py-2 ">
                                        <div className={`w-full px-2 py-1 text-white text-center ${isEditing ? "border-gray-400 border" : ""} rounded focus:outline-none focus:ring-1 focus:ring-vaccinePurple`}>
                                            {attribute.value}
                                        </div>
                                    </td>
                                    {/* Pericia header cell */}
                                    {pericias.length === 0 ? (
                                        <td className="border bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-center text-vaccineGray-400" colSpan={2}>
                                            Sem perícias
                                        </td>
                                    ) : (
                                        <>
                                        <td className="border font-trajanPRegular text-white bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-left text-vaccineGray-400">
                                            {pericias.map((pericia) => (
                                                <div key={pericia.pericia_id} className="mb-2">
                                                    {pericia.name}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border font-trajanPRegular text-white bg-vaccineBlueTones-1000/70 border-vaccineGray-300 px-4 py-2 text-left text-vaccineGray-400">
                                            {pericias.map((pericia) => (
                                                <input
                                                    key={pericia.pericia_id}
                                                    type="number"
                                                    value={pericia.value}
                                                    onChange={(e) =>
                                                        handlePericiaChange(
                                                            pericia.pericia_id,
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    readOnly={!isEditing}
                                                    className={`w-full px-2 py-1 text-center ${
                                                        isEditing ? "border-gray-400 border" : ""
                                                    } rounded focus:outline-none focus:ring-1 focus:ring-vaccinePurple`}
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