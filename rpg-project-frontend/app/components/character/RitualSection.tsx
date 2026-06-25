import { useState } from "react";
import { useSubclasses, useCharacter } from "../../hooks";
import { LucideArrowBigDown, LucideArrowBigUp } from "lucide-react";
import AssignRitualModal from "./dialogs/AssignRitualModal";

export interface RitualItemProps {
    character_id: number;
}

export default function RitualSection(
    { character_id }: RitualItemProps
) {
    const [open, setOpen] =
        useState(false);

    const { data: character } = useCharacter(character_id);
    const { data: subclasses } = useSubclasses();

    return (
        <div className={` transition-all duration-500 mb-6 mt-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
              Rituais
            </h3>
            <div className="flex gap-2">
              <AssignRitualModal character_id={character_id} />
              <button
                onClick={() => setOpen(!open)}
                className="px-3 py-1 cursor-pointer bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
              >
                {open ? <LucideArrowBigUp /> : <LucideArrowBigDown />}
              </button>
            </div>
          </div>
          <div className={`${open ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'} transition-all duration-500`}>
            {character?.character.rituals.length === 0 ? (
              <p className="text-vaccineGray-400">
                Nenhum ritual disponível.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character?.character.rituals.map((ritual) => {
                  const subclass = subclasses?.subclasses.find((sub) => sub.id === ritual.subclass_id);
                  
                  return (<RitualCard key={ritual.id} ritual={ritual} subclass={subclass} />)
                } 
                )}
              </div>
            )}
          </div>

        </div>
    )
        
}

const RitualCard = ({ ritual, subclass }: { ritual: any; subclass: any }) => {
    return (
        <div className="border rounded-md p-4 bg-vaccineGray-50">
            <h4 className="text-lg font-semibold text-vaccinePurple">{ritual.name} <span className="text-sm font-normal text-vaccineGray-400">({subclass ? subclass.name : 'Neutro'})</span></h4>
            <p className="text-vaccineGray-400">{ritual.description}</p>
            <p className="text-vaccineGray-400">Custo de Ocultismo: {ritual.mana_cost}</p>
        </div>
    );
}
