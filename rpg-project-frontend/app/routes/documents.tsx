import { StarSky } from "../components/StarSky";
import { Header } from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ClassesTab } from "../components/documents/tabs/ClassesTab";
import { AttributesTab } from "../components/documents/tabs/AttributesTab";
import ConversionTab from "../components/documents/tabs/ConversionsTab";
import RuleBookModal from "../components/documents/dialogs/RuleBookModal";
import { ItemsTab } from "../components/documents/tabs/ItemsTab";


export default function DocumentsPage() {
    return (
        <StarSky>
            <Header> 
                <RuleBookModal />
            </Header>

            <div className="container mx-auto py-8 w-wide">
                <Tabs defaultValue="classes" className="w-full">
                    <TabsList className="bg-vaccineGray-800/20 min-h-[40px] rounded-md w-full p-1 mb-6">
                        <TabsTrigger value="classes" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple text-sm font-medium px-3 py-2 rounded-md">
                            Classes
                        </TabsTrigger>
                        <TabsTrigger value="attributes" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple text-sm font-medium px-3 py-2 rounded-md">
                            Attributes
                        </TabsTrigger>
                        <TabsTrigger value="conversion" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple text-sm font-medium px-3 py-2 rounded-md">
                            Regras de Conversão
                        </TabsTrigger>
                        <TabsTrigger value="items" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple text-sm font-medium px-3 py-2 rounded-md">
                            Itens
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="classes">
                        <ClassesTab />
                    </TabsContent>

                    <TabsContent value="attributes">
                        <AttributesTab />
                    </TabsContent>

                    <TabsContent value="conversion">
                        <ConversionTab />
                    </TabsContent>
                    <TabsContent value="items">
                        <ItemsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </StarSky>
    );
}