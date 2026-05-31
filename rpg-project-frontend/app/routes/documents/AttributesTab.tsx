import type { AttributeDefinition, PericiaDefinition } from "../../types/character";

interface AttributesTabProps {
    attributes: AttributeDefinition[];
    periciasByAttribute: Record<number, PericiaDefinition[]>;
    isLoading: boolean;
    selectedAttributeId: number | null;
    selectedPericiaId: number | null;
    onAttributeClick: (attribute: AttributeDefinition) => void;
    onPericiaClick: (pericia: PericiaDefinition) => void;
    isAdmin: boolean;
    onDeleteAttribute: (attributeId: number) => void;
    onDeletePericia: (periciaId: number) => void;
}

export function AttributesTab({
    attributes,
    periciasByAttribute,
    isLoading,
    selectedAttributeId,
    selectedPericiaId,
    onAttributeClick,
    onPericiaClick,
    isAdmin,
    onDeleteAttribute,
    onDeletePericia,
}: AttributesTabProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-vaccineGray-300">Atributos</h2>
                <p className="text-vaccineGray-600">
                    Clique no nome de um atributo para ver sua descrição e as perícias ligadas a ele.
                    Clique em uma perícia para ver a descrição dela.
                </p>
            </div>

            <div className="">
                <h3 className="text-lg font-semibold text-vaccineBlack mb-3"></h3>
                {isLoading ? (
                    <p className="text-gray-600">Carregando atributos...</p>
                ) : attributes.length === 0 ? (
                    <p className="text-gray-600">Nenhum atributo cadastrado.</p>
                ) : (
                   <>
                    {attributes.map((attribute) => {
                        const isSelected = selectedAttributeId === attribute.id;
                        const attributePericias = periciasByAttribute[attribute.id] ?? [];

                        return (
                            <div key={attribute.id} className=" ">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onAttributeClick(attribute)}
                                        className={`flex-1 text-left px-3 py-2 border transition-colors ${
                                            isSelected
                                                ? "bg-vaccineRed text-white border-vaccineRed"
                                                : "text-vaccineGray-300 border-gray-300 hover:border-vaccineRed"
                                        }`}
                                    >
                                        {attribute.name}
                                    </button>
                                    {isAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteAttribute(attribute.id)}
                                            className="rounded-md bg-vaccineRed px-3 py-2 text-sm text-white hover:opacity-90"
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </div>

                                {isSelected && (
                                    <div className="mt-3 space-y-3 pl-2 border-l-4 border-vaccineRed">
                                        <div>
                                            <p className="text-gray-300">{attribute.description}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-vaccineBlack mb-2">
                                                Perícias disponíveis
                                            </h4>
                                            {attributePericias.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {attributePericias.map((pericia) => {
                                                        const periciaSelected = selectedPericiaId === pericia.id;

                                                        return (
                                                            <div key={pericia.id} className="w-full">
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => onPericiaClick(pericia)}
                                                                        className={`flex-1 px-3 py-2 rounded-md border transition-colors text-left ${
                                                                            periciaSelected
                                                                                ? "bg-vaccineRed text-white border-vaccineRed"
                                                                                : "bg-white text-vaccineBlack border-gray-300 hover:border-vaccineRed"
                                                                        }`}
                                                                    >
                                                                        {pericia.name}
                                                                    </button>
                                                                    {isAdmin && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => onDeletePericia(pericia.id)}
                                                                            className="rounded-md bg-vaccineRed px-3 py-2 text-xs text-white hover:opacity-90"
                                                                        >
                                                                            Excluir
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {periciaSelected && (
                                                                    <p className="mt-2 text-gray-700 text-sm bg-gray-50 border border-gray-200 rounded-md p-3">
                                                                        {pericia.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-gray-600">Nenhuma perícia associada a este atributo.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                   </>
                )}
            </div>
        </div>
    );
}