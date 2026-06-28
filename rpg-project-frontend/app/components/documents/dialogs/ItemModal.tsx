import { useState } from "react";
import { LucidePlus } from "lucide-react";

import { AppModal } from "../../ui/AppModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

import CreateItemForm from "../cards/CreateItemForm";

export default function ItemModal() {
  const [openCreateItem, setOpenCreateItem] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenCreateItem(true)}
        className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
      >
        <LucidePlus className="w-4 h-4" />
      </button>

      <AppModal
        open={openCreateItem}
        title="Modal para criação de itens."
        onClose={() => setOpenCreateItem(false)}
      >
        <Tabs defaultValue="weapon">
          <TabsList className="bg-vaccineGray-800/20 min-h-[40px] rounded-md w-full p-1 mb-6">
            <TabsTrigger
              value="weapon"
              className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple"
            >
              Arma
            </TabsTrigger>

            <TabsTrigger
              value="armor"
              className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple"
            >
              Armadura
            </TabsTrigger>

            <TabsTrigger
              value="artefact"
              className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple"
            >
              Artefato
            </TabsTrigger>

            <TabsTrigger
              value="utility"
              className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple"
            >
              Utilitário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weapon">
            <CreateItemForm
              defaultType="weapon"
              onSucess={() => setOpenCreateItem(false)}
            />
          </TabsContent>

          <TabsContent value="armor">
            <CreateItemForm
              defaultType="armor"
              onSucess={() => setOpenCreateItem(false)}
            />
          </TabsContent>

          <TabsContent value="artefact">
            <CreateItemForm
              defaultType="artefact"
              onSucess={() => setOpenCreateItem(false)}
            />
          </TabsContent>

          <TabsContent value="utility">
            <CreateItemForm
              defaultType="utility"
              onSucess={() => setOpenCreateItem(false)}
            />
          </TabsContent>
        </Tabs>
      </AppModal>
    </>
  );
}