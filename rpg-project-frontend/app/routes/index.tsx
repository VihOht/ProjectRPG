import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { useCreateCharacter, useGetCharacters, useGetUsers } from "../hooks";
import { useAuthProvider } from "../providers";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";

export default function Index() {
    const { isAuthenticated, user } = useAuthProvider();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth/login");
        }
    }, [isAuthenticated, navigate]);

    const { mutate: createCharacter } = useCreateCharacter();
    const { data: characterData, isLoading: characterLoading } = useGetCharacters();
    const { data: usersData } = useGetUsers(user?.role === "ADMIN");
    const isAdmin = user?.role === "ADMIN";

    const characters = characterData?.characters ?? [];
    const playerCharacters = useMemo(() => characters.filter((character) => character.is_player), [characters]);
    const npcCharacters = useMemo(() => characters.filter((character) => !character.is_player), [characters]);
    
    const userMap = useMemo(() => {
        const map = new Map<number, string>();
        usersData?.users.forEach((u) => {
            map.set(u.id, u.username);
        });
        return map;
    }, [usersData?.users]);
    
    const getOwnerName = (ownerId: number) => {
        return userMap.get(ownerId) ?? `Usuário #${ownerId}`;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-vaccineGray-500 to-vaccineGray-600 flex flex-col">
            <Header>
                <Link
                    to="/documents"
                    className="px-3 py-2 bg-vaccineGray-300 rounded-md hover:bg-vaccineGray-400 transition-colors"
                >
                    Documentos
                </Link>
                <button
                    onClick={() => {
                        createCharacter(
                            { name: "Novo Personagem" },
                            {
                                onSuccess: (data) => {
                                    navigate(`/ficha/${data.character.id}`);
                                },
                            }
                        );
                    }}
                    className="px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Nova Ficha
                </button>
            </Header>

            <main className="flex-1 flex font-vollkorn items-center justify-center p-8">
                <div className="bg-vaccineGray-300 text-shadow-lg rounded-lg shadow-lg p-8 max-w-6xl w-full mx-auto">
                    <h3 className="text-4xl w-full text-center font-bold mb-6 text-vaccineRed">Fichas</h3>

                    {characterLoading ? (
                        <p className="text-center w-full text-gray-500">Loading characters...</p>
                    ) : isAdmin ? (
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-2xl font-bold mb-3 text-vaccineBlack">Players</h4>
                                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-vaccineGray-400 text-vaccineBlack">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Nome</th>
                                                <th className="px-4 py-3 text-left">Dono</th>
                                                <th className="px-4 py-3 text-left">Nível</th>
                                                <th className="px-4 py-3 text-left">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {playerCharacters.length > 0 ? (
                                                playerCharacters.map((character) => (
                                                    <tr key={character.id} className="border-t border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-semibold text-vaccineBlack">{character.name}</td>
                                                        <td className="px-4 py-3 text-vaccineBlack">{getOwnerName(character.own)}</td>
                                                        <td className="px-4 py-3 text-vaccineBlack">{character.level}</td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() => navigate(`/ficha/${character.id}`)}
                                                                className="px-3 py-1.5 rounded-md bg-vaccineRed text-white hover:bg-red-700 transition-colors"
                                                            >
                                                                Abrir
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="px-4 py-6 text-center text-gray-500" colSpan={3}>
                                                        No players found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-2xl font-bold mb-3 text-vaccineBlack">NPCs</h4>
                                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
                                    <table className="w-full border-collapse">
                                        <thead className="bg-vaccineGray-400 text-vaccineBlack">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Nome</th>
                                                <th className="px-4 py-3 text-left">Nível</th>
                                                <th className="px-4 py-3 text-left">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {npcCharacters.length > 0 ? (
                                                npcCharacters.map((character) => (
                                                    <tr key={character.id} className="border-t border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-semibold text-vaccineBlack">{character.name}</td>
                                                        <td className="px-4 py-3 text-vaccineBlack">{character.level}</td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() => navigate(`/ficha/${character.id}`)}
                                                                className="px-3 py-1.5 rounded-md bg-vaccineRed text-white hover:bg-red-700 transition-colors"
                                                            >
                                                                Abrir
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="px-4 py-6 text-center text-gray-500" colSpan={3}>
                                                        No NPCs found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-2xl font-bold mb-3 text-vaccineBlack">Fichas</h4>
                            <div className="flex flex-wrap gap-4">
                                {characters.length > 0 ? (
                                    characters.map((character) => (
                                        <Card
                                            key={character.id}
                                            id={character.id}
                                            title={character.name}
                                            description={`Level ${character.level}`}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center w-full text-gray-500">No characters found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
