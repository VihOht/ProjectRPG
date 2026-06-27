import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

import {
    useCharacter,
    useUpdateCharacterDescription,
} from "../../hooks";
import { LucideArrowBigDown } from "lucide-react";

interface CharacterLoreProps {
    characterId: number;
}

type DescriptionForm = {
    backstory: string;
    physical_description: string;
    psychological_description: string;
};

export function CharacterLore({
    characterId,
}: CharacterLoreProps) {
    const { data: characterData } = useCharacter(characterId);

    const { mutate: updateDescription } = useUpdateCharacterDescription(characterId);

     const [isEditing, setIsEditing] = useState(false);
     

    const [open, setOpen] = useState(false);
    const [openTabs, setOpenTabs] = useState({
        physical: false,
        psychological: false,
        backstory: false,
    });

    const [form, setForm] = 
        useState<DescriptionForm | null>(null);

    useEffect(() => {
        if (!characterData?.character) return;

        setForm({
            backstory: characterData.character.backstory || "",
            physical_description: characterData.character.physical_description || "",
            psychological_description: characterData.character.psychological_description || "",
        });
        
    }, [characterData]);


    function handleChange(field: keyof DescriptionForm, value: string) {
        setForm((current) => {
            if (!current) return current;
            return {
                ...current,
                [field]: value,
            };
        });
    }

    function handleSave() {
        if (!form) return;
        updateDescription(form);
        setIsEditing(false);
    }

    if (!form)  {
        return (
            <div className="w-full p-4 bg-vaccineBlueTones-900 rounded-md text-center text-vaccineGray-300">
                Carregando...
            </div>  
        );
    };

    return (
        <section className="mb-8 bg-vaccineBlueTones-900/10 p-4 rounded-md">
            <div className="items-center flex justify-between">
                <h2 onClick={() => setOpen(!open)} className="text-3xl cursor-pointer min-w-[80%] font-walthari font-semibold mb-4 text-vaccineGray-300">
                    Lore
                </h2>

                <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        if (isEditing) handleSave();
                    }}
                    className="mb-4 px-4 py-2 bg-vaccineBlueTones-400  cursor-pointer rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100"
                    disabled={!open && !isEditing}
                >
                    {isEditing ? "Salvar" : <FiEdit className="inline-block mr-1" />}
                </button>
            </div>
            <div className={`overflow-x-auto transition-all duration-700 ${open ? 'max-h-screen mt-4' : 'max-h-0 overflow-hidden opacity-0'}`}>
                <div className="items-center flex justify-between mb-2">
                    <h2 className="text-2xl font-walthari font-semibold mb-2 text-vaccineGray-300">
                        Descrição Física
                    </h2>
                    <button
                        onClick={() => setOpenTabs((current) => ({ ...current, physical: !current.physical }))}
                        className="mb-2 px-3 py-1 bg-vaccineBlueTones-400 rounded-md hover:bg-blue-700 transition-colors text-vaccineBlueTones-100"
                    >
                        <LucideArrowBigDown className={`transition-transform ${openTabs.physical ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <div className={`mb-4 transition-all duration-300 ${openTabs.physical ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'}`}>
                    {isEditing ? (
                        <>
                            
                            <textarea
                                value={form.physical_description}
                                onChange={(e) => handleChange('physical_description', e.target.value)}
                                className="w-full min-h-40 rounded-md border border-vaccineGray-300 bg-vaccineBlueTones-900 p-4 text-white placeholder:text-vaccineBlueTones-300"
                                placeholder="Digite a descrição física do personagem..."
                            />
                        </>
                    ) : (
                        <p className="text-vaccineGray-300 whitespace-pre-line">
                            {form.physical_description || "Nenhuma descrição física adicionada."}
                        </p>
                    )}
                </div>
                <div className="items-center flex justify-between mb-2">
                    <h2 className="text-2xl font-walthari font-semibold mt-6 mb-2 text-vaccineGray-300">
                        Aparência
                    </h2>
                    <button
                        onClick={() => setOpenTabs((current) => ({ ...current, psychological: !current.psychological }))}
                        className="mb-2 px-3 py-1 bg-vaccineBlueTones-400 hover:bg-blue-700 rounded-md transition-colors text-vaccineBlueTones-100"
                    >
                        <LucideArrowBigDown className={`transition-transform ${openTabs.psychological ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <div className={`mb-4 transition-all duration-300 ${openTabs.psychological ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'}`}>
                    {isEditing ? (
                        <>
                            
                            <textarea
                                value={form.psychological_description}
                                onChange={(e) => handleChange('psychological_description', e.target.value)}
                                className="w-full min-h-40 rounded-md border border-vaccineGray-300 bg-vaccineBlueTones-900 p-4 text-white placeholder:text-vaccineBlueTones-300"
                                placeholder="Digite a descrição psicológica do personagem..."
                            />
                        </>
                    ) : (
                        <p className="text-vaccineGray-300 whitespace-pre-line">
                            {form.psychological_description || "Nenhuma descrição psicológica adicionada."}
                        </p>
                    )}
                </div>
                <div className="items-center flex justify-between mb-2">
                    <h2 className="text-2xl font-walthari mt-6 font-semibold mb-2 text-vaccineGray-300">
                        História
                    </h2>
                    <button
                        onClick={() => setOpenTabs((current) => ({ ...current, backstory: !current.backstory }))}
                        className="mb-2 px-3 py-1 bg-vaccineBlueTones-400 hover:bg-blue-700 rounded-md transition-colors text-vaccineBlueTones-100"
                    >
                        <LucideArrowBigDown className={`transition-transform ${openTabs.backstory ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <div className={`mb-4 transition-all duration-300 ${openTabs.backstory ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'}`}>
                    {isEditing ? (
                        <textarea
                            value={form.backstory}
                            onChange={(e) => handleChange('backstory', e.target.value)}
                            className="w-full min-h-40 rounded-md border border-vaccineGray-300 bg-vaccineBlueTones-900 p-4 text-white placeholder:text-vaccineBlueTones-300"
                            placeholder="Digite a história do personagem..."
                        />
                    ) : (
                        <p className="w-full min-h-40 text-vaccineGray-300 whitespace-pre-line">
                            {form.backstory || "Nenhuma história adicionada."}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}