import { useState } from "react";
import { AppModal } from "../../ui/AppModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import CreateConversionRuleForm from "../cards/CreateConversionRuleForm";
import CreateLevelUpRuleForm from "../cards/CreateLevelUpRuleForm";


export default function ConversionRulesModal() {
    const [openCreateConversionRule, setOpenCreateConversionRule] =
        useState(false);

    return (
        <>  
            <button
                onClick={() => setOpenCreateConversionRule(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                Nova Regra de Conversão
            </button>
            <AppModal
                open={openCreateConversionRule}
                title="Modal para criação de regra de conversão."
                onClose={() => setOpenCreateConversionRule(false)}
            >
                <>    
                    <Tabs defaultValue="conversion" className="w-full">
                        <TabsList className="bg-vaccineGray-800/20 min-h-[40px] rounded-md w-full p-1 mb-6">
                            <TabsTrigger value="conversion" className=" data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple">
                                Regra de Conversão de Atributo
                            </TabsTrigger>
                            <TabsTrigger value="levelup" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple">
                                Regras de Level Up
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="conversion">
                            <CreateConversionRuleForm onSucess={() => setOpenCreateConversionRule(false)} />
                        </TabsContent>
                        <TabsContent value="levelup">
                            <CreateLevelUpRuleForm onSucess={() => setOpenCreateConversionRule(false)} />
                        </TabsContent>
                    </Tabs>
                    
                </>
            </AppModal>
        </>
        
    );
}