import type { AttributeItem, PericiaItem } from "../../types";
import { useAttributes, usePericias, useDeleteAttribute, useDeletePericia } from "../../hooks";
import { useAuthProvider } from "../../providers";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AttributesModal from "../../components/documents/dialogs/AttributesModal";


export function AttributesTab() {

    const { user } = useAuthProvider();
    const [isAdmin, setIsAdmin] = useState(false);

    const { data: attributesData, isLoading } = useAttributes();
    const { data: periciasData } = usePericias();
    const periciasByAttribute = periciasData?.pericias.reduce((acc, pericia) => {
        if (!acc[pericia.attribute_id]) {
            acc[pericia.attribute_id] = [];
        }
        acc[pericia.attribute_id].push(pericia);
        return acc;
    }, {} as Record<string, PericiaItem[]>);
    const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(null);
    const [selectedPericiaId, setSelectedPericiaId] = useState<number | null>(null);
    const [attributes, setAttributes] = useState<AttributeItem[]>([]);
    const {mutate: deleteAttribute} = useDeleteAttribute();
    const {mutate: deletePericia} = useDeletePericia();

    useEffect(() => {
        if (attributesData?.attributes) {
            setAttributes(attributesData.attributes);
        }
    }, [attributesData]);

     const onDeleteAttribute = async (attributeId: number) => {
        try {
            // Ask for confirmation before deleting the attribute            const confirmDelete = window.confirm("Are you sure you want to delete this attribute? This will also delete all associated pericias.");
            
            if (confirm("Tem certeza que deseja excluir este atributo? Isso também excluirá todas as perícias associadas.") && confirm("Você tem realmente certeza? Por Anarion? Ao excluir todos as fichas sofrerão alteração")) {
                await deleteAttribute(attributeId);
                setAttributes((prev) => prev.filter((attr) => attr.id !== attributeId));
                toast.success("Atributo excluído com sucesso!");
            }
        } catch (error) {
            toast.error("Erro ao excluir atributo. Tente novamente.");
        }
    };

    
    const onAttributeClick = (attribute: AttributeItem) => {
        setSelectedPericiaId(null);
        setSelectedAttributeId((prev) => (prev === attribute.id ? null : attribute.id));
    };

    const onPericiaClick = (pericia: PericiaItem) => {
        setSelectedPericiaId((prev) => (prev === pericia.id ? null : pericia.id));
    };

    const onDeletePericia = async (periciaId: number) => {
        try {
            if (confirm("Tem certeza que deseja excluir esta perícia? Isso pode afetar as fichas dos personagens.") && confirm("Você tem realmente certeza? Por Anarion? Ao excluir todos as fichas sofrerão alteração")) {
                await deletePericia(periciaId);
                toast.success("Perícia excluída com sucesso!");
            }
        } catch (error) {
            toast.error("Erro ao excluir perícia. Tente novamente.");
        }
    };

    useEffect(() => {
        setIsAdmin(user?.role === "ADMIN");
    }, [user]);


    if (isLoading) {
        return <p className="text-gray-600">Carregando atributos...</p>;
    }

    if (attributes.length === 0) {
        return <p className="text-gray-600">Nenhum atributo cadastrado.</p>;
    }





    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between" >
                <div>
                    <h2 className="text-2xl font-semibold text-vaccineGray-300">Atributos</h2>
                    <p className="text-vaccineGray-600">
                        Clique no nome de um atributo para ver sua descrição e as perícias ligadas a ele.
                        Clique em uma perícia para ver a descrição dela.
                    </p>
                </div>
                {isAdmin && (
                    <AttributesModal />
                )}
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
                        const attributePericias = periciasByAttribute ? periciasByAttribute[attribute.id] ?? [] : [];

                        return (
                            <div key={attribute.id} className="bg-vaccineGray-1000/20">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onAttributeClick(attribute)}
                                        className={`flex-1 text-left px-3 py-2 border transition-colors ${
                                            isSelected
                                                ? "bg-vaccinePurple text-white border-vaccinePurple"
                                                : "text-vaccineGray-300 border-gray-300 hover:border-vaccinePurple"
                                        }`}
                                    >
                                        {attribute.name}
                                    </button>
                                    {isAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteAttribute(attribute.id)}
                                            className="rounded-md bg-vaccinePurple px-3 py-2 text-sm text-white hover:opacity-90"
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </div>

                                {isSelected && (
                                    <div className="mt-3 space-y-3 pl-2 border-l-4 border-vaccinePurple">
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
                                                                <div className={`items-center gap-2 border border-gray-300/20 rounded-md p-2`}>
                                                                    <div className="flex items-center gap-2"> 
                                                                        <button
                                                                        type="button"
                                                                        onClick={() => onPericiaClick(pericia)}
                                                                        className={`flex-1 px-3 py-2 rounded-md border transition-colors text-left ${
                                                                            periciaSelected
                                                                                ? "bg-vaccinePurple text-white border-vaccinePurple"
                                                                                : "text-gray-300 border-gray-300/20 hover:border-vaccinePurple"
                                                                        }`}
                                                                        >
                                                                            {pericia.name}
                                                                        </button>
                                                                        {isAdmin && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => onDeletePericia(pericia.id)}
                                                                                className="rounded-md bg-vaccinePurple px-3 py-2 text-xs text-white hover:opacity-90"
                                                                            >
                                                                                Excluir
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    {periciaSelected && (
                                                                    <p className="mt-2 text-gray-200 text-sm p-3">
                                                                        {pericia.description}
                                                                    </p>
                                                                )}
                                                                </div>

                                                                
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