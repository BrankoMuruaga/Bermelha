import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { QuantityControls } from "./QuantityControl";

interface CartButtonProps {
  onAddToCart: () => void;
  decreaseOne: () => void;
  quantity: number;
  name: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  sizeInMobile?: "sm" | "md" | "lg" | "xl" | "2xl";
  label?: string;
  className?: string;
}

const CartButton = ({
  onAddToCart,
  decreaseOne,
  quantity,
  name,
  size = "md",
  sizeInMobile,
  label,
  className = "",
}: CartButtonProps) => {
  const { hydrated } = useCart();

  const mobileSize = sizeInMobile || size;

  if (hydrated && quantity > 0) {
    return (
      <QuantityControls
        quantity={quantity}
        onIncrease={onAddToCart}
        onDecrease={decreaseOne}
        size={size}
        className={className}
      />
    );
  }

  if (label) {
    return (
      <Button
        onClick={onAddToCart}
        size={size}
        variant="primary"
        aria-label={label || `Agregar ${name} al carrito`}
        className={`group-hover:scale-105 active:scale-95 transition-fast ${className}`}
      >
        {label}
      </Button>
    );
  }

  return (
    <IconButton
      icon={<ShoppingCart className="sm:size-6 size-9" />}
      onClick={onAddToCart}
      size={size}
      sizeInMobile={mobileSize}
      variant="primary"
      aria-label={label || `Agregar ${name} al carrito`}
      className={`group-hover:scale-105 active:scale-95 transition-fast ${className}`}
    />
  );
};

export default CartButton;
