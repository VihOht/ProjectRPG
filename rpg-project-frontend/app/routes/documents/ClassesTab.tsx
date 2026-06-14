import { useEffect, useState } from "react";
import { useClasses, useDeleteClass, useDeleteAbility, useDeleteClassPower, useDeleteSubclass } from "../../hooks";
import { useAuthProvider } from "../../providers";
import type { ClassItem } from "../../types";
import toast from "react-hot-toast";
import ClassModal from "../../components/documents/dialogs/ClassModal";


export function ClassesTab() {

    const { user } = useAuthProvider();
    const { data: classesData, isLoading } = useClasses();
    const { mutate: deleteClassService } = useDeleteClass();
    const { mutate: deleteAbilityService } = useDeleteAbility();
    const { mutate: deleteSubclassService } = useDeleteSubclass();
    const { mutate: deleteClassPowerService } = useDeleteClassPower();
    const [isAdmin, setIsAdmin] = useState(false);
    const [classes, setClasses] = useState<ClassItem[]>([]);

    useEffect(() => {
        if (classesData && classesData.classes) {
            setClasses(classesData.classes);
        }
    }, [classesData]);

    useEffect(() => {
        if (!user) return;
        setIsAdmin(user.role === "ADMIN");
    }, [user]);



    if (isLoading) {
        return (
            <p className="text-gray-600">Carregando classes...</p>
        );
    }
    
    
    if (!user) {
        return (
            <p className="text-gray-600">Usuário não autenticado.</p>
        );
    }

    

    const onDeleteClass = async (classId: number) => {
        if (confirm("Tem certeza que deseja excluir esta classe? Esta ação não pode ser desfeita.")) {
            try {
                await deleteClassService(classId);
                toast.success("Classe excluída com sucesso.");
            } catch (error) {
                console.error("Erro ao excluir classe:", error);
                toast.error("Ocorreu um erro ao excluir a classe. Por favor, tente novamente.");
            }
        }
    };


    const onDeleteSubclass = async (subclassId: number) => {
        if (confirm("Tem certeza que deseja excluir esta subclasse? Esta ação não pode ser desfeita.")) {
            try { 
                await deleteSubclassService(subclassId);
                toast.success("Subclasse excluída com sucesso.");
            } catch (error) {
                console.error("Erro ao excluir subclasse:", error);
                toast.error("Ocorreu um erro ao excluir a subclasse. Por favor, tente novamente.");
            }
        }
    }

    const onDeleteAbility = async (abilityId: number) => {
        if (confirm("Tem certeza que deseja excluir esta habilidade? Esta ação não pode ser desfeita.")) {
            try {
                await deleteAbilityService(abilityId);
                toast.success("Habilidade excluída com sucesso.");
            } catch (error) {
                console.error("Erro ao excluir habilidade:", error);
                toast.error("Ocorreu um erro ao excluir a habilidade. Por favor, tente novamente.");
            }
        }
    }

    const onDeleteClassPower = async (powerId: number) => {
        if (confirm("Tem certeza que deseja excluir este poder de classe? Esta ação não pode ser desfeita.")) {
            try { 
                await deleteClassPowerService(powerId);
                toast.success("Poder de classe excluído com sucesso.");
            } catch (error) {
                console.error("Erro ao excluir poder de classe:", error);
                toast.error("Ocorreu um erro ao excluir o poder de classe. Por favor, tente novamente.");
            }
        }
    }




    return (
        <div className="w-full space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-vaccineGray-300">Classes</h2>
                    <p className="text-vaccineGray-600">
                        Visualização hierárquica de classes, habilidades e subclasses.
                    </p>
                </div>
                {isAdmin && (
                    <ClassModal />
                )}
            </div>

            {isLoading ? (
                <p className="text-gray-600">Carregando classes...</p>
            ) : classes.length === 0 ? (
                <p className="text-gray-600">Nenhuma classe cadastrada.</p>
            ) : (
                <div className="space-y-5 w-full">
                    {classes.map((charClass) => (
                        <article key={charClass.id} className="bg-vaccineBlueTones-1000/20 rounded-md p-4 border border-vaccineGray-200/20 border-1">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-2xl font-semibold text-vaccinePurple">{charClass.name}</h3>
                                {isAdmin && (
                                    <button
                                        type="button"
                                        onClick={() => onDeleteClass(charClass.id)}
                                        className="rounded-md bg-vaccinePurple px-3 py-1 text-sm text-white hover:opacity-90"
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                            <p className="text-vaccineGray-400">{charClass.description}</p>
                            <div className="flex gap-4 mt-4 flex-wrap">
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-1 text-sm text-gray-300">
                                        Vida Base:
                                    </label>
                                    <span className="w-10 text-center px-2 py-1 bg-vaccineGray-800/20 border border-gray-300/20 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white">
                                        {charClass.base_life}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-1 text-sm text-gray-300">
                                        Defesa Base:
                                    </label>
                                    <span className="w-10 text-center px-2 py-1 bg-vaccineGray-800/20 border border-gray-300/20 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white">
                                        {charClass.base_defense}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <label className="flex items-center gap-1 text-sm text-gray-300">
                                        Sanidade Base:
                                    </label>
                                    <span className="w-10 text-center px-2 py-1 bg-vaccineGray-800/20 border border-gray-300/20 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white">
                                        {charClass.base_sanity}
                                    </span>
                                </div>
                                {charClass.has_mana && (
                                    <div className="flex gap-2">
                                        <label className="flex items-center gap-1 text-sm text-gray-300">
                                            Mana Base:
                                        </label>
                                        <span className="w-10 text-center px-2 py-1 bg-vaccineGray-800/20 border border-gray-300/20 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white">
                                            {charClass.base_mana}
                                        </span>
                                    </div>
                                )}
                                {charClass.has_ocultism && (
                                    <div className="flex gap-2">
                                        <label className="flex items-center gap-1 text-sm text-gray-300">
                                            Ocultismo Base:
                                        </label>
                                        <span className="w-10 text-center px-2 py-1 bg-vaccineGray-800/20 border border-gray-300/20 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white">
                                            {charClass.base_ocultism}
                                        </span>
                                    </div>
                                )}
                            </div>


                            <div className="mb-3 mt-4">
                                <h4 className="font-semibold text-vaccineGray-300 mt-2">Habilidades da Classe</h4>
                                {charClass.abilities && charClass.abilities.length > 0 ? (
                                    <ul className="space-y-2 pl-2 text-vaccineGray-800">
                                        {charClass.abilities.map((ability) => ( ability.class_id && !ability.subclass_id) && (
                                            <li key={ability.id} className="flex text-vaccineGray-400 items-start justify-between gap-3 rounded-md border border-vaccineGray-200/20 px-3 py-2">
                                                <div>
                                                    <span className="font-semibold">{ability.name}:</span> {ability.description}
                                                </div>
                                                {isAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteAbility(ability.id)}
                                                        className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
                                                    >
                                                        X
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-vaccineGray-600">Sem habilidades de classe.</p>
                                )}
                            </div>

                            <div className="mb-3">
                                <h4 className="font-semibold text-vaccineGray-300">Poderes de Classe</h4>
                                {charClass.classPowers && charClass.classPowers.length > 0 ? (
                                    <ul className="space-y-2 pl-2 text-vaccineGray-800">
                                        {charClass.classPowers.map((power) => (
                                            <li key={power.id} className="flex items-start text-vaccineGray-400 justify-between gap-3 rounded-md border border-vaccineGray-200/20 px-3 py-2">
                                                <div>
                                                    <span className="font-semibold">{power.name}:</span> {power.description}

                                                </div>
                                                {isAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteClassPower(power.id)}
                                                        className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
                                                    >
                                                        X
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-vaccineGray-600">Sem poderes de classe.</p>
                                )}
                            </div>

                            <div>
                                <h4 className="font-semibold text-vaccineGray-300">Subclasses</h4>
                                {charClass.subclasses && charClass.subclasses.length > 0 ? (
                                    <div className="space-y-3 mt-2 text-gray-300">
                                        {charClass.subclasses.map((subclass) => (
                                            <div key={subclass.id} className="border-l-4 border-vaccinePurple pl-4 py-1 px-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h5 className="font-semibold">{subclass.name}</h5>
                                                    {isAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onDeleteSubclass(subclass.id)}
                                                            className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-vaccineGray-600">{subclass.description}</p>

                                                <p className="font-medium mt-2">Habilidades da Subclasse</p>
                                                {subclass.abilities && subclass.abilities.length > 0 ? (
                                                    <ul className="space-y-2 pl-2 text-vaccineGray-800">
                                                        {subclass.abilities.map((ability) => (
                                                            <li key={ability.id} className="flex items-start text-vaccineGray-400 justify-between gap-3 rounded-md border border-vaccineGray-200/20 px-2 mt-1 py-2">
                                                                <div>
                                                                    <span className="font-semibold">{ability.name}:</span> {ability.description}
                                                                </div>
                                                                {isAdmin && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => onDeleteAbility(ability.id)}
                                                                        className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
                                                                    >
                                                                        X
                                                                    </button>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-vaccineGray-600">Sem habilidades de subclasse.</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-vaccineGray-600">Sem subclasses.</p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}