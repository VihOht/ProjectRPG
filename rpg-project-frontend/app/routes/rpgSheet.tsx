import { StarSky } from "../components/StarSky";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CharacterInformation } from "../components/character/Informations";
import { CharacterStats } from "../components/character/Stats";
import { CharacterAttributes } from "../components/character/Atributes";
import { CharacterBackstory } from "../components/character/Backstory";
import { CharacterPhysicaldesc } from "../components/character/PhysicalDesc";
import { CharacterPsycDesc } from "../components/character/PsycDesc";
import type { characterInformation, characterStats, CharacterAttributeItem, CharacterPericiaItem, UpdateCharacterAttributesRequest, UpdateCharacterPericiasRequest, UpdateCharacterRequest } from "../types";
import type { User } from "../types/auth";
import { useGetCharacter, useGetCharacterAttributes, useGetClasses, useGetSubclasses, useGetRaces, useUpdateCharacter, useUpdateCharacterAttributes, useUpdateCharacterPericias, useDeleteCharacter, useGetUsers, useActivateCharacter, useDeactivateCharacter, useTransferCharacterOwnership, useReturnCharacterToAdmin } from "../hooks";
import { Header } from "../components/Header";
import { useAuthProvider } from "../providers";

export default function RpgSheet() {
    const navigate = useNavigate();
    const { user } = useAuthProvider();
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [transferTargetId, setTransferTargetId] = useState<string>("");
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
    const isAdmin = user?.role === "ADMIN";
    const { data: usersData } = useGetUsers(isAdmin);
    const { mutate: updateCharacter } = useUpdateCharacter(Number(id))
    const { mutate: updateCharacterAttributes } = useUpdateCharacterAttributes(characterId)
    const { mutate: updateCharacterPericias } = useUpdateCharacterPericias(characterId)
    const { mutate: activateCharacter, isPending: isActivating } = useActivateCharacter(characterId);
    const { mutate: deactivateCharacter, isPending: isDeactivating } = useDeactivateCharacter(characterId);
    const { mutate: transferCharacterOwnership, isPending: isTransferring } = useTransferCharacterOwnership(characterId);
    const { mutate: returnCharacterToAdmin, isPending: isReturning } = useReturnCharacterToAdmin(characterId);

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
        
        // Section 3: Attributes and Pericias
        attributes: [] as CharacterAttributeItem[],
        pericias: [] as CharacterPericiaItem[],
        
        // Section 4: Backstory
        backstory: "",

        // Section 5: Physical description
        physical_description: "",

        // Section 6: Psycological description
        Psycological_description: "",


    });

    const ownerUser = useMemo(() => {
        if (!isAdmin) {
            return null;
        }

        return usersData?.users.find((listedUser) => listedUser.id === characterDataQuerry?.character?.own) ?? null;
    }, [characterDataQuerry?.character?.own, isAdmin, usersData?.users]);

    const transferOptions = useMemo(() => {
        if (!isAdmin) {
            return [] as User[];
        }

        return (usersData?.users ?? []).filter((listedUser) => listedUser.role === "USER");
    }, [isAdmin, usersData?.users]);

    useEffect(() => {
        if (characterDataQuerry) {
            const char = characterDataQuerry.character;
            const initialTransferTarget = usersData?.users.find((listedUser) => listedUser.id === char.own);
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
                backstory: char.backstory ?? "",
                physical_description: char.physical_description ?? "",
                attributes: characterAttributesData?.attributes ?? prev.attributes,
                pericias: characterAttributesData?.pericias ?? prev.pericias,
            }));

            if (isAdmin) {
                setTransferTargetId(initialTransferTarget ? String(initialTransferTarget.id) : String(char.own));
            }
        }
    }, [characterDataQuerry, characterAttributesData, usersData?.users, isAdmin]);

    useEffect(() => {
        if (!isAdmin || !characterDataQuerry?.character?.own || transferTargetId) {
            return;
        }

        setTransferTargetId(String(characterDataQuerry.character.own));
    }, [characterDataQuerry?.character?.own, isAdmin, transferTargetId]);

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
            attributes: characterData.attributes
                .map((attribute) => ({
                    attribute_id: attribute.attribute_id,
                    base: attribute.base,
                    bonus: attribute.bonus,
                })),
        };

        updateCharacterAttributes(payload);
    }

    function updatePericias() {
        const payload: UpdateCharacterPericiasRequest = {
            pericias: characterData.pericias
                .map((pericia) => ({
                    pericia_id: pericia.pericia_id,
                    base: pericia.base,
                    bonus: pericia.bonus,
                })),
        };

        updateCharacterPericias(payload);
    }

    function updateCharacterSheet() {
        updateAttributes();
        updatePericias();
    }

    function handleToggleActive() {
        if (!characterDataQuerry?.character) {
            return;
        }

        if (characterDataQuerry.character.active) {
            deactivateCharacter();
            return;
        }

        activateCharacter();
    }

    function handleTransferOwnership() {
        if (!transferTargetId) {
            return;
        }

        if (transferTargetId === "RETURN_TO_NPC") {
            if (window.confirm('Converter esta ficha de player para NPC? Esta ação não pode ser desfeita.')) {
                returnCharacterToAdmin();
            }
            return;
        }

        const newOwnerId = Number(transferTargetId);
        if (Number.isNaN(newOwnerId)) {
            return;
        }

        transferCharacterOwnership(newOwnerId);
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

        if (field === "nivel") {
            setCharacterData({
                ...characterData,
                informations: {
                    ...characterData.informations,
                    [field]: (Number(value) && Number(value) >= 0 && Number(value) <= 50 || Number(value) == 888 || Number(value) == 88) ? Number(value) : 0,
                }
            });
            return;
        }

        if (field === "idade") {
            setCharacterData({
                ...characterData,
                informations: {
                    ...characterData.informations,
                    [field]: (Number(value) && Number(value) >= 0) ? Number(value) : 0,
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

    const handleAttributeChange = (attributeId: number, field: string, value: number) => {
        const newAttributes = characterData.attributes.map((attr) => {
            if (attr.attribute_id === attributeId) {
                const updatedAttribute = { ...attr, [field]: value };
                if (field === 'base') {
                    updatedAttribute.total = updatedAttribute.base + updatedAttribute.bonus;
                }
                return updatedAttribute;
            }
            return attr;
        });
        setCharacterData({ ...characterData, attributes: newAttributes });
    };

    const handlePericiaChange = (periciaId: number, field: string, value: number) => {
        const newPericias = characterData.pericias.map((pericia) => {
            if (pericia.pericia_id === periciaId) {
                const updatedPericia = { ...pericia, [field]: value };
                if (field === 'base') {
                    updatedPericia.total = updatedPericia.base + updatedPericia.bonus;
                }
                return updatedPericia;
            }
            return pericia;
        });
        setCharacterData({ ...characterData, pericias: newPericias });
    };

    const handleBackstoryChange = (value: string) => {
        setCharacterData({
            ...characterData,
            backstory: value,
        });
    };

    function updateCharacterBackstory() {
        updateCharacter({
            backstory: characterData.backstory,
        } as UpdateCharacterRequest);
    }

    const handlePhysicalDescChange = (value: string) => {
        setCharacterData({
            ...characterData,
            physical_description: value,
        });
    };

    function updateCharacterPhysicalDesc() {
        updateCharacter({
            physical_description: characterData.physical_description,
        } as UpdateCharacterRequest);
    }

    const handlePsycDescChange = (value: string) => {
        setCharacterData({
            ...characterData,
            Psycological_description: value,
        });
    };

    function updateCharacterPsycDesc() {
        updateCharacter({
            Psycological_description: characterData.Psycological_description,
        } as UpdateCharacterRequest);
    }

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
        <StarSky>
            
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
                        className="px-4 py-2 bg-vaccineRed/40 hover:bg-vaccineRed/80 text-white rounded-md hover:bg-red-00 transition-colors"
                    >
                        Deletar Ficha
                    </button>
                </Header>
                {/* Main Content */}
                <main className="flex-1  p-8 text-sm text-vaccineBlack">
                    <div className="max-w-5xl mx-auto border-1 border-vaccineGray-300/50  rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-walthari font-bold text-center mb-8 text-vaccineGray-300">
                            Ficha de Personagem
                        </h1>

                        {isAdmin && characterDataQuerry?.character && (
                            <section className="mb-8 rounded-lg border border-vaccineRed/30 bg-white/80 p-4 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-gray-600">Administração</p>
                                        <p className="text-lg font-semibold text-vaccineBlack">
                                            Dono: {ownerUser?.username ?? `Usuário #${characterDataQuerry.character.own}`}
                                        </p>
                                        <p className="text-gray-700">
                                            Status: {characterDataQuerry.character.active ? "Ficha ativada" : "Ficha desativada"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleToggleActive}
                                        disabled={isActivating || isDeactivating}
                                        className="px-4 py-2 rounded-md bg-vaccineRed text-white hover:opacity-90 disabled:opacity-60 transition-colors"
                                    >
                                        {characterDataQuerry.character.active ? "Desativar ficha" : "Ativar ficha"}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                    <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                        Transferir posse para
                                        <select
                                            value={transferTargetId}
                                            onChange={(event) => setTransferTargetId(event.target.value)}
                                            className="min-w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-vaccineBlack"
                                        >
                                            {transferOptions.map((listedUser) => (
                                                <option key={listedUser.id} value={listedUser.id}>
                                                    {listedUser.username} ({listedUser.email})
                                                </option>
                                            ))}
                                            {characterDataQuerry?.character?.is_player && (
                                                <option value="RETURN_TO_NPC" className="text-vaccineRed font-semibold">
                                                    Devolver para NPC
                                                </option>
                                            )}
                                        </select>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleTransferOwnership}
                                        disabled={isTransferring || isReturning || !transferTargetId}
                                        className="px-4 py-2 rounded-md bg-vaccineBlack text-white hover:opacity-90 disabled:opacity-60 transition-colors"
                                    >
                                        {transferTargetId === "RETURN_TO_NPC" ? "Devolver para NPC" : "Transferir posse"}
                                    </button>
                                </div>
                            </section>
                        )}

                    {/* Character Name and Level Header */}
                    <div className="text-center font-trajanPBold mb-8 pb-6 border-b-2 border-vaccineGray-300 relative">
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
                                    className="text-4xl font-bold text-vaccineGray-900 text-center bg-vaccineGray-300 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccineRed"
                                    placeholder="Nome do Personagem"
                                    autoFocus
                                />
                                <div className="flex items-center justify-center gap-2">
                                    <label className="text-lg font-medium text-white">Nível:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={characterData.informations.nivel}
                                        onChange={(e) => handleInfoChange("nivel", e.target.value)}
                                        className="text-2xl font-bold text-vaccineGray-900 text-center bg-vaccineGray-300 px-3 py-1 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccineRed w-20"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 
                                    onClick={() => setIsEditingHeader(true)}
                                    className="text-4xl  font-bold text-vaccineRed mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                                    title="Clique para editar"
                                >
                                    {characterData.informations.nome || "Nome do Personagem"}
                                </h2>
                                <div 
                                    onClick={() => setIsEditingHeader(true)}
                                    className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    title="Clique para editar"
                                >
                                    <span className="text-lg font-medium text-vaccineGray-600">Nível:</span>
                                    <span className="text-2xl font-bold text-vaccineGray-600">
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

                    {/* Section 3: Attributes and Pericias Table */}
                    <CharacterAttributes
                        attributes={characterData.attributes}
                        pericias={characterData.pericias}
                        onAttributeChange={handleAttributeChange}
                        onPericiaChange={handlePericiaChange}
                        onUpdate={updateCharacterSheet}
                    />

                    <CharacterPhysicaldesc
                        physicaldesc={characterData.physical_description}
                        handlePhysicaldescChange={handlePhysicalDescChange}
                        update={updateCharacterPhysicalDesc}
                    />

                    <CharacterPsycDesc
                        psycDesc={characterData.Psycological_description}
                        handlePsycDescChange={handlePsycDescChange}
                        update={updateCharacterPhysicalDesc}
                    />

                    <CharacterBackstory
                        backstory={characterData.backstory}
                        handleBackstoryChange={handleBackstoryChange}
                        update={updateCharacterBackstory}
                    />
                    </div>
                </main>
            
        </StarSky>
    );
}