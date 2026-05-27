import { Trash } from "lucide-react";
import React from "react";

interface AddressCardProps {
  id: string;
  alias: string;
  street: string;
  number: string;
  postalCode: string;
  selectedId: string | null;
  handleSelectAndClose: (id: string) => void;
  handleDelete: (id: string, e: React.MouseEvent) => void;
}

const AddressCard = ({
  id,
  alias,
  street,
  number,
  postalCode,
  selectedId,
  handleSelectAndClose,
  handleDelete,
}: AddressCardProps) => {
  return (
    <article
      key={id}
      onClick={() => handleSelectAndClose(id)}
      className={`p-4 rounded-md cursor-pointer border-2 transition-smooth relative ${
        selectedId === id
          ? "border-primary bg-surface"
          : "border-surface-dim surface-high hover:border-outline-variant"
      }`}
    >
      <button
        onClick={(e) => handleDelete(id, e)}
        className="cursor-pointer absolute top-4 right-4 text-on-surface-variant hover:text-red-500 transition-smooth"
        title="Eliminar"
      >
        <Trash size={18} />
      </button>
      <p className="text-label-md text-primary font-bold mb-1">{alias}</p>
      <p className="text-body-md text-on-surface m-0">
        {street} {number}
      </p>
      <p className="text-body-sm text-on-surface-variant m-0">
        CP: {postalCode}
      </p>
    </article>
  );
};

export default AddressCard;
