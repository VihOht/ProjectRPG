import type { CharacterClass } from "../../types/character";

interface ClassesTabProps {
    classes: CharacterClass[];
    isLoading: boolean;
    isAdmin: boolean;
    onDeleteClass: (classId: number) => void;
    onDeleteSubclass: (subclassId: number) => void;
    onDeleteAbility: (abilityId: number) => void;
}

export function ClassesTab({
    classes,
    isLoading,
    isAdmin,
    onDeleteClass,
    onDeleteSubclass,
    onDeleteAbility,
}: ClassesTabProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-vaccineBlack">Classes</h2>
                <p className="text-gray-700">
                    Visualização hierárquica de classes, habilidades e subclasses.
                </p>
            </div>

            {isLoading ? (
                <p className="text-gray-600">Carregando classes...</p>
            ) : classes.length === 0 ? (
                <p className="text-gray-600">Nenhuma classe cadastrada.</p>
            ) : (
                <div className="space-y-5">
                    {classes.map((charClass) => (
                        <article key={charClass.id} className="bg-white/80 rounded-md p-4 border border-gray-200">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-2xl font-semibold text-vaccineRed">{charClass.name}</h3>
                                {isAdmin && (
                                    <button
                                        type="button"
                                        onClick={() => onDeleteClass(charClass.id)}
                                        className="rounded-md bg-vaccineRed px-3 py-1 text-sm text-white hover:opacity-90"
                                    >
                                        Excluir classe
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-700 mb-3">{charClass.description}</p>

                            <div className="mb-3">
                                <h4 className="font-semibold text-vaccineBlack">Habilidades da Classe</h4>
                                {charClass.abilities && charClass.abilities.length > 0 ? (
                                    <ul className="space-y-2 pl-2 text-gray-800">
                                        {charClass.abilities.map((ability) => (
                                            <li key={ability.id} className="flex items-start justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
                                                <div>
                                                    <span className="font-semibold">{ability.name}:</span> {ability.description}
                                                </div>
                                                {isAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteAbility(ability.id)}
                                                        className="rounded-md bg-vaccineRed px-3 py-1 text-xs text-white hover:opacity-90"
                                                    >
                                                        Excluir
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600">Sem habilidades de classe.</p>
                                )}
                            </div>

                            <div>
                                <h4 className="font-semibold text-vaccineBlack">Subclasses</h4>
                                {charClass.subclasses && charClass.subclasses.length > 0 ? (
                                    <div className="space-y-3 mt-2">
                                        {charClass.subclasses.map((subclass) => (
                                            <div key={subclass.id} className="border-l-4 border-vaccineRed pl-4 py-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h5 className="font-semibold text-vaccineBlack">{subclass.name}</h5>
                                                    {isAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onDeleteSubclass(subclass.id)}
                                                            className="rounded-md bg-vaccineRed px-3 py-1 text-xs text-white hover:opacity-90"
                                                        >
                                                            Excluir subclasse
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-gray-700">{subclass.description}</p>

                                                <p className="font-medium mt-1">Habilidades da Subclasse</p>
                                                {subclass.abilities && subclass.abilities.length > 0 ? (
                                                    <ul className="space-y-2 pl-2 text-gray-800">
                                                        {subclass.abilities.map((ability) => (
                                                            <li key={ability.id} className="flex items-start justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
                                                                <div>
                                                                    <span className="font-semibold">{ability.name}:</span> {ability.description}
                                                                </div>
                                                                {isAdmin && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => onDeleteAbility(ability.id)}
                                                                        className="rounded-md bg-vaccineRed px-3 py-1 text-xs text-white hover:opacity-90"
                                                                    >
                                                                        Excluir
                                                                    </button>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-600">Sem habilidades de subclasse.</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Sem subclasses.</p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}