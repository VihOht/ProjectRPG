import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

import {
    useCharacter,
    useUpdateCharacterDescription,
} from "../../hooks";
import { SheetSection } from "./SheetSection";
import { AccordionContent, AccordionTrigger, AccordionItem, Accordion } from "../ui/accordion";


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
        <SheetSection 
            title="Lore" 
            actions={
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
            } 
            onOpenChange={(open) => setOpen(open)}>
                <Accordion type="multiple" className={`w-full `}>
                    <SubsectionItem title="Descrição Física">
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
                    </SubsectionItem>
                    <SubsectionItem title="Descrição Psicológica">
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
                    </SubsectionItem>
                    <SubsectionItem title="História">
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
                    </SubsectionItem>
                </Accordion>
        </SheetSection>
    );
}


function SubsectionItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={title} className="mb-8 bg-vaccineBlueTones-900/10 p-4 rounded-md">
      <div className="flex justify-between items-center">
        <AccordionTrigger>
          <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
            {title}
          </h3>
        </AccordionTrigger>
        
      </div>
      <AccordionContent>
          { children}
      </AccordionContent>
    </AccordionItem>
  );
}