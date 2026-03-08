import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CharacterInformation } from "../components/character/Informations";
import { CharacterStats } from "../components/character/Stats";
import { CharacterAttributes } from "../components/character/Atributes";
import type { characterInformation, characterStats, characterAttributes, UpdateCharacterAttributesRequest, UpdateCharacterRequest } from "../types";
import { useGetCharacter, useGetCharacterAttributes, useGetClasses, useGetSubclasses, useGetRaces, useUpdateCharacter, useUpdateCharacterAttributes, useDeleteCharacter } from "../hooks";
import { Header } from "../components/Header";

export default function RpgSheet() {
    const navigate = useNavigate();
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const { mutate: deleteCharacter } = useDeleteCharacter();

    const { id } = useParams();
    const characterId = useMemo(() => {
        if (!id) return null;
        const parsed = Number(id);
        return Number.isNaN(parsed) ? null : parsed;
    }, [id]);

    const { data: characterDataQuerry, isLoading } = useGetCharacter(characterId);
    const { data: characterAttributesData, isLoading: isAttributesLoading } = useGetCharacterAttributes(characterId);
    const { data: racesData, isLoading: isRacesLoading } = useGetRaces();
    const { data: classesData, isLoading: isClassesLoading } = useGetClasses();
    const { data: subclassesData, isLoading: isSubclassesLoading } = useGetSubclasses();
    const { mutate: updateCharacter } = useUpdateCharacter(Number(id))
    const { mutate: updateCharacterAttributes } = useUpdateCharacterAttributes(characterId)

    const [characterData, setCharacterData] = useState({
        // Section 1: Basic Info
        informations: {
            nome: "",
            classe: "",
            segunda_classe: "",
            raca: "",
            genero: "",
            idade: 0,
            subclasse: "",
            nivel: 1,
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
            setCharacterData((prev) => ({
                ...prev,
                informations: {
                    nome: char.name,
                    classe: String(char.charClass ?? ""),
                    segunda_classe: String(char.second_class ?? ""),
                    raca: String(char.race ?? ""),
                    genero: char.gender,
                    idade: char.age,
                    subclasse: String(char.subclass ?? ""),
                    nivel: char.level,
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
                          attribute_id: attribute.attribute_id,
                          nome: attribute.name,
                          base: attribute.base,
                          bonus: attribute.bonus,
                          total: attribute.total,
                          dt: attribute.dt,
                      }))
                    : prev.atributos,
            }));
        }
    }, [characterDataQuerry, characterAttributesData]);

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
        const selectedClassId = Number(characterData.informations.classe);
        const selectedSecondClassId = Number(characterData.informations.segunda_classe);
        const selectedSubclassId = Number(characterData.informations.subclasse);
        const selectedRaceId = Number(characterData.informations.raca);

        let characterRequestData = {
            name: characterData.informations.nome, 
            gender: characterData.informations.genero,
            age: characterData.informations.idade,
            level: characterData.informations.nivel,
            charClass: Number.isNaN(selectedClassId) ? undefined : selectedClassId,
            second_class: Number.isNaN(selectedSecondClassId) ? undefined : selectedSecondClassId,
            subclass: Number.isNaN(selectedSubclassId) ? undefined : selectedSubclassId,
            race: Number.isNaN(selectedRaceId) ? undefined : selectedRaceId,
        } as UpdateCharacterRequest

        updateCharacter(characterRequestData)
    }

    function updateAttributes() {
        const payload: UpdateCharacterAttributesRequest = {
            attributes: characterData.atributos
                .filter((attribute) => attribute.attribute_id !== undefined)
                .map((attribute) => ({
                    attribute_id: attribute.attribute_id as number,
                    base: attribute.base,
                    bonus: attribute.bonus,
                })),
        };

        updateCharacterAttributes(payload);
    }
    const handleInfoChange = (field: keyof characterInformation, value: string) => {
        if (field === "classe") {
            setCharacterData({
                ...characterData,
                informations: {
                    ...characterData.informations,
                    classe: value,
                    subclasse: "",
                }
            });
            return;
        }

        if (field === "idade" || field === "nivel") {
            setCharacterData({
                ...characterData,
                informations: {
                    ...characterData.informations,
                    [field]: Number(value) || 0,
                }
            });
            return;
        }

        setCharacterData({
            ...characterData,
            informations: {
                ...characterData.informations,
                [field]: value
            }
        });
    };

    const handleStatsChange = (field: keyof characterStats, value: number) => {
        setCharacterData({
            ...characterData,
            stats: {
                ...characterData.stats,
                [field]: value,
            },
        });
    };

    const handleAttributeChange = (index: number, field: string, value: number) => {
        const newAtributos = [...characterData.atributos];
        const updatedAttribute = { ...newAtributos[index], [field]: value };

        const nextTotal = updatedAttribute.base + updatedAttribute.bonus;
        updatedAttribute.total = nextTotal;
        updatedAttribute.dt = Math.max(0, 20 - nextTotal);

        newAtributos[index] = updatedAttribute;
        setCharacterData({ ...characterData, atributos: newAtributos });
    };

    // Calculate stat limits from backend data
    const statLimits = useMemo(() => {
        if (!characterDataQuerry?.character?.stat_limits) {
            return {
                pv: { base: 100, bonus: 0, total: 100 },
                defesa: { base: 10, bonus: 0, total: 10 },
                ocult: { base: 10, bonus: 0, total: 10 },
                san: { base: 100, bonus: 0, total: 100 },
                mana: { base: 100, bonus: 0, total: 100 },
            };
        }

        const limits = characterDataQuerry.character.stat_limits;
        return {
            pv: {
                base: limits.life?.base_max || 100,
                bonus: limits.life?.bonus_max || 0,
                total: limits.life?.total_max || 100,
            },
            defesa: {
                base: limits.defense?.base_max || 10,
                bonus: limits.defense?.bonus_max || 0,
                total: limits.defense?.total_max || 10,
            },
            ocult: {
                base: limits.ocultism?.base_max || 10,
                bonus: limits.ocultism?.bonus_max || 0,
                total: limits.ocultism?.total_max || 10,
            },
            san: {
                base: limits.sanity?.base_max || 100,
                bonus: limits.sanity?.bonus_max || 0,
                total: limits.sanity?.total_max || 100,
            },
            mana: {
                base: limits.mana?.base_max || 100,
                bonus: limits.mana?.bonus_max || 0,
                total: limits.mana?.total_max || 100,
            },
        };
    }, [characterDataQuerry]);


    if (!characterId) {
        return <div>Character id is invalid.</div>;
    }

    if (isLoading || isAttributesLoading || isRacesLoading || isClassesLoading || isSubclassesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-vaccineGray-500 to-vaccineGray-600 flex flex-col">
            {/* Header */}
            <Header>
                <button
                    onClick={() => {
                        if (window.confirm('Tem certeza que deseja deletar esta ficha? Esta ação não pode ser desfeita.')) {
                            deleteCharacter(characterId!, {
                                onSuccess: () => {
                                    navigate('/');
                                },
                            });
                        }
                    }}
                    className="px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-00 transition-colors"
                >
                    Deletar Ficha
                </button>
            </Header>
            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto bg-vaccineGray-400 rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-vaccineBlack font-myFont">
                        Ficha de Personagem
                    </h1>

                {/* Character Name and Level Header */}
                <div className="text-center mb-8 pb-6 border-b-2 border-vaccineRed relative">
                    {isEditingHeader && (
                        <button 
                            onClick={() => {
                                setIsEditingHeader(false);
                                updateCharacterInformation();
                            }} 
                            className="absolute top-0 right-0 px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Salvar
                        </button>
                    )}
                    
                    {isEditingHeader ? (
                        <div className="flex flex-col items-center gap-4">
                            <input
                                type="text"
                                value={characterData.informations.nome}
                                onChange={(e) => handleInfoChange("nome", e.target.value)}
                                className="text-4xl font-bold text-vaccineRed text-center bg-vaccineGray-300 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccineRed"
                                placeholder="Nome do Personagem"
                                autoFocus
                            />
                            <div className="flex items-center justify-center gap-2">
                                <label className="text-lg font-medium text-gray-700">Nível:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={characterData.informations.nivel}
                                    onChange={(e) => handleInfoChange("nivel", e.target.value)}
                                    className="text-2xl font-bold text-vaccineBlack text-center bg-vaccineGray-300 px-3 py-1 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccineRed w-20"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 
                                onClick={() => setIsEditingHeader(true)}
                                className="text-4xl font-bold text-vaccineRed mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                                title="Clique para editar"
                            >
                                {characterData.informations.nome || "Nome do Personagem"}
                            </h2>
                            <div 
                                onClick={() => setIsEditingHeader(true)}
                                className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                title="Clique para editar"
                            >
                                <span className="text-lg font-medium text-gray-700">Nível:</span>
                                <span className="text-2xl font-bold text-vaccineBlack">
                                    {characterData.informations.nivel}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Section 1: Basic Information */}
                <CharacterInformation 
                    charInformations={characterData.informations}
                    handleTextChange={handleInfoChange}
                    update={updateCharacterInformation}
                    classes={classesData?.classes ?? []}
                    subclasses={subclassesData?.subclasses ?? []}
                    races={racesData?.races ?? []}
                />

                {/* Section 2: Character Stats */}
                <CharacterStats
                    charStats={characterData.stats}
                    handleStatChange={handleStatsChange}
                    update={updateCharacterStats}
                    statLimits={statLimits}
                    className={characterDataQuerry?.character?.charClass ? Object.values(classesData?.classes ?? []).find((c) => c.id === characterDataQuerry.character.charClass)?.name || "" : ""}
                    secondClassName={characterDataQuerry?.character?.second_class ? Object.values(classesData?.classes ?? []).find((c) => c.id === characterDataQuerry.character.second_class)?.name || "" : ""}
                />

                {/* Section 3: Attributes Table */}
                <CharacterAttributes
                    atributes={characterData.atributos}
                    handleAttributeChange={handleAttributeChange}
                    update={updateAttributes}
                />
                </div>
            </main>
        </div>
    );
}