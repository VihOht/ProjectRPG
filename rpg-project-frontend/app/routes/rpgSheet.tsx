import { StarSky } from "../components/StarSky";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CharacterInformation } from "../components/character/Informations";
import { CharacterStats } from "../components/character/Stats";
import { CharacterAttributes } from "../components/character/Atributes";
import { CharacterBackstory } from "../components/character/Backstory";
import { CharacterPhysicaldesc } from "../components/character/PhysicalDesc";
import { CharacterPsycDesc } from "../components/character/PsycDesc";
import type { UpdateCharacterGeneralRequest } from "../types";
import { useDeleteCharacter, useCharacter, useToggleCharacterActive, useTransferCharacterOwnership, useReturnCharacterToAdmin, useUpdateCharacterGeneral } from "../hooks/useCharacters";
import { useGetUserById, useGetUsers } from "../hooks/useAuth";
import { Header } from "../components/Header";
import { useAuthProvider } from "../providers";

export default function RpgSheet() {
    const navigate = useNavigate();
    const { user } = useAuthProvider();
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [transferTargetId, setTransferTargetId] = useState<string>("");
    const { id } = useParams();
    const characterId = useMemo(() => {
        if (!id) return null;
        const parsed = Number(id);
        return Number.isNaN(parsed) ? null : parsed;
    }, [id]);

    const { data: characterData } = useCharacter(characterId!);

   
    const { mutate: deleteCharacter } = useDeleteCharacter();
    const { mutate: toggleActive, isPending: isTogglingActive } = useToggleCharacterActive(characterId!);
    const { data: ownerData } = useGetUserById(characterData?.character.own ?? -1, !!characterData?.character.own);
    const { mutate: transferOwnership, isPending: isTransferring } = useTransferCharacterOwnership(characterId!);
    const { mutate: returnToAdmin, isPending: isReturning } = useReturnCharacterToAdmin(characterId!);
    const { data: usersData } = useGetUsers();
    const { mutate: updateGeneral } = useUpdateCharacterGeneral(characterId!);
    const [characterGeneral, setCharacterGeneral] = useState({
        UpdateCharacterGeneralRequest: {
            name: characterData?.character.name ?? "",
        }
    });
    const isAdmin = user?.role === "ADMIN";


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

    const handleInfoChange = (field: "nome" | "nivel", value: string) => {
        if (!characterData) return;
        const updatedCharacter = {
            ...characterData.character,
            name: field === "nome" ? value : characterData.character.name,
            level: field === "nivel" ? Number(value) : characterData.character.level,
        };
        setCharacterGeneral({
            UpdateCharacterGeneralRequest: {
                name: characterData.character.name,
            }
        });
        if (isEditingHeader) {
            updateGeneral({
                name: updatedCharacter.name,
            });
        }
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
                <main className="flex-1  p-8 text-sm text-vaccineBlack">
                    <div className="max-w-5xl mx-auto border-1 border-vaccineGray-300/50  rounded-lg shadow-lg p-8">
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
                                }} 
                                className="absolute top-0 right-0 px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Salvar
                            </button>
                        )}
                        
                        {isEditingHeader ? (
                            <div className="flex flex-col items-center gap-4">
                                <input
                                    type="text"
                                    value={characterData?.character.name ?? ""}
                                    onChange={(e) => handleInfoChange("nome", e.target.value)}
                                    className="text-4xl font-bold text-vaccineGray-900 text-center bg-vaccineGray-300 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccinePurple"
                                    placeholder="Nome do Personagem"
                                    autoFocus
                                />
                                <div className="flex items-center justify-center gap-2">
                                    <label className="text-lg font-medium text-white">Nível:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={characterData?.character.level ?? ""}
                                        onChange={(e) => handleInfoChange("nivel", e.target.value)}
                                        className="text-2xl font-bold text-vaccineGray-900 text-center bg-vaccineGray-300 px-3 py-1 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-vaccinePurple w-20"
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
                            </>
                        )}
                    </div> 
                    
                    <CharacterAttributes characterId={characterId} />



                    </div>
                </main>
            
        </StarSky>
    );
}