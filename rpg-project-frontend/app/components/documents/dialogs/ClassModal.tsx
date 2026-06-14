import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import CreateClassForm from "../cards/CreateClassForm";
import CreateSubclassForm from "../cards/CreateSubclassForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import CreateClassAbilityForm from "../cards/CreateClassAbilityForm";
import CreateClassPowerForm from "../cards/CreateClassPowerForm";



export default function ClassModal() {
    const [openCreateClass, setOpenCreateClass] =
        useState(false);

    return (
        <>  
            <button
                onClick={() => setOpenCreateClass(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                Novo Documento
            </button>
            <AppModal
                open={openCreateClass}
                title="Modal para criação de classe, subclasse, abilidades e poderes de classe."
                onClose={() => setOpenCreateClass(false)}
            >
                <>    
                    <Tabs defaultValue="class">
                        <TabsList className="bg-vaccineGray-800/20 min-h-[40px] rounded-md w-full p-1 mb-6">
                            <TabsTrigger value="class" className=" data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple">
                                Classe
                            </TabsTrigger>
                            <TabsTrigger value="subclass" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple">
                                Subclasse
                            </TabsTrigger>
                            <TabsTrigger value="ability" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple">
                                Abilidade de classe
                            </TabsTrigger>
                            <TabsTrigger value="class-power" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple">
                                Poder de classe
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="class">
                            <CreateClassForm onSucess={() => setOpenCreateClass(false)} />
                        </TabsContent>
                        <TabsContent value="subclass">
                            <CreateSubclassForm onSucess={() => setOpenCreateClass(false)} />
                        </TabsContent>
                        <TabsContent value="ability">
                            <CreateClassAbilityForm onSucess={() => setOpenCreateClass(false)} />
                        </TabsContent>
                        <TabsContent value="class-power">
                            <CreateClassPowerForm onSucess={() => setOpenCreateClass(false)} />
                        </TabsContent>
                    </Tabs>
                    
                </>
            </AppModal>
        </>
        
    );
}