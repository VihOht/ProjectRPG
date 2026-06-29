import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";


export interface SheetSectionProps {
    title: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    onOpenChange?: (open: boolean) => void;
}

export function SheetSection({ title, actions, children, className, onOpenChange }: SheetSectionProps) {
    return (
        <Accordion type="single" collapsible className={`w-full ${className || ''}`} onValueChange={(value) => onOpenChange?.(value !== "")}>
            <AccordionItem value={title} className="mb-8 bg-vaccineBlueTones-900/10 p-4 rounded-md">
                <div className="itens-center flex justify-between">
                    <AccordionTrigger>
                        <h1 className="text-3xl w-[100%] cursor-pointer font-walthari font-semibold mb-4 text-vaccineGray-300">
                            {title}
                        </h1>
                    </AccordionTrigger>

                    {actions && (
                        <div className="ml-2 flex items-center gap-2">
                        {actions}
                        </div>
                    )}
                </div>
                <AccordionContent>
                    {children}
                </AccordionContent>
            </AccordionItem> 
        </Accordion>
    );
}