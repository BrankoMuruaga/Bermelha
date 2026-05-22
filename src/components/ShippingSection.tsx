import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ShippingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ShippingSection = ({
  title,
  icon,
  children,
  defaultOpen = false,
}: ShippingSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="flex flex-col gap-4 w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full border-b border-surface-dim pb-2 cursor-pointer bg-transparent text-left outline-none group text-on-surface"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-label-lg font-bold m-0 group-hover:text-primary transition-smooth">
            {title}
          </h3>
        </div>

        <ChevronDown
          size={18}
          className={`text-on-surface-variant transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 overflow-hidden"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pt-1 pb-2">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default ShippingSection;
