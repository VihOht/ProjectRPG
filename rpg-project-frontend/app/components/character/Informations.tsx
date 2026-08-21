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

    // verifica se a informacao antiga é a mesma que a atual, utilizado no update
    function hasChanges() {
        if (!information || !savedInformation) return false;

        return (
            information.charClass !== savedInformation.charClass ||
            information.subclass !== savedInformation.subclass ||
            information.second_class !== savedInformation.second_class ||
            information.race !== savedInformation.race ||
            information.gender !== savedInformation.gender ||
            information.age !== savedInformation.age
        );
    }


    function update() {
        // verificação se a informacao é a mesma, se for não salva
        if (!information || !savedInformation) return;

        if (!hasChanges()) {
            setIsEditing(false);
            return;
        }

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
  
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                <div>

                    <label className="block font-trajanPBold text-sm font-medium text-vaccineGray-300 mb-1">
                        Classe
                    </label>
                    <select
                    value={information?.charClass ?? EMPTY_SELECT_VALUE}
                    // onClick ou onFocus faz não precisar de um botão de edição
                    onFocus={() => {
                        if (!isEditing) {
                            setIsEditing(true);
                        }
                    }}
                    onChange={(e) => handleChange("charClass", e.target.value)}
                    // onBlur atualiza ao sair da caixa
                    onBlur={() => {
                            if (isEditing) {
                                update();
                            }
                        }}
                    className={`
                        w-full
                        font-trajanPRegular
                        bg-vaccineBlueTones-1000
                        px-3 py-2
                        border border-transparent
                        rounded-md
                        focus:outline-none
                        focus:border-white
                        ${(information?.charClass ?? EMPTY_SELECT_VALUE) > 0
                            ? "text-vaccineGray-400"
                            : "text-vaccineBlueTones-300"
                        }
                    `}
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
                        onFocus={() => {
                        if (!isEditing) {
                            setIsEditing(true);
                        }
                        }}
                        onChange={(e) => handleChange("subclass", e.target.value)}
                        onBlur={() => {
                            if (isEditing) {
                                update();
                            }
                        }}
                        className={`
                        w-full
                        font-trajanPRegular
                        bg-vaccineBlueTones-1000
                        px-3 py-2
                        border border-transparent
                        rounded-md
                        focus:outline-none
                        focus:border-white
                        ${(information?.charClass ?? EMPTY_SELECT_VALUE) > 0
                            ? "text-vaccineGray-400"
                            : "text-vaccineBlueTones-300"
                        }
                    `}
                        disabled={!information?.charClass || information.charClass <= 0}
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
                        onFocus={() => {
                        if (!isEditing) {
                            setIsEditing(true);
                        }
                        }}
                        onChange={(e) => handleChange("second_class", e.target.value)}
                        onBlur={() => {
                            if (isEditing) {
                                update();
                            }
                        }}
                        className={`
                        w-full
                        font-trajanPRegular
                        bg-vaccineBlueTones-1000
                        px-3 py-2
                        border border-transparent
                        rounded-md
                        focus:outline-none
                        focus:border-white
                        ${(information?.charClass ?? EMPTY_SELECT_VALUE) > 0
                            ? "text-vaccineGray-400"
                            : "text-vaccineBlueTones-300"
                        }
                    `}
                        
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
                        onFocus={() => {
                        if (!isEditing) {
                            setIsEditing(true);
                        }
                        }}
                        onChange={(e) => handleChange("race", e.target.value)}
                        onBlur={() => {
                            if (isEditing) {
                                update();
                            }
                        }}
                        className={`
                        w-full
                        font-trajanPRegular
                        bg-vaccineBlueTones-1000
                        px-3 py-2
                        border border-transparent
                        rounded-md
                        focus:outline-none
                        focus:border-white
                        ${(information?.charClass ?? EMPTY_SELECT_VALUE) > 0
                            ? "text-vaccineGray-400"
                            : "text-vaccineBlueTones-300"
                        }
                        `}
                        
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
                        onClick={() => {
                            if (!isEditing) {
                                setIsEditing(true);
                            }
                        }}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        onBlur={() => {
                            if (isEditing) {
                                update();
                            }
                        }}
                        className={`
                            w-full
                            font-trajanPRegular
                            bg-vaccineBlueTones-1000
                            px-3 py-2
                            border border-transparent
                            rounded-md
                            focus:outline-none
                            focus:border-white
                            text-vaccineGray-400
                        `}
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
                        onClick={() => {
                            if (!isEditing) {
                                setIsEditing(true);
                            }
                        }}
                        onChange={(e) => handleChange("age", e.target.value)}
                        onBlur={() => {
                            if (isEditing) {
                                update();
                            }
                        }}
                        className={`
                            w-full
                            font-trajanPRegular
                            bg-vaccineBlueTones-1000
                            px-3 py-2
                            border border-transparent
                            rounded-md
                            focus:outline-none
                            focus:border-white
                            text-vaccineGray-400
                        `}
                        readOnly={!isEditing}
                    />
                </div>
            </div>

   
    );
}

