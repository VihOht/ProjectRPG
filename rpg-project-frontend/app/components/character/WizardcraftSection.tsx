import { useCharacter } from "../../hooks";
import AssignWizardcraftModal from "./dialogs/AssignWizardcraftModal";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export interface WizardcraftItemProps {
    character_id: number;
}

export default function WizardcraftSection(
    { character_id }: WizardcraftItemProps
) {

    const { data: character } = useCharacter(character_id);


    return (
        <SubsectionItem title="Feitiços" character_id={character_id}>
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
        </SubsectionItem>

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


function SubsectionItem({ title, children, character_id }: { title: string; children: React.ReactNode; character_id: number }) {
  return (
    <AccordionItem value={title} className="mb-8 bg-vaccineBlueTones-900/10 md:p-4 p-2 rounded-md">
      <div className="flex justify-between items-center">
        <AccordionTrigger>
          <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
            {title}
          </h3>
        </AccordionTrigger>
        <AssignWizardcraftModal character_id={character_id} />
        
      </div>
      <AccordionContent>
          { children}
      </AccordionContent>
    </AccordionItem>
  );
}