import { useState } from "react";
import toast from "react-hot-toast";
import {
  LucideClock,
  LucideClock3,
  LucideDelete,
  LucideEye,
  LucideEyeOff,
} from "lucide-react";

import type { Item } from "../../../types";
import {
  useDeleteItem,
  useItems,
  useToggleItemTemporary,
  useToggleItemVisibility,
} from "../../../hooks";
import { useAuthProvider } from "../../../providers";
import ItemModal from "../dialogs/ItemModal";
import UpdateItemModal from "../dialogs/UpdateItemModal";

export function ItemsTab() {
  const { user } = useAuthProvider();
  const { data: itemsData, isLoading, refetch } = useItems();

  const items = itemsData?.items ?? [];
  const isAdmin = user?.role === "ADMIN";

  if (isLoading) {
    return <p className="text-gray-600">Carregando itens...</p>;
  }

  if (!user) {
    return <p className="text-gray-600">Usuario nao autenticado.</p>;
  }

  const permanentItems = items.filter((item) => !item.temporary);
  const temporaryItems = items.filter((item) => item.temporary);

  return (
    <div className="w-full space-y-6 md:px-4 md:py-6 px-2 py-4">
      <div className="flex items-center justify-between">
        <div className="p-2">
          <h2 className="text-2xl font-semibold text-vaccineGray-300">
            Itens
          </h2>

          <p className="text-vaccineGray-600">
            Visualizacao hierarquica de armas, armaduras, artefatos e
            utilitarios.
          </p>
        </div>

        {isAdmin && <ItemModal />}
      </div>

      <section className="space-y-5">
        <div className="space-y-4 w-full break-words">
          <ItemGroup
            title="Itens permanentes"
            description="Itens comuns disponiveis no sistema."
            items={permanentItems}
            isAdmin={isAdmin}
            emptyMessage="Nenhum item cadastrado."
            refetch={refetch}
          />

          <ItemGroup
            title="Temporarios"
            description="Itens marcados como temporarios."
            items={temporaryItems}
            isAdmin={isAdmin}
            emptyMessage="Nenhum item temporario cadastrado."
            refetch={refetch}
          />
        </div>
      </section>
    </div>
  );
}

type ItemCardProps = {
  item: Item;
  isAdmin: boolean;
  refetch: () => void;
};

function ItemCard({ item, isAdmin, refetch }: ItemCardProps) {
  const { mutate: deleteItemService } = useDeleteItem();
  const { mutate: toggleItemVisibility } = useToggleItemVisibility(item.id);
  const { mutate: toggleItemTemporary } = useToggleItemTemporary(item.id);

  const [open, setOpen] = useState(false);

  const onDeleteItem = (itemId: number) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este item? Esta acao nao pode ser desfeita.",
      )
    ) {
      return;
    }

    deleteItemService(itemId, {
      onSuccess: () => {
        toast.success("Item excluido com sucesso.");
        refetch();
      },
      onError: () => {
        toast.error("Ocorreu um erro ao excluir o item.");
      },
    });
  };

  const onToggleVisibility = () => {
    toggleItemVisibility(undefined, {
      onSuccess: () => {
        toast.success("Visibilidade do item atualizada com sucesso.");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao atualizar visibilidade do item.");
      },
    });
  };

  const onToggleTemporary = () => {
    toggleItemTemporary(undefined, {
      onSuccess: () => {
        toast.success("Status temporario do item atualizado com sucesso.");
        refetch();
      },
      onError: () => {
        toast.error("Erro ao atualizar status temporario do item.");
      },
    });
  };

  return (
    <article className="bg-vaccineBlueTones-1000/20 rounded-md md:p-4 p-2 border border-vaccineGray-200/20 border-1">
      <div className="flex items-start justify-between gap-3">
        <div className="w-[70%]">
          <h3
            onClick={() => setOpen(!open)}
            className="text-2xl font-semibold text-vaccinePurple hover:underline cursor-pointer"
          >
            {item.name}
          </h3>

          <div className="flex gap-2 flex-wrap mt-1">
            {item.hidden && (
              <span className="text-xs text-vaccineGray-400 border border-vaccineGray-200/20 rounded-md px-2 py-0.5">
                Oculto
              </span>
            )}

            {item.temporary && (
              <span className="text-xs text-vaccineGray-400 border border-vaccineGray-200/20 rounded-md px-2 py-0.5">
                Temporario
              </span>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex mt-2 gap-2">
            <button
              type="button"
              onClick={onToggleVisibility}
              className="rounded-md px-2 py-1 text-xs text-white hover:opacity-90"
              title={item.hidden ? "Mostrar item" : "Ocultar item"}
            >
              {item.hidden ? (
                <LucideEyeOff className="w-4 h-4" />
              ) : (
                <LucideEye className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onToggleTemporary}
              className="rounded-md px-2 py-1 text-xs text-white hover:opacity-90"
              title={
                item.temporary
                  ? "Remover dos temporarios"
                  : "Marcar como temporario"
              }
            >
              {item.temporary ? (
                <LucideClock3 className="w-4 h-4" />
              ) : (
                <LucideClock className="w-4 h-4" />
              )}
            </button>

            <UpdateItemModal itemData={item} refetch={refetch} />

            <button
              type="button"
              onClick={() => onDeleteItem(item.id)}
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
        <p className="text-vaccineGray-400">{item.description}</p>

        <div className="flex gap-4 mt-4 flex-wrap">
          <InfoBadge label="Empilhavel" value={item.stackable ? "Sim" : "Nao"} />
          <InfoBadge label="Equipavel" value={item.equipable ? "Sim" : "Nao"} />
          <InfoBadge
            label="Qtd. Maxima"
            value={item.max_quantity ?? "Sem limite"}
          />
        </div>

        <div className="mt-4">
          {item.item_type === "weapon" && <WeaponDetails item={item} />}
          {item.item_type === "armor" && <ArmorDetails item={item} />}
          {item.item_type === "artefact" && <ArtefactDetails item={item} />}
          {item.item_type === "utility" && (
            <p className="text-vaccineGray-600">
              Item utilitario sem atributos extras.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function InfoBadge({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="flex gap-2">
      <label className="flex items-center gap-1 text-sm text-gray-300">
        {label}:
      </label>

      <span className="w-auto h-auto text-center px-2 py-1 bg-vaccineGray-800/20 border border-gray-300/20 rounded-md text-sm text-white">
        {value}
      </span>
    </div>
  );
}

function WeaponDetails({
  item,
}: {
  item: Extract<Item, { item_type: "weapon" }>;
}) {
  return (
    <div className="flex gap-4 flex-wrap">
      <InfoBadge label="Dano" value={item.damage} />
      <InfoBadge label="Pericia" value={item.pericia} />
      <InfoBadge label="Critico" value={item.critical} />
      <InfoBadge label="Alcance" value={item.range} />
    </div>
  );
}

function ArmorDetails({
  item,
}: {
  item: Extract<Item, { item_type: "armor" }>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 flex-wrap">
        <InfoBadge label="Resistencia" value={item.resistance} />
        <InfoBadge label="Reducao" value={item.reduction} />
        <InfoBadge label="Pericia" value={item.pericia} />
        <InfoBadge label="Tamanho" value={item.size} />
      </div>

      {item.effect && (
        <p className="text-vaccineGray-400">
          <span className="font-semibold text-vaccineGray-300">Efeito:</span>{" "}
          {item.effect}
        </p>
      )}
    </div>
  );
}

function ArtefactDetails({
  item,
}: {
  item: Extract<Item, { item_type: "artefact" }>;
}) {
  return (
    <p className="text-vaccineGray-400">
      <span className="font-semibold text-vaccineGray-300">Efeito:</span>{" "}
      {item.effect}
    </p>
  );
}

type ItemGroupProps = {
  title: string;
  description: string;
  items: Item[];
  isAdmin: boolean;
  emptyMessage: string;
  refetch: () => void;
};

const itemTypes: {
  type: Item["item_type"];
  label: string;
}[] = [
  { type: "weapon", label: "Armas" },
  { type: "armor", label: "Armaduras" },
  { type: "artefact", label: "Artefatos" },
  { type: "utility", label: "Utilitarios" },
];

function ItemGroup({
  title,
  description,
  items,
  isAdmin,
  emptyMessage,
  refetch,
}: ItemGroupProps) {
  return (
    <section className="space-y-2">
      <div>
        <h3 className="text-xl font-semibold text-vaccineGray-300">
          {title}
        </h3>

        <p className="text-sm text-vaccineGray-600">{description}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-600">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          {itemTypes.map((section) => (
            <ItemTypeSection
              key={section.type}
              title={section.label}
              items={items.filter((item) => item.item_type === section.type)}
              isAdmin={isAdmin}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type ItemTypeSectionProps = {
  title: string;
  items: Item[];
  isAdmin: boolean;
  refetch: () => void;
};

function ItemTypeSection({
  title,
  items,
  isAdmin,
  refetch,
}: ItemTypeSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between border-l-4 border-vaccinePurple md:px-3 px-2 py-1 text-left"
      >
        <span className="text-sm font-semibold text-vaccineGray-300">
          {title}
        </span>

        <span className="text-xs text-vaccineGray-600">{items.length}</span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 pl-2">
          {items.length === 0 ? (
            <p className="py-1 text-xs text-vaccineGray-600">Nenhum item.</p>
          ) : (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isAdmin={isAdmin}
                refetch={refetch}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
