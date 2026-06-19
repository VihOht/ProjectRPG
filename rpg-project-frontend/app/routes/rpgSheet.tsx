import { StarSky } from "../components/StarSky";
import { useEffect, useMemo, useState  } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { CharacterInformation } from "../components/character/Informations";
import { CharacterStats } from "../components/character/Stats";
import { CharacterAttributes } from "../components/character/Atributes";
import { CharacterLore } from "../components/character/Lore";
import type { UpdateCharacterGeneralRequest } from "../types";
import { useDeleteCharacter, useCharacter, useToggleCharacterActive, useTransferCharacterOwnership, useReturnCharacterToAdmin, useUpdateCharacterGeneral } from "../hooks/useCharacters";
import { useGetUserById, useGetUsers, useCharacters } from "../hooks";
import { Header } from "../components/Header";
import { useAuthProvider } from "../providers";
import { toast } from "react-hot-toast";
import { CharacterAbilities } from "../components/character/Abilities";


export default function RpgSheet() {
    const navigate = useNavigate();
    const { user } = useAuthProvider();
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [transferTargetId, setTransferTargetId] = useState<string>("");
    const { refetch: refetchCharacters } = useCharacters();
    const { id } = useParams();
    const characterId = useMemo(() => {
        if (!id) return null;
        const parsed = Number(id);
        return parsed
    }, [id]);

    if (characterId === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500">ID do personagem é inválido.</p>
            </div>
        );
    }

    const { data: characterData, refetch: refetchCharacter, isLoading: isCharacterLoading, error: characterError } = useCharacter(characterId!);

   
    const { mutate: deleteCharacter } = useDeleteCharacter();
    const { mutate: toggleActive, isPending: isTogglingActive } = useToggleCharacterActive(characterId!);
    const { data: ownerData } = useGetUserById(characterData?.character.own ?? -1, !!characterData?.character.own);
    const { mutate: transferOwnership, isPending: isTransferring } = useTransferCharacterOwnership(characterId!);
    const { mutate: returnToAdmin, isPending: isReturning } = useReturnCharacterToAdmin(characterId!);
    const { data: usersData } = useGetUsers();
    const { mutate: updateGeneral } = useUpdateCharacterGeneral(characterId!);
    const isAdmin = user?.role === "ADMIN";

    const [character, setCharacter] = useState<UpdateCharacterGeneralRequest | null>(
        {
            name: characterData?.character.name ?? "",
            level: characterData?.character.level ?? 1,
            experience: characterData?.character.experience ?? 0,
            charClass: characterData?.character.charClass ?? -1,
            subclass: characterData?.character.subclass ?? -1,
            second_class: characterData?.character.second_class ?? -1,
            race: characterData?.character.race ?? -1,
        }
    );

    useEffect(() => {
        if (characterData?.character) {
            setCharacter(prev =>
                ({
                    name: characterData.character.name ?? prev?.name ?? "",
                    level: characterData.character.level ?? prev?.level ?? 1,
                    experience: characterData.character.experience ?? prev?.experience ?? 0,
                    charClass: characterData.character.charClass ?? prev?.charClass ?? -1,
                    subclass: characterData.character.subclass ?? prev?.subclass ?? -1,
                    second_class: characterData.character.second_class ?? prev?.second_class ?? -1,
                    race: characterData.character.race ?? prev?.race ?? -1,
                })
            );
        }
    }, [characterData]);


    const handleToggleActive = () => {
        toggleActive();
    };

    const handleTransferOwnership = () => {
        if (transferTargetId === "RETURN_TO_NPC") {
            if (window.confirm('Tem certeza que deseja devolver esta ficha para NPC? Esta ação não pode ser desfeita.')) {
                returnToAdmin();
            }
        } else {
            const targetUserId = Number(transferTargetId);
            if (window.confirm(`Tem certeza que deseja transferir a posse desta ficha para o usuário #${targetUserId}? Esta ação não pode ser desfeita.`)) {
                transferOwnership(targetUserId);
            }
        }
    }


    const transferOptions = useMemo(() => {
        const options = usersData?.users.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
        })) ?? [];
        return options;
    }, [usersData?.users]);

    if (!characterId) {
        return <div>Character id is invalid.</div>;
    }
    if (characterError) {
        if (characterError.response?.status === 404) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-xl text-gray-500">Ficha não encontrada.</p>
                    <br />
                    <Link to="/" className="text-vaccinePurple ml-2">Voltar para a página inicial</Link>
                </div>
            );
        }
    }

    if (isCharacterLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500">Carregando ficha...</p>
            </div>
        );
    }

    const handleInfoChange = (field: "nome" | "nivel" | "experiencia", value: string) => {
        if (!character) return;

        if (field === "nome") {
            setCharacter({
                ...character,
                name: value,
            });
        } else if (field === "nivel") {
            const numericValue = Number(value);
            if (!isNaN(numericValue) && numericValue > 0) {
                setCharacter({
                    ...character,
                    level: numericValue,
                });
            }
        } else if (field === "experiencia") {
            const numericValue = Number(value);
            if (!isNaN(numericValue) && numericValue >= 0) {
                setCharacter({
                    ...character,
                    experience: numericValue,
                });
            }
        }
    };

    const handleSafeInfo = () => {
        if (!character) return;
        updateGeneral({name: character.name ?? "", level: character.level ?? 0, experience: character.experience ?? 0}, {
            onSuccess: () => { 
                refetchCharacter();
                toast.success("Informações atualizadas com sucesso!");
             },
            onError: () => { toast.error("Erro ao atualizar informações."); }
        });
        
    };

    

    return (
        <StarSky>
            
                {/* Header */}
                <Header>
                    <button
                        onClick={() => {
                            if (window.confirm('Tem certeza que deseja deletar esta ficha? Esta ação não pode ser desfeita.')) {
                                deleteCharacter(characterId!, {
                                    onSuccess: () => {
                                        refetchCharacters();
                                        toast.success('Ficha deletada com sucesso!');
                                        navigate('/');
                                    },
                                });
                            }
                        }}
                        className="px-4 py-2 bg-vaccinePurple/40 hover:bg-vaccinePurple/80 text-white rounded-md hover:bg-purple-00 transition-colors"
                    >
                        Deletar Ficha
                    </button>
                </Header>
                {/* Main Content */}
                <main className="flex-1 break-all p-8 text-sm text-vaccineBlack">
                {/* <div
                    ref={sheetRef}
                    className="max-w-5xl mx-auto border-1 border-vaccineGray-300/50 rounded-lg shadow-lg p-8 print-area"
                >
                </div> */}
                    <div className="max-w-5xl  mx-auto md:border-1 md:border-vaccineGray-300/50  md:rounded-lg shadow-lg md:p-8">
                        <h1 className="text-3xl font-walthari font-bold text-center mb-8 text-vaccineGray-300">
                            Ficha de Personagem
                        </h1>

                        {isAdmin && characterData?.character && (
                            <section className="mb-8 rounded-lg border border-vaccinePurple/30 bg-white/80 p-4 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-gray-600">Administração</p>
                                        <p className="text-lg font-semibold text-vaccineBlack">
                                            Dono: {ownerData?.username ?? `Usuário #${characterData.character.own}`}
                                        </p>
                                        <p className="text-gray-700">
                                            Status: {characterData.character.active ? "Ficha ativada" : "Ficha desativada"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleToggleActive}
                                        disabled={isTogglingActive}
                                        className="px-4 py-2 rounded-md bg-vaccinePurple text-white hover:opacity-90 disabled:opacity-60 transition-colors"
                                    >
                                        {characterData.character.active ? "Desativar ficha" : "Ativar ficha"}
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
                                            {characterData?.character?.is_player && (
                                                <option value="RETURN_TO_NPC" className="text-vaccinePurple font-semibold">
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
                                            handleSafeInfo();
                                        }} 
                                        className="px-4 my-2 justify-end py-2 bg-vaccinePurple text-white rounded-md hover:bg-purple-700 transition-colors"
                                    >
                                        Salvar
                                    </button>
                                )}
                        {isEditingHeader ? (
                            <div className="flex flex-col items-center gap-4">
                                <input
                                    type="text"
                                    value={character?.name ?? ""}
                                    onChange={(e) => handleInfoChange("nome", e.target.value)}
                                    className="text-2xl font-bold text-vaccineGray-900 text-center bg-vaccineGray-300 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
                                    placeholder="Nome do Personagem"
                                    autoFocus
                                />
                                <div className="flex items-center justify-center gap-2">
                                    <label className="text-lg font-medium text-white">Nível:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={character?.level ?? ""}
                                        onChange={(e) => handleInfoChange("nivel", e.target.value)}
                                        className="text-xl font-bold text-vaccineGray-900 text-center bg-vaccineGray-300 px-3 py-1 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccinePurple w-20"
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <label className="text-sm font-medium text-white">Experiência:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={character?.experience ?? ""}
                                        onChange={(e) => handleInfoChange("experiencia", e.target.value)}
                                        className="text-xl font-bold text-vaccineGray-900 text-center bg-vaccineGray-300 px-3 py-1 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccinePurple w-32"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 
                                    onClick={() => setIsEditingHeader(true)}
                                    className="text-4xl  font-bold text-vaccinePurple mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                                    title="Clique para editar"
                                >
                                    {characterData?.character.name || "Nome do Personagem"}
                                </h2>
                                <div 
                                    onClick={() => setIsEditingHeader(true)}
                                    className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    title="Clique para editar"
                                >
                                    <span className="text-lg font-medium text-vaccineGray-600">Nível:</span>
                                    <span className="text-2xl font-bold text-vaccineGray-600">
                                        {characterData?.character.level ?? ""}
                                    </span>
                                </div>
                                <div 
                                    onClick={() => setIsEditingHeader(true)}
                                    className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    title="Clique para editar"
                                >
                                    <span className="text-sm font-medium text-vaccineGray-600">Experiência:</span>
                                    <span className="text-xm font-bold text-vaccineGray-600">
                                        {characterData?.character.experience ?? ""}
                                    </span>
                                </div>
                            </>
                        )}
                    </div> 


                    <CharacterInformation characterId={characterId} />
                    <CharacterStats characterId={characterId} />
                    <CharacterAttributes characterId={characterId} />
                    <CharacterAbilities characterId={characterId} />
                    <CharacterLore characterId={characterId} />


                    {/* <CharacterEquipament
                        equipDescription={characterData.equipDescription}
                        equipament={characterData.equipament}
                        handleEquipamentChange={handleEquipamentChange}
                        handleEquipDescription={handleEquipDescriptionChange}
                        update={updateCharacterEquipament}
                    />
                    <CharacterInventory
                        itemDescription={characterData.itemDescription}
                        inventory={characterData.item}
                        handleInventoryChange={handleItemChange}
                        handleItemDescription={handleItemDescriptionChange}
                        update={updateCharacterItem}
                    /> */}

                    </div>
                </main>
            
        </StarSky>
    );
}
