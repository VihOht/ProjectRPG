// components/ui/AppModal.tsx

import { type ReactNode } from "react";

interface AppModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function AppModal({
  open,
  title,
  onClose,
  children,
}: AppModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto">
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="w-full max-w-2xl rounded-lg bg-vaccineBlueTones-1000 border border-vaccinePurple md:p-6 p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="text-white hover:text-red-400"
            >
              ✕
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}