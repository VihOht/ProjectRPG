import { useState } from "react";
import { FiEdit } from "react-icons/fi";

interface CharacterBackstoryProps {
    backstory: string;
    handleBackstoryChange: (value: string) => void;
    update: () => void;
}

export function CharacterBackstory({
    backstory,
    handleBackstoryChange,
    update,
}: CharacterBackstoryProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <section className="mb-8">
            <div className="items-center flex justify-between mb-4">
                <h2 className="text-3xl font-walthari font-semibold mb-4 text-vaccineGray-300">
                    História
                </h2>

                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        if (isEditing) update();
                    }}
                    className="mb-4 px-4 py-2 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100"
                >
                    {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                </button>
            </div>

            {isEditing ? (
                <textarea
                    value={backstory}
                    onChange={(e) => handleBackstoryChange(e.target.value)}
                    className="w-full min-h-40 rounded-md border border-vaccineGray-300 bg-vaccineBlueTones-900 p-4 text-white"
                    placeholder="Digite a história do personagem..."
                />
            ) : (
                <p className="text-vaccineGray-300 whitespace-pre-line">
                    {backstory || "Nenhuma história adicionada."}
                </p>
            )}
        </section>
    );
}