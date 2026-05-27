import React, { useEffect, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);

  // Accesibilidad: Cerrar con la tecla Escape y bloquear scroll del body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Retornar el foco al abrirse (opcional pero recomendado para accesibilidad)
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-screen flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm z-20"
      onClick={onClose} // Cierra al hacer click en el backdrop fuera del modal
    >
      <section
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-surface-container-lowest w-full max-w-lg rounded-md shadow-ambient-2xl max-h-[90vh] flex flex-col overflow-hidden relative outline-none"
        onClick={(e) => e.stopPropagation()} // Evita que el click interno cierre el modal
      >
        {/* Encabezado Semántico */}
        <header className="pt-6 pb-4 px-6 border-b border-surface-dim flex justify-between items-center bg-surface-container-lowest rounded-t-md">
          <h2 id="modal-title" className="text-title-lg text-primary m-0">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="cursor-pointer text-on-surface-variant hover:text-primary transition-smooth bg-surface-dim p-2 rounded-full"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Contenido Principal del Modal */}
        <div className="p-6 flex flex-col gap-8 overflow-y-auto flex-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </section>
    </div>
  );
};

export default ShippingModal;
