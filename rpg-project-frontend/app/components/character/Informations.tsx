import { useEffect, useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useCharacter, useClasses, useSubclasses, useRaces, useUpdateCharacterGeneral } from "../../hooks";
import type { UpdateCharacterGeneralRequest } from "../../types";
import { toast } from "react-hot-toast";
import { SheetSection } from "./SheetSection";

const EMPTY_SELECT_VALUE = -1;

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
    // console.log("RACES DATA:", racesData);

    const {mutate: updateGeneral, error: updateError, isSuccess: updateSuccess} = useUpdateCharacterGeneral(characterId);

    const [draftInformation, setDraftInformation] =
        useState<UpdateCharacterGeneralRequest | null>(null);  

    const [isEditing, setIsEditing] = useState(false);
    const [isSectionOpen, setIsSectionOpen] = useState(false);

     
        
    
    const classes = useMemo(() => classesData?.classes ?? [], [classesData]);
    const subclasses = useMemo(() => subclassesData?.subclasses ?? [], [subclassesData]);
    const races = useMemo(() => racesData?.races ?? [], [racesData]);

    const savedInformation = useMemo<UpdateCharacterGeneralRequest | null>(() => {
        if (!characterData?.character) return null;

        return {
            charClass: characterData.character.charClass ?? EMPTY_SELECT_VALUE,

            subclass: characterData.character.subclass ?? EMPTY_SELECT_VALUE,

            second_class: characterData.character.second_class ?? EMPTY_SELECT_VALUE,

            race: characterData.character.race ?? EMPTY_SELECT_VALUE,

            gender:
                characterData.character.gender ?? "",

            age:
                Number(
                    characterData.character.age ?? ""
                ),
        };
    }, [characterData]);

    const information = draftInformation ?? savedInformation;
    const selectedClassId = information?.charClass ?? EMPTY_SELECT_VALUE;

    const filteredSubclasses = useMemo(() => {
        if (selectedClassId <= 0) return [];
        return subclasses.filter(subclass => subclass.class_id === selectedClassId);
    }, [selectedClassId, subclasses]);

    useEffect(() => {
        if (updateError) {
            const error = updateError as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || "Erro ao atualizar as informações.");
        }
    }, [updateError]);
        

    useEffect(() => {
        if (updateSuccess) {
            toast.success("Informações atualizadas com sucesso!");
        }
    }, [updateSuccess]);

    function getSelectValue(value: string) {
        if (!value) {
            return EMPTY_SELECT_VALUE;
        }

        const nextValue = Number(value);
        return Number.isNaN(nextValue) ? EMPTY_SELECT_VALUE : nextValue;
    }

    function getUpdateValue(value: number | undefined) {
        return value && value > 0 ? value : undefined;
    }

    function handleChange(field: keyof UpdateCharacterGeneralRequest, value: string) {
        setDraftInformation((current) => {
            const source = current ?? savedInformation;

            if (!source) return current;

            if (field === "gender") {
                return {
                    ...source,
                    gender: value,
                };
            }

            if (field === "age") {
                const nextAge = Number(value);

                return {
                    ...source,
                    age: Number.isNaN(nextAge) ? 0 : nextAge,
                };
            }

            const nextValue = getSelectValue(value);
            
            return {
                ...source,
                [field]: nextValue,
                ...(field === "charClass" ? { subclass: EMPTY_SELECT_VALUE } : {}),
            };
        });
    }


    function update() {
        if (!information) return;
        const characterGeneralData: UpdateCharacterGeneralRequest = {
            gender: information.gender ?? "",
            age: information.age ?? 0,
        };
        const charClass = getUpdateValue(information.charClass);
        const subclass = getUpdateValue(information.subclass);
        const secondClass = getUpdateValue(information.second_class);
        const race = getUpdateValue(information.race);

        if (charClass !== undefined) characterGeneralData.charClass = charClass;
        if (subclass !== undefined) characterGeneralData.subclass = subclass;
        if (secondClass !== undefined) characterGeneralData.second_class = secondClass;
        if (race !== undefined) characterGeneralData.race = race;

        updateGeneral(characterGeneralData, {
            onSuccess: () => setDraftInformation(null),
        });
        setIsEditing(false);
    }

    return (
        <SheetSection
            title="Informações Básicas"
            onOpenChange={setIsSectionOpen}
            actions={
                <button
                    disabled={!isSectionOpen && !isEditing}
                    onClick={() => {
                        if (isEditing) {
                            update();
                            return;
                        }

                        setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                </button>
            }
        >
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                <div>
                    <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                        Classe
                    </label>
                    <select
                    value={information?.charClass ?? EMPTY_SELECT_VALUE}
                    onChange={(e) => handleChange("charClass", e.target.value)}
                    className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 ${(information?.charClass ?? EMPTY_SELECT_VALUE) > 0 ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
                    disabled={!isEditing}
                >
                    <option value={EMPTY_SELECT_VALUE}>Selecione uma classe</option>
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
                        value={information?.subclass ?? EMPTY_SELECT_VALUE}
                        onChange={(e) => handleChange("subclass", e.target.value)}
                        className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border border-gray-400 text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300 ${(information?.subclass ?? EMPTY_SELECT_VALUE) > 0 ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
                        disabled={!isEditing || !information?.charClass || information.charClass <= 0}
                    >
                        <option value={EMPTY_SELECT_VALUE}>Selecione uma subclasse</option>
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
                        value={information?.second_class ?? EMPTY_SELECT_VALUE}
                        onChange={(e) => handleChange("second_class", e.target.value)}
                        className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border-gray-400 border text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300 ${(information?.second_class ?? EMPTY_SELECT_VALUE) > 0 ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
                        disabled={!isEditing}
                    >
                        <option value={EMPTY_SELECT_VALUE}>Selecione uma segunda classe</option>
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
                        value={information?.race ?? EMPTY_SELECT_VALUE}
                        onChange={(e) => handleChange("race", e.target.value)}
                        className={`w-full font-trajanPRegular bg-vaccineBlueTones-1000  px-3 py-2 ${isEditing ? 'border-gray-400 border text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineBlueTones-400 text-vaccineBlueTones-300 ${(information?.race ?? EMPTY_SELECT_VALUE) > 0 ? "text-vaccineGray-400" : "text-vaccineBlueTones-300"}`}
                        disabled={!isEditing}
                    >
                        <option value={EMPTY_SELECT_VALUE}>Selecione uma raça</option>
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
                        value={information?.gender ?? ""}
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
                        value={information?.age ?? ""}
                        onChange={(e) => handleChange("age", e.target.value)}
                        className={`w-full font-trajanPRegular   bg-vaccineBlueTones-1000 px-3 py-2 ${isEditing ? 'border border-gray-400 text-vaccineGray-400' : ''} rounded-md focus:outline-none focus:ring-2 focus:ring-vaccineGray-100 text-vaccineGray-400`}
                        readOnly={!isEditing}
                    />
                </div>
            </div>

    
        </SheetSection>
    );
}

