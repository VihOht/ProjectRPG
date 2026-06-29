
import { useSubclasses, useCharacter } from "../../hooks";
import AssignRitualModal from "./dialogs/AssignRitualModal";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export interface RitualItemProps {
    character_id: number;
}

export default function RitualSection(
    { character_id }: RitualItemProps
) {

    const { data: character } = useCharacter(character_id);
    const { data: subclasses } = useSubclasses();

    return (
        <SubsectionItem title="Rituais" character_id={character_id}>
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
        </SubsectionItem>
    )
        
}

const RitualCard = ({ ritual, subclass }: { ritual: any; subclass: any }) => {
    return (
        <div className="border rounded-md p-4 bg-vaccineGray-50">
            <h4 className="text-lg font-semibold text-vaccinePurple">{ritual.name} <span className="text-sm font-normal text-vaccineGray-400">({subclass ? subclass.name : 'Neutro'})</span></h4>
            <p className="text-vaccineGray-400">{ritual.description}</p>
            <p className="text-vaccineGray-400">Custo de Ocultismo: {ritual.ocultism_cost}</p>
        </div>
    );
}

function SubsectionItem({ title, children, character_id }: { title: string; children: React.ReactNode; character_id: number }) {
  return (
    <AccordionItem value={title} className="mb-8 bg-vaccineBlueTones-900/10 p-4 rounded-md">
      <div className="flex justify-between items-center">
        <AccordionTrigger>
          <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
            {title}
          </h3>
        </AccordionTrigger>
        <AssignRitualModal character_id={character_id} />
        
      </div>
      <AccordionContent>
          { children}
      </AccordionContent>
    </AccordionItem>
  );
}