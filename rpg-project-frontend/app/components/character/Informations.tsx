import { useEffect, useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useCharacter, useClasses, useSubclasses, useRaces, useUpdateCharacterGeneral } from "../../hooks";
import type { UpdateCharacterGeneralRequest } from "../../types";
import { toast } from "react-hot-toast";

interface CharacterInformationProps {
    characterId: number;
}

export function CharacterInformation({
    characterId,
}: CharacterInformationProps) {
    const { data: characterData } =
        useCharacter(characterId);

    const { data: classesData } =
        useClasses();

    const { data: subclassesData } =
        useSubclasses();

    const { data: racesData } =
        useRaces();

    const {mutate: updateGeneral, error: updateError, isSuccess: updateSuccess} = useUpdateCharacterGeneral(characterId);

    const [information, setInformation] =
        useState<UpdateCharacterGeneralRequest | null>(null);  

    const [isEditing, setIsEditing] = useState(false);

     
        
    
    const classes = useMemo(() => classesData?.classes ?? [], [classesData]);
    const subclasses = useMemo(() => subclassesData?.subclasses ?? [], [subclassesData]);
    const races = useMemo(() => racesData?.races ?? [], [racesData]);


    const filteredSubclasses = useMemo(() => {
        if (!information?.charClass) return [];
        return subclasses.filter(subclass => subclass.class_id === information.charClass);
    }, [information?.charClass, subclasses]);

    useEffect(() => {
    if (!characterData?.character) return;

    setInformation({
        charClass:
            Number(
                characterData.character.charClass ?? ""
            ),

        subclass:
            Number(
                characterData.character.subclass ?? ""
            ),

        second_class:
            Number(
                characterData.character.second_class ?? ""
            ),

        race:
            Number(
                characterData.character.race ?? ""
            ),

        gender:
            characterData.character.gender ?? "",

        age:
            Number(
                characterData.character.age ?? ""
            ),
        });
    }, [characterData]);

    useEffect(() => {
        if (updateError) {
            toast.error(updateError?.response?.data?.message || "Erro ao atualizar as informações.");
            setInformation(prev => prev); // Revert to previous information on error
        }
    }, [updateError]);
        

    useEffect(() => {
        if (updateSuccess) {
            toast.success("Informações atualizadas com sucesso!");
        }
    }, [updateSuccess]);

    function handleChange(field: keyof UpdateCharacterGeneralRequest, value: string) {
        setInformation((current) => {
            if (!current) return current;
            
            return {
                ...current,
                [field]: field === "gender" ? value : Number(value),
            };
        });
    }


    function update() {
        if (!information) return;
        updateGeneral(information);
        setIsEditing(false);
    }
    

    return (
        <section className="mb-8">
                    <div className="itens-center flex justify-between mb-4">
                        <h2 className="text-3xl font-walthari font-semibold mb-4 text-vaccineGray-300">
                            Informações Básicas
                        </h2>
                        <button onClick={() => {isEditing ? update() : setIsEditing(true)}} className="mb-4 px-4 py-2 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100">
                            {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                                Classe
                            </label>
                            <select
                                value={information?.charClass}
                                onChange={(e) => handleChange("charClass", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 ${information?.charClass != 0 ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
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
                                value={information?.subclass}
                                onChange={(e) => handleChange("subclass", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border border-gray-400 text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300 ${information?.subclass != 0 ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
                                disabled={!isEditing || !information?.charClass}
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
                                value={information?.second_class}
                                onChange={(e) => handleChange("second_class", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300 ${information?.second_class != 0 ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
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
                                value={information?.race}
                                onChange={(e) => handleChange("race", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000  px-3 py-2 ${isEditing ? 'border-gray-400 border text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300 ${information?.race != 0 ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
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
                                value={information?.gender}
                                onChange={(e) => handleChange("gender", e.target.value)}
                                className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineBlueTones-300 ${information?.gender != "0" ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
                                readOnly={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                                Idade
                            </label>
                            <input
                                type="text"
                                value={information?.age}
                                onChange={(e) => handleChange("age", e.target.value)}
                                className={`w-full font-trajanPRegular   bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border border-gray-400 text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-400`}
                                readOnly={!isEditing}
                            />
                        </div>
                    </div>
                </section>
    )
}