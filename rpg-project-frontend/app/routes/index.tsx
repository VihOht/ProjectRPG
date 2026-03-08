import { Card } from "../components/Card";
import { useAuthProvider } from "../providers";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useGetCharacters, useCreateCharacter, useGetUsers } from "../hooks";
import { Header } from "../components/Header";


export default function Index() {
    const { isAuthenticated, user } = useAuthProvider();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login');
        }
    }, [isAuthenticated, navigate]);


    const { mutate: createCharacter } = useCreateCharacter()
    const { data: characterData, isLoading: characterLoading } = useGetCharacters();
    const isAdmin = user?.role === "ADMIN";
    const { data: usersData } = useGetUsers(isAdmin);
    const [selectedUserId, setSelectedUserId] = useState<string>("all");

    useEffect(() => {
        if (!isAdmin && user?.id) {
            setSelectedUserId(String(user.id));
        }
    }, [isAdmin, user?.id]);

    const visibleCharacters = useMemo(() => {
        const chars = characterData?.characters ?? [];
        if (!isAdmin || selectedUserId === "all") {
            return chars;
        }
        const userId = Number(selectedUserId);
        if (Number.isNaN(userId)) {
            return chars;
        }
        return chars.filter((character) => character.own === userId);
    }, [characterData?.characters, isAdmin, selectedUserId]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500">Redirecting to login...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500">Redirecting to home...</p>
        </div>
    }
    return (
        <div className="min-h-screen bg-gradient-to-r from-vaccineGray-500 to-vaccineGray-600 flex flex-col">
            {/* Header */}
            <Header>
                <Link
                    to="/classes"
                    className="px-3 py-2 bg-vaccineGray-300 rounded-md hover:bg-vaccineGray-400 transition-colors"
                >
                    Classes
                </Link>
                <button 
                    onClick={() => {
                        createCharacter(
                            { 
                                name: "Novo Personagem",
                            },
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
                
            {/* Main Content */}
            <main className="flex-1 flex font-vollkorn items-center justify-center p-8">
                {/* Centered Container */}
                <div className="bg-vaccineGray-300 text-shadow-lg rounded-lg shadow-lg p-8 max-w-6xl w-full mx-auto">
                    {/* Title */}
                    <h3 className="text-4xl w-full text-center font-bold mb-6 text-vaccineRed">Fichas</h3>

                    {isAdmin && (
                        <div className="mb-4 flex items-center gap-3">
                            <label htmlFor="user-filter" className="font-semibold text-vaccineBlack">Usuário:</label>
                            <select
                                id="user-filter"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="bg-white border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="all">Todos</option>
                                {(usersData?.users ?? []).map((u) => (
                                    <option key={u.id} value={String(u.id)}>
                                        {u.username} ({u.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Cards Container */}
                    <div className="flex flex-wrap gap-4">
                        {/* Sample RPG Sheet Cards */}
                        {characterLoading ? (
                            <p className="text-center w-full text-gray-500">Loading characters...</p>
                        ) : visibleCharacters.length > 0 ? (
                            visibleCharacters.map((character) => (
                                <Card
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
            </main>
        </div>
    )
}  