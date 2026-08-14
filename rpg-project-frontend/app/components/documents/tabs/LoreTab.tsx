import { useState } from "react";
import { LucideDelete } from "lucide-react";
import toast from "react-hot-toast";
import ClassModal from "../dialogs/ClassModal";
import UpdateClassModal from "../dialogs/UpdateClassModal";
import UpdateSubclassModal from "../dialogs/UpdateSubclassModal";

import {
  useDeleteLoreDocument,
  useDeleteLoreImage,
  useDeleteLoreSession,
  useDeleteLoreSubdocument,
  useRaces,
  useLore,
} from "../../../hooks";
import { useAuthProvider } from "../../../providers";
import type { LoreDocument, LoreImage, LoreSession } from "../../../types";

type DeleteHandler = (id: number) => void;

export function LoreTab() {
  const { user } = useAuthProvider();
  const { data: loreData, isLoading, refetch } = useLore();
  const { data: raceData} = useRaces();
  const { mutate: deleteLoreSession } = useDeleteLoreSession();
  const { mutate: deleteLoreDocument } = useDeleteLoreDocument();
  const { mutate: deleteLoreImage } = useDeleteLoreImage();
  const { mutate: deleteLoreSubdocument } = useDeleteLoreSubdocument();

  const isAdmin = user?.role === "ADMIN";
  const sessions = loreData?.sessions ?? [];

  const onDeleteSession = (sessionId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta sessao de lore?")) {
      return;
    }

    deleteLoreSession(sessionId, {
      onSuccess: () => {
        toast.success("Sessao de lore excluida com sucesso.");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao excluir sessao de lore.");
      },
    });
  };

  const onDeleteDocument = (documentId: number) => {
    if (!confirm("Tem certeza que deseja excluir este documento?")) {
      return;
    }

    deleteLoreDocument(documentId, {
      onSuccess: () => {
        toast.success("Documento excluido com sucesso.");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao excluir documento.");
      },
    });
  };

  const onDeleteImage = (imageId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) {
      return;
    }

    deleteLoreImage(imageId, {
      onSuccess: () => {
        toast.success("Imagem excluida com sucesso.");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao excluir imagem.");
      },
    });
  };

  const onDeleteSubdocument = (subdocumentId: number) => {
    if (!confirm("Tem certeza que deseja excluir este subdocumento?")) {
      return;
    }

    deleteLoreSubdocument(subdocumentId, {
      onSuccess: () => {
        toast.success("Subdocumento excluido com sucesso.");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao excluir subdocumento.");
      },
    });
  };

  if (isLoading) {
    return <p className="text-gray-600">Carregando lore...</p>;
  }

  if (!user) {
    return <p className="text-gray-600">Usuario nao autenticado.</p>;
  }

  return (
    <div className="w-full space-y-6 md:px-4 md:py-6 px-2 py-4">
      <div className="items-center justify-between">
        <div className="p-2">
          <h2 className="text-2xl font-semibold text-vaccineGray-300">
            Lore
          </h2>
        </div>
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2 text-vaccineGray-300">Espécies</h3>
            {isAdmin && (
                <ClassModal />
            )}
            {raceData?.races.length === 0 ? (
                <p className="text-vaccineGray-400">Nenhuma espécie encontrada.</p>
            ) : (
                <ul className="space-y-2">
                    {raceData?.races.map((race) => (
                        <li key={race.id} className="bg-vaccineGray-800/20 p-4 rounded-md flex justify-between items-center">
                            <h1>{race.name}</h1>
                            <p>{race.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-600">Nenhuma sessao de lore cadastrada.</p>
      ) : (
        <div className="space-y-2 w-full break-words">
          {sessions.map((session) => (
            <LoreSessionItem
              key={session.id}
              session={session}
              isAdmin={isAdmin}
              onDeleteSession={onDeleteSession}
              onDeleteDocument={onDeleteDocument}
              onDeleteImage={onDeleteImage}
              onDeleteSubdocument={onDeleteSubdocument}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LoreSessionItem({
  session,
  isAdmin,
  onDeleteSession,
  onDeleteDocument,
  onDeleteImage,
  onDeleteSubdocument,
}: {
  session: LoreSession;
  isAdmin: boolean;
  onDeleteSession: DeleteHandler;
  onDeleteDocument: DeleteHandler;
  onDeleteImage: DeleteHandler;
  onDeleteSubdocument: DeleteHandler;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className="bg-vaccineBlueTones-1000/20 rounded-md md:p-4 p-2 border border-vaccineGray-200/20 border-1">
      <div className="flex items-start justify-between gap-3">
        <h3
          onClick={() => setOpen(!open)}
          className="text-2xl font-semibold text-vaccinePurple hover:underline w-[70%] cursor-pointer"
        >
          {session.name}
        </h3>

        {isAdmin && (
          <button
            type="button"
            onClick={() => onDeleteSession(session.id)}
            className="rounded-md bg-vaccinePurple px-3 py-1 text-sm text-white hover:opacity-90"
          >
            <LucideDelete className="w-4 h-4" />
          </button>
        )}
      </div>

      <div
        className={`overflow-x-auto transition-all duration-500 ${
          open ? "max-h-screen" : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <p className="text-vaccineGray-400">{session.description}</p>

        <LoreImages
          images={session.images}
          isAdmin={isAdmin}
          onDeleteImage={onDeleteImage}
        />

        <LoreDocuments
          documents={session.documents}
          isAdmin={isAdmin}
          onDeleteDocument={onDeleteDocument}
          onDeleteSubdocument={onDeleteSubdocument}
        />
      </div>
    </article>
  );
}

function LoreImages({
  images,
  isAdmin,
  onDeleteImage,
}: {
  images: LoreImage[];
  isAdmin: boolean;
  onDeleteImage: DeleteHandler;
}) {
  return (
    <div className="mb-3 mt-4 break-words">
      <h4 className="font-semibold text-vaccineGray-300 mt-2 mb-2">
        Imagens
      </h4>

      {images.length > 0 ? (
        <ul className="space-y-2 pl-2 text-vaccineGray-800">
          {images.map((image) => (
            <li
              key={image.id}
              className="flex text-vaccineGray-400 items-start justify-between gap-3 rounded-md border border-vaccineGray-200/20 px-3 py-2"
            >
              <a
                href={image.url}
                target="_blank"
                rel="noreferrer"
                className="break-all hover:text-vaccinePurple hover:underline"
              >
                {image.url}
              </a>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => onDeleteImage(image.id)}
                  className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
                >
                  <LucideDelete className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-vaccineGray-600">Sem imagens.</p>
      )}
    </div>
  );
}

function LoreDocuments({
  documents,
  isAdmin,
  onDeleteDocument,
  onDeleteSubdocument,
}: {
  documents: LoreDocument[];
  isAdmin: boolean;
  onDeleteDocument: DeleteHandler;
  onDeleteSubdocument: DeleteHandler;
}) {
  return (
    <div>
      <h4 className="font-semibold text-vaccineGray-300 mb-2">Documentos</h4>

      {documents.length > 0 ? (
        <ul className="space-y-2 pl-2 text-vaccineGray-800">
          {documents.map((document) => (
            <li
              key={document.id}
              className="text-vaccineGray-400 rounded-md border border-vaccineGray-200/20 px-3 py-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="font-semibold text-vaccineGray-400">
                    {document.title}
                  </h5>
                  <p className="mt-1 text-sm text-vaccineGray-600">
                    {document.content}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => onDeleteDocument(document.id)}
                    className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
                  >
                    <LucideDelete className="w-4 h-4" />
                  </button>
                )}
              </div>

              <LoreSubdocuments
                document={document}
                isAdmin={isAdmin}
                onDeleteSubdocument={onDeleteSubdocument}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-vaccineGray-600">Sem documentos.</p>
      )}
    </div>
  );
}

function LoreSubdocuments({
  document,
  isAdmin,
  onDeleteSubdocument,
}: {
  document: LoreDocument;
  isAdmin: boolean;
  onDeleteSubdocument: DeleteHandler;
}) {
  if (document.subdocuments.length === 0) {
    return <p className="mt-2 text-sm text-vaccineGray-600">Sem subdocumentos.</p>;
  }

  return (
    <div className="mt-3 border-l-4 border-vaccinePurple md:pl-4 pl-2">
      <p className="font-medium mb-2 text-vaccineGray-300">Subdocumentos</p>

      <ul className="space-y-2 md:pl-2 pl-1 text-vaccineGray-800">
        {document.subdocuments.map((subdocument) => (
          <li
            key={subdocument.id}
            className="flex items-start text-vaccineGray-400 justify-between gap-3 rounded-md border border-vaccineGray-200/20 px-2 mt-1 py-2"
          >
            <div>
              <span className="font-semibold">{subdocument.title}:</span>{" "}
              {subdocument.content}
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => onDeleteSubdocument(subdocument.id)}
                className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
              >
                <LucideDelete className="w-4 h-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
