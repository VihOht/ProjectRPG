import { useEffect, useMemo, useState } from "react";
import { CharacterInformation } from "../components/character/Informations";
import { CharacterStats } from "../components/character/Stats";
import { CharacterAttributes } from "../components/character/Atributes";
import type { characterInformation, characterStats, characterAttributes, UpdateCharacterRequest, UpdateCharacterAttributesRequest } from "../types";
import { useGetCharacter, useGetRace, useGetCharacterAttributes, useGetClass, useUpdateCharacterAttributes, useUpdateCharacter  } from "../hooks";
import { useParams } from "react-router";

export default function RpgSheet() {
    const { id } = useParams();
    const characterId = useMemo(() => {
        if (!id) return null;
        const parsed = Number(id);
        return Number.isNaN(parsed) ? null : parsed;
    }, [id]);

    const { data: characterDataQuerry, isLoading } = useGetCharacter(characterId);
    const { data: characterAttributesData, isLoading: isAttributesLoading } = useGetCharacterAttributes(characterId);
    const { data: raceData, isLoading: isRaceLoading } = useGetRace(characterDataQuerry?.character.race ?? null);
    const { data: classData, isLoading: isClassLoading } = useGetClass(characterDataQuerry?.character.charClass ?? null);
    const { mutate: updateCharacter, isPending } = useUpdateCharacter(Number(id))

    const [characterData, setCharacterData] = useState({
        // Section 1: Basic Info
        informations: {
            nome: "",
            classe: "",
            raca: "",
            genero: "",
            idade: 0,
            subclasse: "",
        } as characterInformation,

        // Section 2: Stats
        stats: {
            pv: 0,
            defesa: 0,
            ocult: 0,
            san: 0,
            mana: 0,
        } as characterStats,
        

        // Section 3: Attributes Table
        atributos: [] as characterAttributes,
    });

    useEffect(() => {
        if (characterDataQuerry) {
            const char = characterDataQuerry.character;
            const race = raceData?.race;
            const charClass = classData?.class;
            setCharacterData((prev) => ({
                ...prev,
                informations: {
                    nome: char.name,
                    classe: charClass?.name || "",
                    raca: race?.name || "",
                    genero: char.gender,
                    idade: char.age,
                    subclasse: charClass?.name || "",
                },
                stats: {
                    pv: char.life,
                    defesa: char.defense,
                    ocult: char.ocultism,
                    san: char.sanity,
                    mana: char.mana,
                },
                atributos: characterAttributesData?.attributes
                    ? characterAttributesData.attributes.map((attribute) => ({
                          nome: attribute.name,
                          base: attribute.value,
                          bonus: 0,
                          total: attribute.value,
                          dt: 0,
                      }))
                    : prev.atributos,
            }));
        }
    }, [characterDataQuerry, raceData, classData, characterAttributesData]);

    function updateCharacterStats() {
        let characterRequestData = {
            life: characterData.stats.pv,
            defense: characterData.stats.defesa,
            sanity: characterData.stats.san,
            ocultism: characterData.stats.ocult,
            mana: characterData.stats.mana
        } as UpdateCharacterRequest

        updateCharacter(characterRequestData)
    }

    function updateCharacterInformation() {
        let characterRequestData = {
            name: characterData.informations.nome, 
            gender: characterData.informations.genero,
            age: characterData.informations.idade,
        } as UpdateCharacterRequest

        updateCharacter(characterRequestData)
    }


    if (!characterId) {
        return <div>Character id is invalid.</div>;
    }

    if (isLoading || isAttributesLoading || isRaceLoading || isClassLoading) {
        return <div>Loading...</div>;
    }

    const handleInfoChange = (field: keyof characterInformation, value: string) => {
        setCharacterData({
            ...characterData,
            informations: {
                ...characterData.informations,
                [field]: value
            }
        });
    };

    const handleStatsChange = (field: string, value: number) => {
        setCharacterData({ ...characterData, [field]: value });
    };

    const handleAttributeChange = (index: number, field: string, value: number) => {
        const newAtributos = [...characterData.atributos];
        newAtributos[index] = { ...newAtributos[index], [field]: value };
        setCharacterData({ ...characterData, atributos: newAtributos });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto bg-vaccineGray-400 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-vaccineBlack font-myFont">
                    Ficha de Personagem
                </h1>

                {/* Section 1: Basic Information */}
                <CharacterInformation 
                    charInformations={characterData.informations}
                    handleTextChange={handleInfoChange}
                    update={updateCharacterInformation}
                />

                {/* Section 2: Character Stats */}
                <CharacterStats
                    charStats={characterData.stats}
                    handleStatChange={handleStatsChange}
                    update={updateCharacterStats}
                />

                {/* Section 3: Attributes Table */}
                <CharacterAttributes
                    atributes={characterData.atributos}
                    handleAttributeChange={handleAttributeChange}
                />
            </div>
        </div>
    );
}