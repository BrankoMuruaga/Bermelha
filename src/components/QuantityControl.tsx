import { Minus, Plus } from "lucide-react";
import { IconButton } from "@/components/IconButton";

interface QuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  size?: "sm" | "md" | "lg";
  variant?: Variants;
  className?: string;
}
type Variants = "primary" | "ghost";

export function QuantityControls({
  quantity,
  onIncrease,
  onDecrease,
  min = 0,
  size = "md",
  variant = "primary",
  className = "",
}: QuantityControlsProps) {
  const variants: Record<Variants, string> = {
    primary: "bg-primary text-primary-on hover:bg-primary-dim",
    ghost:
      "bg-surface-dim text-on-surface-variant hover:bg-surface-container-high",
  };
  const sizeClasses = {
    sm: "size-8 sm:size-6",
    md: "size-10 sm:size-8",
    lg: "size-12 sm:size-10",
  };

  const iconClasses = {
    sm: "size-4 sm:size-3",
    md: "size-6 sm:size-4",
    lg: "size-7 sm:size-5",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IconButton
        icon={<Minus size={24} className={iconClasses[size]} />}
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Quitar una unidad"
        className={`active:scale-85 hover:scale-115 ${sizeClasses[size]}`}
      />
      <span className="text-title-md w-6 text-center">{quantity}</span>
      <IconButton
        icon={<Plus size={24} className={iconClasses[size]} />}
        onClick={onIncrease}
        aria-label="Agregar una unidad"
        className={`active:scale-85 hover:scale-115 ${sizeClasses[size]}`}
        variant={variant}
      />
    </div>
  );
}
