import React from "react";

interface ShippingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ShippingSection = ({ title, icon, children }: ShippingSectionProps) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-surface-dim pb-2">
        {icon}
        <h3 className="text-label-lg text-on-surface m-0">{title}</h3>
      </div>
      {children}
    </section>
  );
};

export default ShippingSection;
