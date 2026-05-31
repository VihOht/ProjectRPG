import type { LoreDocument, LoreSession, LoreSubdocument } from "../../types/lore";

interface LoreTabProps {
    sessions: LoreSession[];
    isLoading: boolean;
    selectedSessionId: number | null;
    selectedDocumentId: number | null;
    selectedSubdocumentId: number | null;
    isAdmin: boolean;
    onSessionClick: (session: LoreSession) => void;
    onDocumentClick: (sessionId: number, document: LoreDocument) => void;
    onSubdocumentClick: (sessionId: number, documentId: number, subdocument: LoreSubdocument) => void;
    onDeleteSession: (sessionId: number) => void;
    onDeleteDocument: (documentId: number) => void;
    onDeleteImage: (imageId: number) => void;
    onDeleteSubdocument: (subdocumentId: number) => void;
}

export function LoreTab({
    sessions,
    isLoading,
    selectedSessionId,
    selectedDocumentId,
    selectedSubdocumentId,
    isAdmin,
    onSessionClick,
    onDocumentClick,
    onSubdocumentClick,
    onDeleteSession,
    onDeleteDocument,
    onDeleteImage,
    onDeleteSubdocument,
}: LoreTabProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-vaccineGray-300">Lore</h2>
                <p className="text-gray-400">
                    Clique em uma sessão para expandir os documentos, imagens e subdocumentos relacionados.
                </p>
            </div>

            {isLoading ? (
                <p className="text-gray-600">Carregando lore...</p>
            ) : sessions.length === 0 ? (
                <p className="text-gray-600">Nenhuma sessão de lore cadastrada.</p>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session) => {
                        const isSessionSelected = selectedSessionId === session.id;

                        return (
                            <article key={session.id} className="rounded-lg border border-gray-200 bg-white/80 p-4 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onSessionClick(session)}
                                        className={`flex-1 text-left rounded-md px-3 py-2 transition-colors ${
                                            isSessionSelected
                                                ? "bg-vaccineRed text-white"
                                                : "bg-gray-50 text-vaccineBlack hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="text-lg font-semibold">{session.name}</span>
                                    </button>
                                    {isAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteSession(session.id)}
                                            className="rounded-md bg-vaccineRed px-3 py-2 text-sm text-white hover:opacity-90"
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </div>

                                {isSessionSelected && (
                                    <div className="mt-4 space-y-5 border-l-4 border-vaccineRed pl-4">
                                        <p className="text-gray-700">{session.description}</p>

                                        <div>
                                            <h3 className="font-semibold text-vaccineBlack mb-2">Imagens</h3>
                                            {session.images.length > 0 ? (
                                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    {session.images.map((image) => (
                                                        <figure key={image.id} className="overflow-hidden rounded-md border border-gray-200 bg-white">
                                                            <img
                                                                src={image.url}
                                                                alt={session.name}
                                                                className="h-44 w-full object-cover"
                                                            />
                                                            {isAdmin && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => onDeleteImage(image.id)}
                                                                    className="w-full bg-vaccineRed px-3 py-2 text-xs text-white hover:opacity-90"
                                                                >
                                                                    Excluir imagem
                                                                </button>
                                                            )}
                                                        </figure>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-600">Nenhuma imagem associada a esta sessão.</p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-vaccineBlack">Documentos</h3>
                                            {session.documents.length > 0 ? (
                                                session.documents.map((document) => {
                                                    const isDocumentSelected = selectedDocumentId === document.id;

                                                    return (
                                                        <div key={document.id} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => onDocumentClick(session.id, document)}
                                                                    className={`flex-1 text-left rounded-md px-3 py-2 transition-colors ${
                                                                        isDocumentSelected
                                                                            ? "bg-vaccineBlack text-white"
                                                                            : "bg-white text-vaccineBlack hover:bg-gray-100"
                                                                    }`}
                                                                >
                                                                    <span className="font-semibold">{document.title}</span>
                                                                </button>
                                                                {isAdmin && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => onDeleteDocument(document.id)}
                                                                        className="rounded-md bg-vaccineRed px-3 py-2 text-xs text-white hover:opacity-90"
                                                                    >
                                                                        Excluir
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <div className="mt-3 space-y-4 border-l-4 border-vaccineBlack pl-4">
                                                                <p className="text-gray-700 whitespace-pre-line">{document.content}</p>

                                                                <div>
                                                                    <h4 className="font-semibold text-vaccineBlack mb-2">Subdocumentos</h4>
                                                                    {document.subdocuments.length > 0 ? (
                                                                        <div className="space-y-3">
                                                                            {document.subdocuments.map((subdocument) => {
                                                                                const isSubdocumentSelected = selectedSubdocumentId === subdocument.id;

                                                                                return (
                                                                                    <div
                                                                                        key={subdocument.id}
                                                                                        className="rounded-md border border-gray-200 bg-white p-3"
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => onSubdocumentClick(session.id, document.id, subdocument)}
                                                                                                className={`flex-1 text-left rounded-md px-3 py-2 transition-colors ${
                                                                                                    isSubdocumentSelected
                                                                                                        ? "bg-vaccineRed text-white"
                                                                                                        : "bg-gray-50 text-vaccineBlack hover:bg-gray-100"
                                                                                                }`}
                                                                                            >
                                                                                                {subdocument.title}
                                                                                            </button>
                                                                                            {isAdmin && (
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => onDeleteSubdocument(subdocument.id)}
                                                                                                    className="rounded-md bg-vaccineRed px-3 py-2 text-xs text-white hover:opacity-90"
                                                                                                >
                                                                                                    Excluir
                                                                                                </button>
                                                                                            )}
                                                                                        </div>

                                                                                        {isSubdocumentSelected && (
                                                                                            <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                                                                                                {subdocument.content}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-gray-600">Nenhum subdocumento neste documento.</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-gray-600">Nenhum documento associado a esta sessão.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}