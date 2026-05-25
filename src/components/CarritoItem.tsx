import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { QuantityControls } from "@/components/QuantityControl";

type Customizations = Record<string, any>;

interface CarritoItemProps {
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagenPrincipal: string;
    centimetros: number;
    quantity: number;
    customizations?: Customizations;
  };
}

const CarritoItem = ({ producto }: CarritoItemProps) => {
  const { add, decreaseOne, remove } = useCart();
  const subtotal = producto.precio * producto.quantity;

  const hasCustomizations =
    producto.customizations && Object.keys(producto.customizations).length > 0;

  return (
    <li className="flex items-center gap-4 py-5 border-b border-surface-dim last:border-0">
      <img
        src={producto.imagenPrincipal}
        alt={producto.nombre}
        className="w-20 h-20 object-cover rounded-md shrink-0"
      />

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex sm:flex-row flex-col justify-start sm:items-center  ">
          <h2 className="text-title-md text-on-surface">{producto.nombre}</h2>

          {hasCustomizations && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(producto.customizations!).map(([key, value]) => (
                <span
                  key={key}
                  className="text-[11px] bg-surface-variant text-on-surface-variant sm:px-2 rounded-sm font-medium capitalize"
                >
                  {key}: {value.label || value.value}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-body-md text-on-surface-variant mt-1">
          ${producto.precio.toLocaleString()} por unidad
        </p>

        <div className="mt-1">
          <QuantityControls
            quantity={producto.quantity}
            onIncrease={() => add(producto.id, producto.customizations)}
            onDecrease={() => decreaseOne(producto.id, producto.customizations)}
            size="lg"
          />
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <p className="text-title-md text-primary">
          ${subtotal.toLocaleString()}
        </p>
        <IconButton
          icon={<Trash2 size={16} />}
          onClick={() => remove(producto.id, producto.customizations)}
          aria-label={`Eliminar ${producto.nombre} del carrito`}
          className="text-on-surface-variant hover:text-red-500 transition-smooth active:scale-85 hover:scale-115"
        />
      </div>
    </li>
  );
};

export default CarritoItem;
