import { useState } from "react";
import { AppModal } from "../../ui/AppModal";


export default function RuleBookModal() {
    const [open, setOpen] =
        useState(false);

    return (
        <>  
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition"
            >
                Livro de Regras
            </button>
            <AppModal
                open={open}
                title="Livro de Regras"
                onClose={() => setOpen(false)}
                resize={true}
            >
                {open && (
                    <div className="overflow-hidden w-full h-[80vh]">
                        <iframe
                        src="https://docs.google.com/document/d/1wfryWaJuTg85Uz13jiGJPpM9ny5E8kETgUDOrGeTIfc/edit?tab=t.0#heading=h.99qkcvo0xj2"
                        title="Secure Document Viewer"
                        className="border-none origin-top-left"
                        style={{
                        transform: "scale(0.8)", // 80% zoom
                        width: "125%",           // 100 / 0.8
                        height: "125%",
                        }}
                        />
                    </div>
                )}
            </AppModal>
        </>
        
    );
}