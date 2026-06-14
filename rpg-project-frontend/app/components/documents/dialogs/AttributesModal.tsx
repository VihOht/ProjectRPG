import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import CreateAttributeForm from "../cards/CreateAttributeForm";
import CreatePericiaForm from "../cards/CreatePericiaForm";


export default function AttributesModal() {
    const [openCreateAttribute, setOpenCreateAttribute] =
        useState(false);

    return (
        <>  
            <button
                onClick={() => setOpenCreateAttribute(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                Novo Documento
            </button>
            <AppModal
                open={openCreateAttribute}
                title="Modal para criação de atributo."
                onClose={() => setOpenCreateAttribute(false)}
            >
                <>    
                    <Tabs defaultValue="attribute">
                        <TabsList className="bg-vaccineGray-800/20 min-h-[40px] rounded-md w-full p-1 mb-6">
                            <TabsTrigger value="attribute" className=" data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple">
                                Attributo
                            </TabsTrigger>
                            <TabsTrigger value="pericia" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple">
                                Pericia
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="attribute">
                            <CreateAttributeForm onSucess={() => setOpenCreateAttribute(false)} />
                        </TabsContent>
                        <TabsContent value="pericia">
                            <CreatePericiaForm onSucess={() => setOpenCreateAttribute(false)} />
                        </TabsContent>
                    </Tabs>
                    
                </>
            </AppModal>
        </>
        
    );
}