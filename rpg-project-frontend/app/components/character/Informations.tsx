import { useMemo, useState } from "react";
import type { CharacterClass, CharacterRace, CharacterSubclass, characterInformation } from "../../types";
import { FiEdit } from "react-icons/fi";

interface CharacterInformationProps {
    charInformations: characterInformation;
    handleTextChange: (field: keyof characterInformation, value: string) => void;
    update: () => void;
    classes: CharacterClass[];
    subclasses: CharacterSubclass[];
    races: CharacterRace[];
}

export function CharacterInformation({
    charInformations,
    handleTextChange,
    update,
    classes,
    subclasses,
    races,
}: CharacterInformationProps) {
    const [isEditing, setIsEditing] = useState(false);

    const filteredSubclasses = useMemo(() => {
        const selectedClassId = Number(charInformations.classe);
        if (Number.isNaN(selectedClassId) || selectedClassId <= 0) {
            return [];
        }

        return subclasses.filter((subclass) => subclass.class_id === selectedClassId);
    }, [charInformations.classe, subclasses]);

    function handleChange(field: keyof characterInformation, value: string) {
        if (isEditing) {
            handleTextChange(field, value);
        }
    }
    console.log(charInformations.classe)

    return (
        <section className="mb-8">
                    <div className="itens-center flex justify-between mb-4">
                        <h2 className="text-3xl font-walthari font-semibold mb-4 text-vaccineGray-300">
                            Informações Básicas
                        </h2>
                        <button onClick={() => {setIsEditing(!isEditing); if (isEditing) {update();}}} className="mb-4 px-4 py-2 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100">
                            {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                                Classe
                            </label>
                            <select
                                value={charInformations.classe}
                                onChange={(e) => handleChange("classe", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 ${charInformations.classe != "0" ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
                                disabled={!isEditing}
                            >
                                <option  value="">Selecione uma classe</option>
                                {classes.map((charClass) => (
                                    <option key={charClass.id} value={String(charClass.id)}>
                                        {charClass.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                                Subclasse
                            </label>
                            <select
                                value={charInformations.subclasse}
                                onChange={(e) => handleChange("subclasse", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border border-gray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300`}
                                disabled={!isEditing || !charInformations.classe}
                            >
                                <option value="">Selecione uma subclasse</option>
                                {filteredSubclasses.map((subclass) => (
                                    <option key={subclass.id} value={String(subclass.id)}>
                                        {subclass.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                                Segunda Classe
                            </label>
                            <select
                                value={charInformations.segunda_classe}
                                onChange={(e) => handleChange("segunda_classe", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300`}
                                disabled={!isEditing}
                            >
                                <option value="">Selecione uma segunda classe</option>
                                {classes.map((charClass) => (
                                    <option key={charClass.id} value={String(charClass.id)}>
                                        {charClass.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                                Raça
                            </label>
                            <select
                                value={charInformations.raca}
                                onChange={(e) => handleChange("raca", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000  px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300`}
                                disabled={!isEditing}
                            >
                                <option value="">Selecione uma raça</option>
                                {races.map((race) => (
                                    <option key={race.id} value={String(race.id)}>
                                        {race.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                                Gênero
                            </label>
                            <input
                                type="text"
                                value={charInformations.genero}
                                onChange={(e) => handleChange("genero", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineBlueTones-300`}
                                readOnly={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                                Idade
                            </label>
                            <input
                                type="text"
                                value={charInformations.idade}
                                onChange={(e) => handleChange("idade", e.target.value)}
                                className={`w-full font-trajanPRegular   bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border border-gray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-400`}
                                readOnly={!isEditing}
                            />
                        </div>
                    </div>
                </section>
    )
}