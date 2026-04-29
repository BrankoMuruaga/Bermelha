import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";
import CartButton from "./CartButton";
import { IconButton } from "./IconButton";

interface ProductCardProps {
  id: string;
  nombre: string;
  precio: number;
  imagenPrincipal: string;
  centimetros: number;
  tags?: string[];
}

export function ProductCard({
  id,
  imagenPrincipal,
  nombre,
  centimetros,
  precio,
}: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlist();
  const { add, decreaseOne, quantity } = useCart();
  const wished = isWishlisted(id);

  return (
    <li className="w-[90%] sm:w-56 shrink-0">
      <article
        className="
          p-3 surface-card rounded-md shadow-ambient-sm
          transition-smooth group
          hover:scale-105 hover:shadow-ambient-lg hover:z-10
          origin-top relative
        "
      >
        <div className="relative overflow-hidden rounded-sm">
          <img
            src={imagenPrincipal}
            alt={nombre}
            className="w-full object-cover aspect-2/3"
          />
          <IconButton
            onClick={() => toggle(id)}
            size="xs"
            icon={<Heart strokeWidth={2} />}
            variant={wished ? "primary" : "ghost"}
            aria-label={
              wished
                ? `Quitar ${nombre} de favoritos`
                : `Agregar ${nombre} a favoritos`
            }
            aria-pressed={wished}
            className="absolute top-2 right-2"
          />
        </div>

        <div className="flex flex-col mt-3 gap-1">
          <p className="text-title-md text-on-surface">{nombre}</p>
          <p className="text-body-md text-on-surface-variant">
            Altura: {centimetros} cm aprox.
          </p>

          <div className="w-full flex items-center justify-between mt-1">
            <p className="text-title-md text-primary">
              ${precio.toLocaleString("es-ES")} c/u.
            </p>
            <CartButton
              quantity={quantity(id)}
              onAddToCart={() => add(id)}
              decreaseOne={() => {
                decreaseOne(id);
              }}
              name={nombre}
            />
          </div>
        </div>
      </article>
    </li>
  );
}
