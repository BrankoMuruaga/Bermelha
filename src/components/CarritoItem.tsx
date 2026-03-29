import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { IconButton } from "./IconButton";
import { QuantityControls } from "./QuantityControl";

interface CarritoItemProps {
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagenPrincipal: string;
    centimetros: number;
    quantity: number;
  };
}

const CarritoItem = ({ producto }: CarritoItemProps) => {
  const { add, decreaseOne, remove } = useCart();
  const subtotal = producto.precio * producto.quantity;

  return (
    <li className="flex items-center gap-4 py-5 border-b border-surface-dim last:border-0">
      <img
        src={producto.imagenPrincipal}
        alt={producto.nombre}
        className="w-20 h-20 object-cover rounded-md shrink-0"
      />

      <div className="flex-1 flex flex-col gap-1">
        <h2 className="text-title-md text-on-surface">{producto.nombre}</h2>
        <p className="text-body-md text-on-surface-variant">
          ${producto.precio.toLocaleString()} por unidad
        </p>

        {/* Controles de cantidad */}
        <QuantityControls
          quantity={producto.quantity}
          onIncrease={() => add(producto.id)}
          onDecrease={() => decreaseOne(producto.id)}
        />
      </div>

      {/* Subtotal + eliminar */}
      <div className="flex flex-col items-end gap-3">
        <p className="text-title-md text-primary">
          ${subtotal.toLocaleString()}
        </p>
        <IconButton
          icon={<Trash2 size={16} />}
          onClick={() => remove(producto.id)}
          aria-label={`Eliminar ${producto.nombre} del carrito`}
          className="text-on-surface-variant hover:text-red-500 transition-smooth active:scale-85 hover:scale-115"
        ></IconButton>
      </div>
    </li>
  );
};

export default CarritoItem;
