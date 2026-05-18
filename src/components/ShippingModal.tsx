import React from "react";
import { X } from "lucide-react";

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ShippingModal = ({
  isOpen,
  onClose,
  title,
  children,
}: ShippingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm z-20">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-md shadow-ambient-2xl max-h-[90vh] overflow-y-auto flex flex-col relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Header del Modal */}
        <div className="sticky top-0 bg-surface-container-lowest pt-6 pb-4 px-6 border-b border-surface-dim flex justify-between items-center z-30 rounded-t-md">
          <h2 className="text-title-lg text-primary m-0">{title}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-on-surface-variant hover:text-primary transition-smooth bg-surface-dim p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-8">{children}</div>
      </div>
    </div>
  );
};

export default ShippingModal;
