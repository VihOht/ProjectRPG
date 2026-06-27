import { useMemo, useState } from "react";
import { useCharacter, useSubclasses, useClassPowers, useAttributePowers, useAttributes, useClass } from "../../hooks";
import type { AbilityItem, ClassPowerItem, SpecialAbilityItem, AttributePowerItem } from "../../types";
import AssignAbilitiesModal from "./dialogs/AssignAbilitiesModal";
import { LucideArrowBigDown } from "lucide-react";
import WizardcraftSection from "./WizardcraftSection";
import RitualSection from "./RitualSection";

interface CharacterAbilitiesProps {
  characterId: number;
}

export function CharacterAbilities({ characterId }: CharacterAbilitiesProps) {
  const { data: characterData, isLoading } = useCharacter(characterId);

  const abilities = useMemo<AbilityItem[]>(() => {
    return characterData?.character.abilities ?? [];
  }, [characterData]);

  const specialAbilities = useMemo<SpecialAbilityItem[]>(() => {
    return characterData?.character.special_abilities ?? [];
  }, [characterData]);

  const [openTabs, setOpenTabs] = useState({
    classPowers: false,
    attributePowers: false,
    abilities: false,
    specialAbilities: false,
  });

  const toggleTab = (tabName: keyof typeof openTabs) => {
    setOpenTabs((prev) => ({
      ...prev,
      [tabName]: !prev[tabName],
    }));
  }

  if (!characterData) {
    return (
      <section className="text-vaccineGray-200 mb-8 text-center">
        <p className="text-vaccineGray-300">Carregando habilidades...</p>
      </section>
    );
  }

  const { data: characterClass } = useClass(characterData.character.charClass);

  const { data: classPowersData } = useClassPowers();

  const { data: attributePowersData } = useAttributePowers();

  const { data: attributesData } = useAttributes();

  const [open, setOpen] = useState(false);

  const attributePowers = useMemo<AttributePowerItem[]>(() => {
    if (!attributePowersData || !characterData) return [];
    return attributePowersData.attribute_powers.filter((power) => characterData.character.attributes.some((attr) => attr.attribute_id === power.attribute_id && attr.value >= power.level_to_unlock));
  }, [attributePowersData, characterData]);

  const classPowers = useMemo(() => {
    if (!classPowersData || !characterData) return [];
    return classPowersData.class_powers.filter((power) => power.class_id === characterData.character.charClass && power.level_to_unlock <= characterData.character.level);
  }, [classPowersData, characterData]);

  const { data: subclassesData } = useSubclasses();

  const getSubclassName = (subclassId: number) => {
    const subclass = subclassesData?.subclasses.find((s) => s.id === subclassId);
    return subclass ? subclass.name : "Desconecido";
  }

  const getAttributeNameFromPower = (power: AttributePowerItem) => {
    const attribute = attributesData?.attributes.find(attr => attr.id === power.attribute_id);
    return attribute ? attribute.name : "Desconecido";
  }

  if (isLoading || !characterData || !classPowersData || !attributePowersData || !attributesData ) {
    return (
      <section className="mb-8">
        <p className="text-vaccineGray-300">Carregando habilidades...</p>
      </section>
    );
  }



  return (
    <section className="mb-8 bg-vaccineBlueTones-900/10 rounded-md p-4">
      <div className="items-center flex justify-between mb-4">
        <h2 onClick={() => {setOpen(!open)}} className="text-3xl cursor-pointer min-w-[80%] font-walthari font-semibold text-vaccineGray-300">
          Habilidades
        </h2>
        <AssignAbilitiesModal characterId={characterId} />
      </div>
      <div className={`transition-all duration-700 ${open ? 'max-h-screen h-full mt-4' : 'max-h-0 overflow-hidden opacity-0'}`}>
        <div className={`space-y-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
              Poderes de Classe
            </h3>
            <button
              onClick={() => toggleTab('classPowers')}
              className="px-3 py-1 cursor-pointer bg-vaccineBlueTones-400 hover:bg-blue-700 text-vaccineBlueTones-100 rounded-md transition"
            >
              <LucideArrowBigDown className={`transition-transform ${openTabs.classPowers ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className={`${openTabs.classPowers ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'} transition-all duration-500`}>
            {classPowers.length === 0 ? (
              <p className="text-vaccineGray-400">
                Nenhum poder de classe disponível.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {classPowers.map((power) => (
                  <ClassPowerCard key={power.id} power={power} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className={`space-y-6 mb-6 transition-all duration-500`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
              Poderes de Atributo
            </h3>
            <button
              onClick={() => toggleTab('attributePowers')}
              className="px-3 py-1 cursor-pointer bg-vaccineBlueTones-400 hover:bg-blue-700 text-vaccineBlueTones-100 rounded-md transition"
            >
              <LucideArrowBigDown className={`transition-transform ${openTabs.attributePowers ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className={`${openTabs.attributePowers ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'} transition-all duration-500`}>
            {attributePowers.length === 0 ? (
              <p className="text-vaccineGray-400">
                Nenhum poder de atributo disponível.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {attributePowers.map((power) => (
                  <AttributePowerCard key={power.id} power={power} attribute_name={getAttributeNameFromPower(power)} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={` transition-all duration-500`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
              Habilidades de Classe
            </h3>
            <button
              onClick={() => toggleTab('abilities')}
              className="px-3 py-1 cursor-pointer bg-vaccineBlueTones-400 hover:bg-blue-700 text-vaccineBlueTones-100 rounded-md transition"
            >
              <LucideArrowBigDown className={`transition-transform ${openTabs.abilities ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className={`${openTabs.abilities ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'} transition-all duration-500`}>
            {abilities.length === 0 ? (
              <p className="text-vaccineGray-400">
                Nenhuma habilidade de classe disponível.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {abilities.map((ability) => (
                  <AbilityCard key={ability.id} ability={ability} subclassName={ability.subclass_id ? getSubclassName(ability.subclass_id) : undefined} />
                ))}
              </div>
            )}
          </div>

        </div>

        {characterClass?.class.has_mana && (
          <WizardcraftSection character_id={characterId} />
        )}

        {characterClass?.class.has_ocultism && (
          <RitualSection character_id={characterId} />
        )}

        <div className={`mt-6 transition-all duration-500`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-trajanPBold text-vaccineGray-300 mb-3">
              Habilidades Especiais
            </h3>
            <button
              onClick={() => toggleTab('specialAbilities')}
              className="px-3 py-1 cursor-pointer bg-vaccineBlueTones-400 hover:bg-blue-700 text-vaccineBlueTones-100 rounded-md transition"
            >
              <LucideArrowBigDown className={`transition-transform ${openTabs.specialAbilities ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className={`${openTabs.specialAbilities ? 'max-h-screen' : 'max-h-0 overflow-hidden opacity-0'} transition-all duration-500`}>
            {specialAbilities.length === 0 ? (
              <p className="text-vaccineGray-400">
                Nenhuma habilidade especial disponível.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {specialAbilities.map((ability) => (
                  <SpecialAbilityCard key={ability.id} ability={ability} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


function AbilityCard({ ability, subclassName }: { ability: AbilityItem; subclassName?: string }) {
  return (
    <article className="rounded-md border border-vaccineGray-300/40 bg-vaccineBlueTones-1000/70 p-4">
      <h4 className="font-trajanPBold text-lg text-vaccineGray-200 break-words">
        {ability.name}
      </h4>
      { subclassName && (
        <p className="text-sm text-vaccinePurple mb-2">
          Subclasse: {subclassName}
        </p>
      )}

      <p className="mt-2 whitespace-pre-line text-vaccineGray-300 break-words">
        {ability.description}
      </p>
    </article>
  );
}

function SpecialAbilityCard({
  ability,
}: {
  ability: SpecialAbilityItem;
}) {
  return (
    <article className="rounded-md border border-vaccinePurple/40 bg-vaccineBlueTones-1000/70 p-4">
      <h4 className="font-trajanPBold text-lg text-vaccineGray-200">
        {ability.name}
      </h4>

      <p className="mt-2 whitespace-pre-line text-vaccineGray-300">
        {ability.description}
      </p>
    </article>
  );
}

function ClassPowerCard({ power }: { power: ClassPowerItem }) {
  return (
    <article className="rounded-md border border-vaccinePurple/40 bg-vaccineBlueTones-1000/70 p-4">
      <h4 className="font-trajanPBold text-lg text-vaccineGray-200">
        {power.name}: {power.level_to_unlock}º nível
      </h4>
      <p className="mt-2 whitespace-pre-line text-vaccineGray-300">
        {power.description}
      </p>
      
    </article>
  );
}

function AttributePowerCard({ power, attribute_name }: { power: AttributePowerItem, attribute_name: string }) {
  return (
    <article className="rounded-md border border-vaccinePurple/40 bg-vaccineBlueTones-1000/70 p-4">
      <h4 className="font-trajanPBold text-lg text-vaccineGray-200">
        {power.name}: {power.level_to_unlock}p em {attribute_name}
      </h4>
      <p className="mt-2 whitespace-pre-line text-vaccineGray-300">
        {power.description}
      </p>
    </article>
  );
}