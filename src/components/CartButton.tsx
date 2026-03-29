import { ShoppingCart } from "lucide-react";
import { IconButton } from "./IconButton";
import { useCart } from "@/context/CartContext";

interface CartButtonProps {
  onAddToCart: () => void;
  quantity: number;
  name: string;
}

const CartButton = ({ onAddToCart, quantity, name }: CartButtonProps) => {
  const { hydrated } = useCart();
  return (
    <div className="relative">
      {hydrated && quantity > 0 && (
        <span className="group-hover:scale-105 z-10 absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {quantity}
        </span>
      )}
      <IconButton
        icon={<ShoppingCart size={24} />}
        onClick={onAddToCart}
        size="sm"
        variant="primary"
        aria-label={`Agregar ${name} al carrito`}
        className="group-hover:scale-105 active:scale-90 transition-fast"
      />
    </div>
  );
};

export default CartButton;
