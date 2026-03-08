import { useState } from "react";
import type { characterInformation } from "../../types";
import { FiEdit } from "react-icons/fi";

interface CharacterInformationProps {
    charInformations: characterInformation;
    handleTextChange: (field: keyof characterInformation, value: string) => void;
    update: () => void;
}

export function CharacterInformation({
    charInformations,
    handleTextChange,
    update
}: CharacterInformationProps) {
    const [isEditing, setIsEditing] = useState(false);

    function handleChange(field: keyof characterInformation, value: string) {
        if (isEditing) {
            handleTextChange(field, value);
        }
    }

    return (
        <section className="mb-8">
                    <div className="itens-center flex justify-between mb-4">
                        <h2 className="text-2xl font-semibold mb-4 text-vaccineRed">
                            Informações Básicas
                        </h2>
                        <button onClick={() => {setIsEditing(!isEditing); if (isEditing) {update();}}} className="mb-4 px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors">
                            {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={charInformations.nome}
                                onChange={(e) => handleChange("nome", e.target.value)}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                                readOnly={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Classe
                            </label>
                            <input
                                type="text"
                                value={charInformations.classe}
                                onChange={(e) => handleChange("classe", e.target.value)}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                                readOnly={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Raça
                            </label>
                            <input
                                type="text"
                                value={charInformations.raca}
                                onChange={(e) => handleChange("raca", e.target.value)}
                                className={`w-full bg-vaccineGray-300  px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                                readOnly={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gênero
                            </label>
                            <input
                                type="text"
                                value={charInformations.genero}
                                onChange={(e) => handleChange("genero", e.target.value)}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                                readOnly={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Idade
                            </label>
                            <input
                                type="text"
                                value={charInformations.idade}
                                onChange={(e) => handleChange("idade", e.target.value)}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border border-gray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                                readOnly={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subclasse
                            </label>
                            <input
                                type="text"
                                value={charInformations.subclasse}
                                onChange={(e) => handleChange("subclasse", e.target.value)}
                                className={`w-full bg-vaccineGray-300 px-3 py-2 ${isEditing ? 'border border-gray-400' : 'readonly'} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineRed`}
                                readOnly={!isEditing}
                            />
                        </div>
                    </div>
                </section>
    )
}