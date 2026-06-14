import { StarSky } from "../components/StarSky";
import { useAuth } from "../hooks";
import { Header } from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ClassesTab } from "./documents/ClassesTab";
import { AttributesTab } from "./documents/AttributesTab";
import { useState, useEffect } from "react";
import ClassModal from "../components/documents/dialogs/ClassModal";
import ConversionTab from "./documents/ConversionTab";


export default function DocumentsPage() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!user) return;
        setIsAdmin(user.role === "ADMIN");
    }, [user]);

    return (
        <StarSky>
            <Header />

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
                        <TabsTrigger value="lore" className="data-[state=active]:bg-vaccinePurple data-[state=active]:text-white text-vaccineGray-300 hover:text-vaccinePurple text-sm font-medium px-3 py-2 rounded-md">
                            Lore
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
                    <TabsContent value="lore">
                        <p>Content for Lore</p>
                    </TabsContent>
                </Tabs>
            </div>
        </StarSky>
    );
}