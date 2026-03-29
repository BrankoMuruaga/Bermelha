import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { IconButton } from "./IconButton";

interface CartButtonProps {
  onAddToCart: () => void;
  decreaseOne: () => void;
  quantity: number;
  name: string;
}

const CartButton = ({
  onAddToCart,
  decreaseOne,
  quantity,
  name,
}: CartButtonProps) => {
  const { hydrated } = useCart();

  if (hydrated && quantity > 0) {
    return (
      <div className="flex items-center gap-2">
        <IconButton
          icon={<Minus className="size-6 sm:size-4" />}
          onClick={decreaseOne}
          variant="ghost"
          className="p-2 text-base"
          aria-label={`Quitar una unidad de ${name} del carrito`}
        />
        <span className="text-title-md w-5 text-center">{quantity}</span>
        <IconButton
          icon={<Plus className="size-6 sm:size-4" />}
          onClick={onAddToCart}
          variant="primary"
          className="p-2 text-base"
          aria-label={`Agregar otra unidad de ${name} al carrito`}
        />
      </div>
    );
  }

  return (
    <IconButton
      icon={<ShoppingCart size={24} />}
      onClick={onAddToCart}
      size="md"
      variant="primary"
      aria-label={`Agregar ${name} al carrito`}
      className="group-hover:scale-105 active:scale-90 transition-fast"
    />
  );
};

export default CartButton;
