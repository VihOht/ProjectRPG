import { Card } from "../components/Card";
import { useAuthProvider } from "../providers";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useGetCharacters, useCreateCharacter } from "../hooks";
import { Header } from "../components/Header";


export default function Index() {
    const { isAuthenticated } = useAuthProvider();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login');
        }
    }, [isAuthenticated, navigate]);


    const { mutate: createCharacter } = useCreateCharacter()
    const { data: characterData, isLoading: characterLoading } = useGetCharacters();

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

                    {/* Cards Container */}
                    <div className="flex flex-wrap gap-4">
                        {/* Sample RPG Sheet Cards */}
                        {characterLoading ? (
                            <p className="text-center w-full text-gray-500">Loading characters...</p>
                        ) : characterData && characterData.characters.length > 0 ? (
                            characterData.characters.map((character) => (
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