import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LucideDelete,
  LucideEye,
  LucideEyeOff,
  LucideClock,
  LucideClock3,
} from "lucide-react";

import { useAuthProvider } from "../../../providers";
import {
  useItems,
  useDeleteItem,
  useToggleItemVisibility,
  useToggleItemTemporary,
} from "../../../hooks";

import type { Item } from "../../../types";

import ItemModal from "../dialogs/ItemModal";
import UpdateItemModal from "../dialogs/UpdateItemModal";

export function ItemsTab() {
  const { user } = useAuthProvider();
  const { data: itemsData, isLoading } = useItems();

  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (itemsData?.items) {
      setItems(itemsData.items);
    }
  }, [itemsData]);

  useEffect(() => {
    if (!user) return;
    setIsAdmin(user.role === "ADMIN");
  }, [user]);

  if (isLoading) {
    return <p className="text-gray-600">Carregando itens...</p>;
  }

  if (!user) {
    return <p className="text-gray-600">Usuário não autenticado.</p>;
  }

  const permanentItems = items.filter((item) => !item.temporary);
  const temporaryItems = items.filter((item) => item.temporary);

  return (
    <div className="w-full space-y-8 md:px-4 px-2 md:py-6 py-4">
      <div className="flex items-center justify-between">
        <div className="p-2">
          <h2 className="text-2xl font-semibold text-vaccineGray-300">
            Itens
          </h2>

          <p className="text-vaccineGray-600">
            Visualização de armas, armaduras, artefatos e utilitários.
          </p>
        </div>

        {isAdmin && <ItemModal />}
      </div>

      <section className="space-y-5">
        <div className="space-y-3 w-full break-words">
          <ItemGroup
            title="Itens permanentes"
            description="Itens comuns disponíveis no sistema."
            items={permanentItems}
            isAdmin={isAdmin}
            emptyMessage="Nenhum item cadastrado."
          />

          <ItemGroup
            title="Temporários"
            description="Itens marcados como temporários."
            items={temporaryItems}
            isAdmin={isAdmin}
            emptyMessage="Nenhum item temporário cadastrado."
          />
        </div>
      </section>
    </div>
  );
}

type ItemCardProps = {
  item: Item;
  isAdmin: boolean;
};

function ItemCard({ item, isAdmin }: ItemCardProps) {
  const { mutate: deleteItemService } = useDeleteItem();
  const { mutate: toggleItemVisibility } = useToggleItemVisibility(item.id);
  const { mutate: toggleItemTemporary } = useToggleItemTemporary(item.id);
  const { refetch: refetchItems } = useItems();

  const [open, setOpen] = useState(false);

  const onDeleteItem = async (itemId: number) => {
    if (
      confirm(
        "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
      )
    ) {
      deleteItemService(itemId, {
        onSuccess: () => {
          toast.success("Item excluído com sucesso.");
          refetchItems();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Ocorreu um erro ao excluir o item."
          );
        },
      });
    }
  };

  const onToggleVisibility = () => {
    toggleItemVisibility(undefined, {
      onSuccess: () => {
        toast.success("Visibilidade do item atualizada com sucesso.");
        refetchItems();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Erro ao atualizar visibilidade do item."
        );
      },
    });
  };

  const onToggleTemporary = () => {
    toggleItemTemporary(undefined, {
      onSuccess: () => {
        toast.success("Status temporário do item atualizado com sucesso.");
        refetchItems();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Erro ao atualizar status temporário do item."
        );
      },
    });
  };

  return (
    <article className="bg-vaccineBlueTones-1000/20 rounded-md md:px-3 px-2 py-1 border border-vaccineGray-200/20">
      <div className="flex items-start justify-between gap-3">
        <div className="w-[70%]">
          <h3
            onClick={() => setOpen(!open)}
            className="text-base font-semibold text-vaccinePurple hover:underline cursor-pointer"
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
                Temporário
              </span>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex justify-gap-2">
            <button
              type="button"
              onClick={onToggleVisibility}
              className="rounded-md px-2 py-1 text-xs text-white hover:opacity-90"
              title={item.hidden ? "Mostrar item" : "Ocultar item"}
            >
              {item.hidden ? <LucideEyeOff /> : <LucideEye />}
            </button>

            <button
              type="button"
              onClick={onToggleTemporary}
              className="rounded-md px-2 py-1 mr-1 text-xs text-white hover:opacity-90"
              title={
                item.temporary
                  ? "Remover dos temporários"
                  : "Marcar como temporário"
              }
            >
              {item.temporary ? <LucideClock3 /> : <LucideClock />}
            </button>

            <UpdateItemModal itemData={item} />

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
        <p className="text-vaccineGray-400 mt-2">{item.description}</p>

        <div className="flex gap-4 mt-4 flex-wrap">
          <InfoBadge label="Empilhável" value={item.stackable ? "Sim" : "Não"} />
          <InfoBadge label="Equipável" value={item.equipable ? "Sim" : "Não"} />
          <InfoBadge
            label="Qtd. Máxima"
            value={item.max_quantity ?? "Sem limite"}
          />
        </div>

        <div className="mt-4">
          {item.item_type === "weapon" && <WeaponDetails item={item} />}
          {item.item_type === "armor" && <ArmorDetails item={item} />}
          {item.item_type === "artefact" && <ArtefactDetails item={item} />}
          {item.item_type === "utility" && (
            <p className="text-vaccineGray-600">
              Item utilitário sem atributos extras.
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
      <InfoBadge label="Perícia" value={item.pericia} />
      <InfoBadge label="Crítico" value={item.critical} />
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
        <InfoBadge label="Resistência" value={item.resistance} />
        <InfoBadge label="Redução" value={item.reduction} />
        <InfoBadge label="Perícia" value={item.pericia} />
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
};

const itemTypes: {
  type: Item["item_type"];
  label: string;
}[] = [
  { type: "weapon", label: "Armas" },
  { type: "armor", label: "Armaduras" },
  { type: "artefact", label: "Artefatos" },
  { type: "utility", label: "Utilitários" },
];


function ItemGroup({
  title,
  description,
  items,
  isAdmin,
  emptyMessage,
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
};

function ItemTypeSection({ title, items, isAdmin }: ItemTypeSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-md border border-vaccineGray-200/20 bg-vaccineBlueTones-1000/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center cursor-pointer justify-between md:px-3 px-2 py-1 text-left"
      >
        <span className="text-sm font-semibold text-vaccineGray-300">
          {title}
        </span>

        <span className="text-xs text-vaccineGray-600">
          {items.length}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-2 pb-2">
          {items.length === 0 ? (
            <p className="py-1 text-xs text-vaccineGray-600">
              Nenhum item.
            </p>
          ) : (
            items.map((item) => (
              <ItemCard key={item.id} item={item} isAdmin={isAdmin} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}