import { useState } from "react";
import { useCharacter } from "../../hooks";
import { LucideArrowBigDown, LucideArrowBigUp } from "lucide-react";
import AssignWizardcraftModal from "./dialogs/AssignWizardcraftModal";

export interface WizardcraftItemProps {
    character_id: number;
}

export default function WizardcraftSection(
    { character_id }: WizardcraftItemProps
) {
    const [open, setOpen] =
        useState(false);

    const { data: character } = useCharacter(character_id);


    return (
        <div className={` transition-all duration-500 mb-6 mt-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
              Feitiços
            </h3>
            <div className="flex gap-2">  
              <AssignWizardcraftModal character_id={character_id} />
              <button
                onClick={() => setOpen(!open)}
                className="px-3 py-1 cursor-pointer bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
              >
                {open ? <LucideArrowBigUp /> : <LucideArrowBigDown />}
              </button>
            </div>
          </div>
          <div className={`${open ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'} transition-all duration-500`}>
            {character?.character.wizardcrafts.length === 0 ? (
              <p className="text-vaccineGray-400">
                Nenhum feitiço disponível.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character?.character.wizardcrafts.map((wizardcraft) => (
                  <WizardcraftCard key={wizardcraft.id} wizardcraft={wizardcraft} />
                ))}
              </div>
            )}
          </div>

        </div>
    )
        
}

const WizardcraftCard = ({ wizardcraft }: { wizardcraft: any }) => {
    return (
        <div className="border rounded-md p-4 bg-vaccineGray-50">
            <h4 className="text-lg font-semibold text-vaccinePurple">{wizardcraft.name}</h4>
            <p className="text-vaccineGray-400">{wizardcraft.description}</p>
            <p className="text-vaccineGray-400">Custo de Mana: {wizardcraft.mana_cost}</p>
        </div>
    );
}
