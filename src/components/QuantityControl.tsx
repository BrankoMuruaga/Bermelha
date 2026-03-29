import { Minus, Plus } from "lucide-react";
import { IconButton } from "./IconButton";

interface QuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
}

export function QuantityControls({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
}: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <IconButton
        icon={<Minus size={14} />}
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Quitar una unidad"
        className="active:scale-85 hover:scale-115"
      />
      <span className="text-title-md w-6 text-center">{quantity}</span>
      <IconButton
        icon={<Plus size={14} />}
        onClick={onIncrease}
        aria-label="Agregar una unidad"
        className="active:scale-85 hover:scale-115"
      />
    </div>
  );
}
