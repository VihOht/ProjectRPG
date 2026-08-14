import { useState } from "react";
import toast from "react-hot-toast";
import { LucideDelete } from "lucide-react";

import type {
  AttributeItem,
  AttributePowerItem,
  PericiaItem,
} from "../../../types";
import {
  useAttributePowers,
  useAttributes,
  useDeleteAttribute,
  useDeleteAttributePower,
  useDeletePericia,
  usePericias,
} from "../../../hooks";
import { useAuthProvider } from "../../../providers";
import AttributesModal from "../dialogs/AttributesModal";
import UpdateAttributeModal from "../dialogs/UpdateAttributeModal";
import UpdateAttributePowerModal from "../dialogs/UpdateAttributePowerModal";
import UpdatePericiaModal from "../dialogs/UpdatePericiaModal";

export function AttributesTab() {
  const { user } = useAuthProvider();
  const { data: attributesData, isLoading, refetch } = useAttributes();
  const { data: periciasData } = usePericias();
  const { data: attributePowerData } = useAttributePowers();

  const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(
    null,
  );
  const [selectedPericiaId, setSelectedPericiaId] = useState<number | null>(
    null,
  );
  const { mutate: deleteAttribute } = useDeleteAttribute();
  const { mutate: deletePericia } = useDeletePericia();
  const { mutate: deleteAttributePower } = useDeleteAttributePower();
  const attributes: AttributeItem[] = attributesData?.attributes ?? [];
  const isAdmin = user?.role === "ADMIN";

  const powersByAttribute = attributePowerData?.attribute_powers.reduce(
    (acc, power) => {
      if (!acc[power.attribute_id]) {
        acc[power.attribute_id] = [];
      }

      acc[power.attribute_id].push(power);
      return acc;
    },
    {} as Record<number, AttributePowerItem[]>,
  );

  const periciasByAttribute = periciasData?.pericias.reduce(
    (acc, pericia) => {
      if (!acc[pericia.attribute_id]) {
        acc[pericia.attribute_id] = [];
      }

      acc[pericia.attribute_id].push(pericia);
      return acc;
    },
    {} as Record<number, PericiaItem[]>,
  );

  const onDeleteAttribute = (attributeId: number) => {
    const confirmed =
      confirm(
        "Tem certeza que deseja excluir este atributo? Isso tambem excluira todas as pericias associadas.",
      ) &&
      confirm(
        "Voce tem realmente certeza? Por Anarion? Ao excluir todos as fichas sofrerao alteracao.",
      );

    if (!confirmed) {
      return;
    }

    deleteAttribute(attributeId, {
      onSuccess: () => {
        toast.success("Atributo excluido com sucesso!");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao excluir atributo. Tente novamente.");
      },
    });
  };

  const onAttributePowerDelete = (powerId: number) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este poder de atributo? Isso pode afetar as fichas dos personagens.",
      )
    ) {
      return;
    }

    deleteAttributePower(powerId, {
      onSuccess: () => {
        toast.success("Poder de atributo excluido com sucesso!");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao excluir poder de atributo. Tente novamente.");
      },
    });
  };

  const onAttributeClick = (attribute: AttributeItem) => {
    setSelectedPericiaId(null);
    setSelectedAttributeId((prev) =>
      prev === attribute.id ? null : attribute.id,
    );
  };

  const onPericiaClick = (pericia: PericiaItem) => {
    setSelectedPericiaId((prev) => (prev === pericia.id ? null : pericia.id));
  };

  const onDeletePericia = (periciaId: number) => {
    const confirmed =
      confirm(
        "Tem certeza que deseja excluir esta pericia? Isso pode afetar as fichas dos personagens.",
      ) &&
      confirm(
        "Voce tem realmente certeza? Por Anarion? Ao excluir todos as fichas sofrerao alteracao.",
      );

    if (!confirmed) {
      return;
    }

    deletePericia(periciaId, {
      onSuccess: () => {
        toast.success("Pericia excluida com sucesso!");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao excluir pericia. Tente novamente.");
      },
    });
  };

  if (isLoading) {
    return <p className="text-gray-600">Carregando atributos...</p>;
  }

  if (!user) {
    return <p className="text-gray-600">Usuario nao autenticado.</p>;
  }

  return (
    <div className="w-full space-y-6 md:px-4 md:py-6 px-2 py-4">
      <div className="flex items-center justify-between">
        <div className="p-2">
          <h2 className="text-2xl font-semibold text-vaccineGray-300">
            Atributos
          </h2>
          <p className="text-vaccineGray-600">
            Visualizacao hierarquica de atributos, poderes e pericias.
          </p>
        </div>

        {isAdmin && <AttributesModal />}
      </div>

      {attributes.length === 0 ? (
        <p className="text-gray-600">Nenhum atributo cadastrado.</p>
      ) : (
        <div className="space-y-2 w-full break-words">
          {attributes.map((attribute) => {
            const isSelected = selectedAttributeId === attribute.id;
            const attributePericias =
              periciasByAttribute?.[attribute.id] ?? [];
            const attributePowers = powersByAttribute?.[attribute.id] ?? [];

            return (
              <article
                key={attribute.id}
                className="bg-vaccineBlueTones-1000/20 rounded-md md:p-4 p-2 border border-vaccineGray-200/20 border-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    onClick={() => onAttributeClick(attribute)}
                    className="text-2xl font-semibold text-vaccinePurple hover:underline w-[70%] cursor-pointer"
                  >
                    {attribute.name}
                  </h3>

                  {isAdmin && (
                    <div className="flex mt-2 gap-2">
                      <UpdateAttributeModal
                        attributeData={attribute}
                        refetch={refetch}
                      />
                      <button
                        type="button"
                        onClick={() => onDeleteAttribute(attribute.id)}
                        className="rounded-md bg-vaccinePurple px-3 py-1 text-sm text-white hover:opacity-90"
                      >
                        <LucideDelete className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className={`overflow-x-auto transition-all duration-500 ${
                    isSelected
                      ? "max-h-screen"
                      : "max-h-0 overflow-hidden opacity-0"
                  }`}
                >
                  <p className="text-vaccineGray-400">
                    {attribute.description}
                  </p>

                  <div className="mb-3 mt-4 break-words">
                    <h4 className="font-semibold text-vaccineGray-300 mt-2 mb-2">
                      Poderes
                    </h4>

                    {attributePowers.length > 0 ? (
                      <ul className="space-y-2 pl-2 text-vaccineGray-800">
                        {attributePowers.map((power) => (
                          <li
                            key={power.id}
                            className="flex text-vaccineGray-400 items-start justify-between gap-3 rounded-md border border-vaccineGray-200/20 px-3 py-2"
                          >
                            <div className="flex-1">
                              <h5 className="font-semibold">
                                {power.name} - Nv: {power.level_to_unlock}:{" "}
                                <span className="text-sm text-vaccineGray-600">
                                  {power.description}
                                </span>
                              </h5>
                            </div>

                            {isAdmin && (
                              <div className="flex md:flex-row flex-col gap-2">
                                <UpdateAttributePowerModal
                                  attributePowerData={power}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    onAttributePowerDelete(power.id)
                                  }
                                  className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
                                >
                                  <LucideDelete className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-vaccineGray-600">
                        Nenhum poder associado a este atributo.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-vaccineGray-300 mb-2">
                      Pericias
                    </h4>

                    {attributePericias.length > 0 ? (
                      <ul className="space-y-2 pl-2 text-vaccineGray-800">
                        {attributePericias.map((pericia) => {
                          const periciaSelected =
                            selectedPericiaId === pericia.id;

                          return (
                            <li
                              key={pericia.id}
                              className="text-vaccineGray-400 rounded-md border border-vaccineGray-200/20 px-3 py-2"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={() => onPericiaClick(pericia)}
                                  className="flex-1 text-left font-semibold text-vaccineGray-400 hover:text-vaccinePurple hover:underline"
                                >
                                  {pericia.name}
                                </button>

                                {isAdmin && (
                                  <div className="flex md:flex-row flex-col gap-2">
                                    <UpdatePericiaModal
                                      periciaData={pericia}
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onDeletePericia(pericia.id)
                                      }
                                      className="rounded-md bg-vaccinePurple px-3 py-1 text-xs text-white hover:opacity-90"
                                    >
                                      <LucideDelete className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {periciaSelected && (
                                <p className="mt-2 text-sm text-vaccineGray-600">
                                  {pericia.description}
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-vaccineGray-600">
                        Nenhuma pericia associada a este atributo.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
