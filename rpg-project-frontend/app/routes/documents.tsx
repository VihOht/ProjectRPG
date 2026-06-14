import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { StarSky } from "../components/StarSky";
import { useAuthProvider } from "../providers";
import {
    useCreateAttribute,
    useCreateAbility,
    useCreateClass,
    useCreateLoreDocument,
    useCreateLoreImage,
    useCreateLoreSession,
    useCreateLoreSubdocument,
    useCreatePericia,
    useCreateSubclass,
    useDeleteAbility,
    useDeleteAttribute,
    useDeleteClass,
    useDeleteLoreDocument,
    useDeleteLoreImage,
    useDeleteLoreSession,
    useDeleteLoreSubdocument,
    useDeletePericia,
    useDeleteSubclass,
    useAttributes,
    useClasses,
    useGetLoreSessions,
    usePericias,
} from "../hooks";
import type { AttributeItem, PericiaItem } from "../types/character";
import type { LoreDocument, LoreSession, LoreSubdocument } from "../types/lore";
import { ClassesTab } from "./documents/ClassesTab";
import { AttributesTab } from "./documents/AttributesTab";
import { LoreTab } from "./documents/LoreTab";

type DocumentsTab = "classes" | "attributes" | "lore";
type AdminArea = "classes" | "attributes" | "lore";
type AdminCreateType =
    | "class"
    | "subclass"
    | "ability"
    | "attribute"
    | "pericia"
    | "lore_session"
    | "lore_document"
    | "lore_image"
    | "lore_subdocument";

export default function DocumentsPage() {
    const { isAuthenticated, user } = useAuthProvider();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<DocumentsTab>("classes");
    const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(null);
    const [selectedPericiaId, setSelectedPericiaId] = useState<number | null>(null);
    const [selectedLoreSessionId, setSelectedLoreSessionId] = useState<number | null>(null);
    const [selectedLoreDocumentId, setSelectedLoreDocumentId] = useState<number | null>(null);
    const [selectedLoreSubdocumentId, setSelectedLoreSubdocumentId] = useState<number | null>(null);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [adminArea, setAdminArea] = useState<AdminArea>("classes");
    const [adminCreateType, setAdminCreateType] = useState<AdminCreateType>("class");
    const [adminName, setAdminName] = useState("");
    const [adminDescription, setAdminDescription] = useState("");
    const [adminClassId, setAdminClassId] = useState("");
    const [adminAttributeId, setAdminAttributeId] = useState("");
    const [adminSessionId, setAdminSessionId] = useState("");
    const [adminDocumentId, setAdminDocumentId] = useState("");
    const [adminUrl, setAdminUrl] = useState("");

    const { data: classesData, isLoading: classesLoading } = useClasses();
    const { data: attributesData, isLoading: attributesLoading } = useAttributes();
    const { data: periciasData } = usePericias();
    const { data: loreData, isLoading: loreLoading } = useGetLoreSessions();

    const { mutate: createClass, isPending: isCreatingClass } = useCreateClass();
    const { mutate: createAbility, isPending: isCreatingAbility } = useCreateAbility();
    const { mutate: createSubclass, isPending: isCreatingSubclass } = useCreateSubclass();
    const { mutate: createAttribute, isPending: isCreatingAttribute } = useCreateAttribute();
    const { mutate: createPericia, isPending: isCreatingPericia } = useCreatePericia();
    const { mutate: createLoreSession, isPending: isCreatingLoreSession } = useCreateLoreSession();
    const { mutate: createLoreDocument, isPending: isCreatingLoreDocument } = useCreateLoreDocument();
    const { mutate: createLoreImage, isPending: isCreatingLoreImage } = useCreateLoreImage();
    const { mutate: createLoreSubdocument, isPending: isCreatingLoreSubdocument } = useCreateLoreSubdocument();

    const { mutate: deleteClass } = useDeleteClass();
    const { mutate: deleteSubclass } = useDeleteSubclass();
    const { mutate: deleteAbility } = useDeleteAbility();
    const { mutate: deleteAttribute } = useDeleteAttribute();
    const { mutate: deletePericia } = useDeletePericia();
    const { mutate: deleteLoreSession } = useDeleteLoreSession();
    const { mutate: deleteLoreDocument } = useDeleteLoreDocument();
    const { mutate: deleteLoreImage } = useDeleteLoreImage();
    const { mutate: deleteLoreSubdocument } = useDeleteLoreSubdocument();

    const isAdmin = user?.role === "ADMIN";
    const visibleActiveTab = isAdmin ? activeTab : "classes";
    const classes = useMemo(() => classesData?.classes ?? [], [classesData?.classes]);
    const attributes = useMemo(() => attributesData?.attributes ?? [], [attributesData?.attributes]);
    const pericias = useMemo(() => periciasData?.pericias ?? [], [periciasData?.pericias]);
    const loreSessions = useMemo(() => loreData?.sessions ?? [], [loreData?.sessions]);
    const selectedAdminSession = useMemo(
        () => loreSessions.find((session) => session.id === Number(adminSessionId)) ?? null,
        [adminSessionId, loreSessions],
    );

    const periciasByAttribute = useMemo(() => {
        return pericias.reduce<Record<number, PericiaItem[]>>((accumulator, pericia) => {
            if (!accumulator[pericia.attribute_id]) {
                accumulator[pericia.attribute_id] = [];
            }
            accumulator[pericia.attribute_id].push(pericia);
            return accumulator;
        }, {});
    }, [pericias]);

    const visibleSelectedAttributeId =
        selectedAttributeId === null ? attributes[0]?.id ?? null : selectedAttributeId;

    const selectedLoreSession = useMemo(() => {
        if (selectedLoreSessionId === -1) {
            return null;
        }

        if (selectedLoreSessionId === null) {
            return loreSessions[0] ?? null;
        }

        return loreSessions.find((session) => session.id === selectedLoreSessionId) ?? loreSessions[0] ?? null;
    }, [loreSessions, selectedLoreSessionId]);

    const selectedLoreDocument = useMemo(() => {
        if (!selectedLoreSession || selectedLoreDocumentId === -1) {
            return null;
        }

        if (selectedLoreDocumentId === null) {
            return selectedLoreSession.documents[0] ?? null;
        }

        return (
            selectedLoreSession.documents.find((document) => document.id === selectedLoreDocumentId) ??
            selectedLoreSession.documents[0] ??
            null
        );
    }, [selectedLoreDocumentId, selectedLoreSession]);

    const selectedLoreSubdocument = useMemo(() => {
        if (!selectedLoreDocument || selectedLoreSubdocumentId === null || selectedLoreSubdocumentId === -1) {
            return null;
        }

        return (
            selectedLoreDocument.subdocuments.find((subdocument) => subdocument.id === selectedLoreSubdocumentId) ??
            null
        );
    }, [selectedLoreDocument, selectedLoreSubdocumentId]);

    const visibleSelectedLoreSessionId = selectedLoreSession?.id ?? null;
    const visibleSelectedLoreDocumentId = selectedLoreDocument?.id ?? null;
    const visibleSelectedLoreSubdocumentId = selectedLoreSubdocument?.id ?? null;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth/login");
        }
    }, [isAuthenticated, navigate]);

    const handleAttributeClick = (attribute: AttributeItem) => {
        if (visibleSelectedAttributeId === attribute.id) {
            setSelectedAttributeId(-1);
            setSelectedPericiaId(null);
            return;
        }
        setSelectedAttributeId(attribute.id);
        setSelectedPericiaId(null);
    };

    const handlePericiaClick = (pericia: PericiaItem) => {
        if (selectedPericiaId === pericia.id) {
            setSelectedPericiaId(-1);
            return;
        }
        setSelectedAttributeId(pericia.attribute_id);
        setSelectedPericiaId(pericia.id);
    };

    const handleLoreSessionClick = (session: LoreSession) => {
        if (visibleSelectedLoreSessionId === session.id) {
            setSelectedLoreSessionId(-1);
            setSelectedLoreDocumentId(-1);
            setSelectedLoreSubdocumentId(-1);
            return;
        }

        setSelectedLoreSessionId(session.id);
        setSelectedLoreDocumentId(session.documents[0]?.id ?? null);
        setSelectedLoreSubdocumentId(null);
    };

    const handleLoreDocumentClick = (sessionId: number, document: LoreDocument) => {
        if (visibleSelectedLoreDocumentId === document.id) {
            setSelectedLoreDocumentId(-1);
            setSelectedLoreSubdocumentId(-1);
            return;
        }

        setSelectedLoreSessionId(sessionId);
        setSelectedLoreDocumentId(document.id);
        setSelectedLoreSubdocumentId(null);
    };

    const handleLoreSubdocumentClick = (sessionId: number, documentId: number, subdocument: LoreSubdocument) => {
        setSelectedLoreSessionId(sessionId);
        setSelectedLoreDocumentId(documentId);

        if (visibleSelectedLoreSubdocumentId === subdocument.id) {
            setSelectedLoreSubdocumentId(-1);
            return;
        }

        setSelectedLoreSubdocumentId(subdocument.id);
    };

    const openAdminModal = (type: AdminCreateType) => {
        const isLoreType =
            type === "lore_session" ||
            type === "lore_document" ||
            type === "lore_image" ||
            type === "lore_subdocument";
        const defaultLoreSession = selectedLoreSession ?? loreSessions[0] ?? null;
        const defaultLoreDocument = selectedLoreDocument ?? defaultLoreSession?.documents[0] ?? null;

        setAdminCreateType(type);
        if (type === "class" || type === "subclass" || type === "ability") {
            setAdminArea("classes");
        } else if (type === "attribute" || type === "pericia") {
            setAdminArea("attributes");
        } else {
            setAdminArea("lore");
        }
        setAdminName("");
        setAdminDescription("");
        setAdminClassId("");
        setAdminAttributeId("");
        setAdminSessionId(isLoreType && defaultLoreSession ? String(defaultLoreSession.id) : "");
        setAdminDocumentId(isLoreType && defaultLoreDocument ? String(defaultLoreDocument.id) : "");
        setAdminUrl("");
        setIsAdminModalOpen(true);
    };

    const closeAdminModal = () => {
        setIsAdminModalOpen(false);
        setAdminName("");
        setAdminDescription("");
        setAdminClassId("");
        setAdminAttributeId("");
        setAdminSessionId("");
        setAdminDocumentId("");
        setAdminUrl("");
    };

    const submitAdminCreation = () => {
        if (adminCreateType === "class") {
            createClass({ name: adminName, description: adminDescription }, { onSuccess: closeAdminModal });
            return;
        }

        if (adminCreateType === "ability") {
            createAbility(
                {
                    name: adminName,
                    description: adminDescription,
                    class_id: adminClassId ? Number(adminClassId) : undefined,
                },
                { onSuccess: closeAdminModal },
            );
            return;
        }

        if (adminCreateType === "subclass") {
            if (!adminClassId) {
                window.alert("Selecione uma classe pai.");
                return;
            }

            createSubclass(
                {
                    name: adminName,
                    description: adminDescription,
                    class_id: Number(adminClassId),
                },
                { onSuccess: closeAdminModal },
            );
            return;
        }

        if (adminCreateType === "attribute") {
            createAttribute({ name: adminName, description: adminDescription }, { onSuccess: closeAdminModal });
            return;
        }

        if (adminCreateType === "pericia") {
            if (!adminAttributeId) {
                window.alert("Selecione um atributo pai.");
                return;
            }

            createPericia(
                {
                    name: adminName,
                    description: adminDescription,
                    attribute_id: Number(adminAttributeId),
                },
                { onSuccess: closeAdminModal },
            );
            return;
        }

        if (adminCreateType === "lore_session") {
            createLoreSession({ name: adminName, description: adminDescription }, { onSuccess: closeAdminModal });
            return;
        }

        if (adminCreateType === "lore_document") {
            if (!adminSessionId) {
                window.alert("Selecione uma sessão de lore.");
                return;
            }

            createLoreDocument(
                {
                    sessionId: Number(adminSessionId),
                    data: { title: adminName, content: adminDescription },
                },
                { onSuccess: closeAdminModal },
            );
            return;
        }

        if (adminCreateType === "lore_image") {
            if (!adminSessionId) {
                window.alert("Selecione uma sessão de lore.");
                return;
            }

            createLoreImage(
                { sessionId: Number(adminSessionId), data: { url: adminUrl } },
                { onSuccess: closeAdminModal },
            );
            return;
        }

        if (adminCreateType === "lore_subdocument") {
            if (!adminDocumentId) {
                window.alert("Selecione um documento pai.");
                return;
            }

            createLoreSubdocument(
                {
                    documentId: Number(adminDocumentId),
                    data: { title: adminName, content: adminDescription },
                },
                { onSuccess: closeAdminModal },
            );
        }
    };

    const handleDeleteClass = (classId: number) => {
        if (window.confirm("Excluir esta classe? Isso também remove subclasses e habilidades ligadas a ela.")) {
            deleteClass(classId);
        }
    };

    const handleDeleteSubclass = (subclassId: number) => {
        if (window.confirm("Excluir esta subclasse? Isso também remove habilidades ligadas a ela.")) {
            deleteSubclass(subclassId);
        }
    };

    const handleDeleteAbility = (abilityId: number) => {
        if (window.confirm("Excluir esta habilidade?")) {
            deleteAbility(abilityId);
        }
    };

    const handleDeleteAttribute = (attributeId: number) => {
        if (window.confirm("Excluir este atributo? Isso também remove perícias ligadas a ele.")) {
            deleteAttribute(attributeId);
        }
    };

    const handleDeletePericia = (periciaId: number) => {
        if (window.confirm("Excluir esta perícia?")) {
            deletePericia(periciaId);
        }
    };

    const classModalActive = isAdminModalOpen && adminArea === "classes";
    const attributeModalActive = isAdminModalOpen && adminArea === "attributes";
    const loreModalActive = isAdminModalOpen && adminArea === "lore";

    const handleDeleteLoreSession = (sessionId: number) => {
        if (window.confirm("Excluir esta sessão de lore? Isso remove documentos e imagens associados.")) {
            deleteLoreSession(sessionId);
        }
    };

    const handleDeleteLoreDocument = (documentId: number) => {
        if (window.confirm("Excluir este documento? Isso remove os subdocumentos associados.")) {
            deleteLoreDocument(documentId);
        }
    };

    const handleDeleteLoreImage = (imageId: number) => {
        if (window.confirm("Excluir esta imagem?")) {
            deleteLoreImage(imageId);
        }
    };

    const handleDeleteLoreSubdocument = (subdocumentId: number) => {
        if (window.confirm("Excluir este subdocumento?")) {
            deleteLoreSubdocument(subdocumentId);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-500">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <StarSky>
            <Header>
                <Link
                    to="/"
                    className="px-3 py-2 bg-vaccineGray-300 rounded-md hover:bg-vaccineGray-400 transition-colors"
                >
                    Fichas
                </Link>
            </Header>

            <main className="flex-1 p-8">
                <section className="max-w-6xl font-trajanPRegular mx-auto bg-vaccineGray-300/0 border-1 border-vaccineGray-300/50 rounded-lg shadow-lg p-6 space-y-6">
                    <div>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-trajanPBold font-bold text-vaccinePurple mb-2">Documentos</h1>
                                <p className="text-vaccineBlack">
                                    Classes, atributos, perícias e lore centralizados em abas.
                                </p>
                            </div>

                            {isAdmin && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openAdminModal("class")}
                                        className="rounded-md bg-vaccinePurple px-4 py-2 text-white hover:opacity-90"
                                    >
                                        Criar classes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openAdminModal("attribute")}
                                        className="rounded-md bg-vaccineBlack px-4 py-2 text-white hover:opacity-90"
                                    >
                                        Criar atributos e pericias
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openAdminModal("lore_session")}
                                        className="rounded-md bg-vaccinePurple px-4 py-2 text-white hover:opacity-90"
                                    >
                                        Criar lore
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-b border-gray-300 pb-3">
                        {[
                            { id: "classes", label: "Classes" },
                            { id: "attributes", label: "Atributos" },
                            { id: "lore", label: "Lore" },
                        ]
                            .filter((tab) => isAdmin || tab.id === "classes")
                            .map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as DocumentsTab)}
                                    className={`px-4 py-2 rounded-md transition-colors ${visibleActiveTab === tab.id ? "bg-vaccinePurple text-white" : "bg-white text-vaccineBlack hover:bg-gray-100"}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                    </div>

                    {visibleActiveTab === "classes" && (
                        <ClassesTab
                            classes={classes}
                            isLoading={classesLoading}
                            isAdmin={isAdmin}
                            onDeleteClass={handleDeleteClass}
                            onDeleteSubclass={handleDeleteSubclass}
                            onDeleteAbility={handleDeleteAbility}
                        />
                    )}

                    {visibleActiveTab === "attributes" && (
                        <AttributesTab
                            attributes={attributes}
                            periciasByAttribute={periciasByAttribute}
                            isLoading={attributesLoading}
                            selectedAttributeId={visibleSelectedAttributeId}
                            selectedPericiaId={selectedPericiaId}
                            onAttributeClick={handleAttributeClick}
                            onPericiaClick={handlePericiaClick}
                            isAdmin={isAdmin}
                            onDeleteAttribute={handleDeleteAttribute}
                            onDeletePericia={handleDeletePericia}
                        />
                    )}

                    {visibleActiveTab === "lore" && (
                        <LoreTab
                            sessions={loreSessions}
                            isLoading={loreLoading}
                            selectedSessionId={visibleSelectedLoreSessionId}
                            selectedDocumentId={visibleSelectedLoreDocumentId}
                            selectedSubdocumentId={visibleSelectedLoreSubdocumentId}
                            isAdmin={isAdmin}
                            onSessionClick={handleLoreSessionClick}
                            onDocumentClick={handleLoreDocumentClick}
                            onSubdocumentClick={handleLoreSubdocumentClick}
                            onDeleteSession={handleDeleteLoreSession}
                            onDeleteDocument={handleDeleteLoreDocument}
                            onDeleteImage={handleDeleteLoreImage}
                            onDeleteSubdocument={handleDeleteLoreSubdocument}
                        />
                    )}
                </section>
            </main>

            {classModalActive && isAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-2xl rounded-xl bg-vaccineGray-300 p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-vaccinePurple">Criar classes</h2>
                                <p className="text-vaccineBlack">Crie classes, subclasses e abilities.</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeAdminModal}
                                className="rounded-md bg-white px-3 py-2 text-vaccineBlack hover:bg-gray-100"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                Tipo
                                <select
                                    value={adminCreateType}
                                    onChange={(event) => setAdminCreateType(event.target.value as AdminCreateType)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                >
                                    <option value="class">Classe</option>
                                    <option value="subclass">Subclasse</option>
                                    <option value="ability">Ability</option>
                                </select>
                            </label>

                            {(adminCreateType === "class" ||
                                adminCreateType === "subclass" ||
                                adminCreateType === "ability") && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    Nome / Título
                                    <input
                                        value={adminName}
                                        onChange={(event) => setAdminName(event.target.value)}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    />
                                </label>
                            )}

                            {(adminCreateType === "class" ||
                                adminCreateType === "subclass" ||
                                adminCreateType === "ability") && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    Descrição / Conteúdo
                                    <textarea
                                        value={adminDescription}
                                        onChange={(event) => setAdminDescription(event.target.value)}
                                        rows={5}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    />
                                </label>
                            )}

                            {(adminCreateType === "subclass" || adminCreateType === "ability") && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    Classe pai
                                    <select
                                        value={adminClassId}
                                        onChange={(event) => setAdminClassId(event.target.value)}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    >
                                        <option value="">Selecione</option>
                                        {classes.map((charClass) => (
                                            <option key={charClass.id} value={String(charClass.id)}>
                                                {charClass.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            <button
                                type="button"
                                onClick={submitAdminCreation}
                                disabled={isCreatingClass || isCreatingSubclass || isCreatingAbility}
                                className="rounded-md bg-vaccinePurple px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {attributeModalActive && isAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-2xl rounded-xl bg-vaccineGray-300 p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-vaccinePurple">Criar atributos e pericias</h2>
                                <p className="text-vaccineBlack">Crie atributos ou perícias ligadas a um atributo.</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeAdminModal}
                                className="rounded-md bg-white px-3 py-2 text-vaccineBlack hover:bg-gray-100"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                Tipo
                                <select
                                    value={adminCreateType}
                                    onChange={(event) => setAdminCreateType(event.target.value as AdminCreateType)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                >
                                    <option value="attribute">Atributo</option>
                                    <option value="pericia">Pericia</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                Nome / Título
                                <input
                                    value={adminName}
                                    onChange={(event) => setAdminName(event.target.value)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                />
                            </label>

                            <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                Descrição / Conteúdo
                                <textarea
                                    value={adminDescription}
                                    onChange={(event) => setAdminDescription(event.target.value)}
                                    rows={5}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                />
                            </label>

                            {adminCreateType === "pericia" && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    Atributo pai
                                    <select
                                        value={adminAttributeId}
                                        onChange={(event) => setAdminAttributeId(event.target.value)}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    >
                                        <option value="">Selecione</option>
                                        {attributes.map((attribute) => (
                                            <option key={attribute.id} value={String(attribute.id)}>
                                                {attribute.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            <button
                                type="button"
                                onClick={submitAdminCreation}
                                disabled={isCreatingAttribute || isCreatingPericia}
                                className="rounded-md bg-vaccinePurple px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loreModalActive && isAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-2xl rounded-xl bg-vaccineGray-300 p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-vaccinePurple">Criar lore</h2>
                                <p className="text-vaccineBlack">
                                    Crie sessões, documentos, imagens e subdocumentos de lore.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeAdminModal}
                                className="rounded-md bg-white px-3 py-2 text-vaccineBlack hover:bg-gray-100"
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                Tipo
                                <select
                                    value={adminCreateType}
                                    onChange={(event) => setAdminCreateType(event.target.value as AdminCreateType)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                >
                                    <option value="lore_session">Lore - Sessão</option>
                                    <option value="lore_document">Lore - Documento</option>
                                    <option value="lore_image">Lore - Imagem</option>
                                    <option value="lore_subdocument">Lore - Subdocumento</option>
                                </select>
                            </label>

                            {(adminCreateType === "lore_session" ||
                                adminCreateType === "lore_document" ||
                                adminCreateType === "lore_subdocument") && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    Nome / Título
                                    <input
                                        value={adminName}
                                        onChange={(event) => setAdminName(event.target.value)}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    />
                                </label>
                            )}

                            {(adminCreateType === "lore_session" ||
                                adminCreateType === "lore_document" ||
                                adminCreateType === "lore_subdocument") && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    Descrição / Conteúdo
                                    <textarea
                                        value={adminDescription}
                                        onChange={(event) => setAdminDescription(event.target.value)}
                                        rows={5}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    />
                                </label>
                            )}

                            {(adminCreateType === "lore_document" ||
                                adminCreateType === "lore_image" ||
                                adminCreateType === "lore_subdocument") && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    Sessão de lore
                                    <select
                                        value={adminSessionId}
                                        onChange={(event) => {
                                            setAdminSessionId(event.target.value);
                                            const session = loreSessions.find(
                                                (item) => item.id === Number(event.target.value),
                                            );
                                            setAdminDocumentId(
                                                session?.documents[0]?.id ? String(session.documents[0].id) : "",
                                            );
                                        }}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    >
                                        <option value="">Selecione</option>
                                        {loreSessions.map((session) => (
                                            <option key={session.id} value={String(session.id)}>
                                                {session.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            {adminCreateType === "lore_subdocument" && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    Documento pai
                                    <select
                                        value={adminDocumentId}
                                        onChange={(event) => setAdminDocumentId(event.target.value)}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    >
                                        <option value="">Selecione</option>
                                        {(selectedAdminSession?.documents ?? []).map((document) => (
                                            <option key={document.id} value={String(document.id)}>
                                                {document.title}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            {adminCreateType === "lore_image" && (
                                <label className="flex flex-col gap-2 text-sm font-medium text-vaccineBlack">
                                    URL da imagem
                                    <input
                                        value={adminUrl}
                                        onChange={(event) => setAdminUrl(event.target.value)}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2"
                                    />
                                </label>
                            )}

                            <button
                                type="button"
                                onClick={submitAdminCreation}
                                disabled={
                                    isCreatingLoreSession ||
                                    isCreatingLoreDocument ||
                                    isCreatingLoreImage ||
                                    isCreatingLoreSubdocument
                                }
                                className="rounded-md bg-vaccinePurple px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StarSky>
    );
}
