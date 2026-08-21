import { useState, type ChangeEvent, type FormEvent } from "react";
import { LucideDelete, LucidePlus } from "lucide-react";
import toast from "react-hot-toast";

import {
  useCreateRace,
  useDeleteLoreDocument,
  useDeleteLoreImage,
  useDeleteLoreSession,
  useDeleteLoreSubdocument,
  useDeleteRace,
  useRaces,
  useLore,
} from "../../../hooks";
import { useAuthProvider } from "../../../providers";
import { racesRepository } from "../../../repositories/gameDataRepositories";
import { AppModal } from "../../ui/AppModal";
import type {
  CreateRaceRequest,
  LoreDocument,
  LoreImage,
  LoreSession,
  RaceItem,
} from "../../../types";
import UpdateRaceModal from "../dialogs/UpdateSpeciesModal";

type DeleteHandler = (id: number) => void;

function SpeciesModal({
  refetchRaces,
}: {
  refetchRaces: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateRaceRequest>({
    name: "",
    description: "",
  });
  const { mutate: createRace, isPending } = useCreateRace();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Preencha nome e descrição da espécie.");
      return;
    }

    createRace(formData, {
      onSuccess: async () => {
        await racesRepository.syncAll();
        await refetchRaces();
        toast.success("Espécie criada com sucesso.");
        setFormData({ name: "", description: "" });
        setOpen(false);
      },
      onError: () => {
        toast.error("Erro ao criar espécie.");
      },
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
        aria-label="Criar espécie"
      >
        <LucidePlus className="w-4 h-4" />
      </button>

      <AppModal
        open={open}
        title="Criar espécie"
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="speciesName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Nome
            </label>
            <input
              type="text"
              id="speciesName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="speciesDescription"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Descrição
            </label>
            <textarea
              id="speciesDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-vaccineGray-800/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vaccinePurple focus:border-transparent text-sm text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Criando..." : "Criar espécie"}
          </button>
        </form>
      </AppModal>
    </>
  );
}

function SpeciesItem({
  race,
  refetch,
  onDelete,
  isAdmin,
}: {
  race: RaceItem;
  refetch: () => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className="bg-vaccineBlueTones-1000/20 rounded-md md:p-4 p-2 border border-vaccineGray-200/20 border-1">
      <div className="flex items-start justify-between gap-3">
        <h3
          onClick={() => setOpen(!open)}
          className="text-2xl font-semibold text-vaccinePurple hover:underline w-[70%] cursor-pointer"
        >
          {race.name}
        </h3>

        {isAdmin && (
          <div className="flex mt-2 gap-2">
            <UpdateRaceModal raceData={race} refetch={refetch} />

            <button
              type="button"
              onClick={() => onDelete(race.id)}
              className="rounded-md bg-vaccinePurple px-3 py-1 text-sm text-white hover:opacity-90"
            >
              <LucideDelete className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div
        className={`overflow-x-auto transition-all duration-500 ${
          open ? "max-h-screen" : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <p className="text-vaccineGray-400">{race.description}</p>
      </div>
    </article>
  );
}

export function LoreTab() {
  const { user } = useAuthProvider();
  const { data: loreData, isLoading, refetch } = useLore();
  const { data: raceData, refetch: refetchRaces } = useRaces();
  const { mutate: deleteLoreSession } = useDeleteLoreSession();
  const { mutate: deleteLoreDocument } = useDeleteLoreDocument();
  const { mutate: deleteLoreImage } = useDeleteLoreImage();
  const { mutate: deleteLoreSubdocument } = useDeleteLoreSubdocument();
  const { mutate: deleteRace } = useDeleteRace();

  const isAdmin = user?.role === "ADMIN";
  const sessions = loreData?.sessions ?? [];
  const races = raceData?.races ?? [];

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

  const onDeleteRaces = (RaceId: number) => {
    if (!confirm("Tem certeza que deseja excluir este espécie?")) {
      return;
    }

    deleteLoreSubdocument(RaceId, {
      onSuccess: () => {
        toast.success("Espécie excluida com sucesso.");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao excluir espécie.");
      },
    });
  };

  const onDeleteRace = (raceId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta espécie?")) {
      return;
    }

    deleteRace(raceId, {
      onSuccess: async () => {
        await racesRepository.syncAll();
        await refetchRaces();
        toast.success("Espécie excluida com sucesso.");
      },
      onError: () => {
        toast.error("Erro ao excluir espécie.");
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
      <div className="flex items-center justify-between">
        <div className="p-2">
          <h2 className="text-2xl font-semibold text-vaccineGray-300">
            Lore
          </h2>
          <p className="text-vaccineGray-600">
            Visualização hierárquica de espécies, sessões e documentos.
          </p>
        </div>
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="p-2">
            <h3 className="text-2xl font-semibold text-vaccineGray-300">
              Espécies
            </h3>
            <p className="text-vaccineGray-600">
              Lista das espécies existentes na mesa.
            </p>
          </div>

          {isAdmin && <SpeciesModal refetchRaces={refetchRaces} />}
        </div>

        {races.length === 0 ? (
          <p className="text-gray-600">Nenhuma espécie encontrada.</p>
        ) : (
          <div className="space-y-2 w-full break-words">
            {races.map((race) => (
              <SpeciesItem
                key={race.id}
                race={race}
                refetch={refetchRaces}
                onDelete={onDeleteRace}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </section>

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
              onDeleteRaces={onDeleteRaces}
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
  onDeleteRaces,
}: {
  session: LoreSession;
  isAdmin: boolean;
  onDeleteSession: DeleteHandler;
  onDeleteDocument: DeleteHandler;
  onDeleteImage: DeleteHandler;
  onDeleteRaces: DeleteHandler;
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
          onDeleteRaces={onDeleteRaces}
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
  onDeleteRaces,
}: {
  documents: LoreDocument[];
  isAdmin: boolean;
  onDeleteDocument: DeleteHandler;
  onDeleteRaces: DeleteHandler;
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
                onDeleteRaces={onDeleteRaces}
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
  onDeleteRaces,
}: {
  document: LoreDocument;
  isAdmin: boolean;
  onDeleteRaces: DeleteHandler;
}) {
  if (document.subdocuments.length === 0) {
    return <p className="mt-2 text-sm text-vaccineGray-600">Sem espécies.</p>;
  }

  return (
    <div className="mt-3 border-l-4 border-vaccinePurple md:pl-4 pl-2">
      <p className="font-medium mb-2 text-vaccineGray-300">Espécies</p>

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
                onClick={() => onDeleteRaces(subdocument.id)}
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
