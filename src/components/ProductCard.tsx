import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Palette } from "lucide-react";
import CartButton from "./CartButton";
import { IconButton } from "./IconButton";

type Customizations = Record<string, any>;

interface ProductCardProps {
  id: string;
  slug: string;
  nombre: string;
  precio: number;
  imagenPrincipal: string;
  centimetros: number;
  tags?: string[];
  customizations?: Customizations;
}

export function ProductCard({
  id,
  slug,
  imagenPrincipal,
  nombre,
  centimetros,
  precio,
  customizations,
}: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlist();
  const { add, decreaseOne, quantity } = useCart();

  const wished = isWishlisted(id);
  const hasColorVariants = !!(
    customizations?.color && customizations.color.length > 0
  );
  const currentQuantity = quantity(id);

  return (
    <li className="w-[90%] sm:w-60 shrink-0">
      <article
        className="
          p-3 surface-container-lowest sm:hover:bg-secondary-dim rounded-md shadow-ambient-sm
          transition-smooth group
          hover:scale-102 hover:shadow-ambient-lg hover:z-10
          origin-top relative
        "
      >
        <a
          href={`/producto/${slug}`}
          className="absolute inset-0"
          aria-label={`Ver detalles de ${nombre}`}
        />

        <div className="relative flex flex-col pointer-events-none">
          {/* Imagen y Favoritos */}
          <div className="relative overflow-hidden rounded-sm">
            <img
              src={imagenPrincipal}
              alt={nombre}
              className="w-full object-cover aspect-2/3 pointer-events-none"
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
              className="absolute top-2 right-2 pointer-events-auto"
            />
          </div>

          {/* Información del producto */}
          <div className="flex flex-col mt-3">
            <div className="flex items-center justify-between gap-2 h-13 p-1">
              <div className="flex flex-col">
                <p className="text-title-lg sm:text-title-md text-on-surface">
                  <span>{nombre}</span>
                </p>
                <p className="text-body-md text-on-surface-variant">
                  Altura: {centimetros} cm aprox.
                </p>
              </div>
            </div>

            <div className="w-full flex items-end justify-between pl-1 mt-2 sm:mt-0">
              <div>
                <span className="sm:text-body-sm text-body-md text-primary font-semibold sm:font-bold">
                  <span className="sm:hidden">Precio</span> por unidad.
                </span>
                <p className="w-3/4 text-display-md sm:text-display-lg sm:text-[1.7rem] text-[2.25rem] text-primary font-normal flex items-center gap-1">
                  ${precio.toLocaleString("es-AR")}
                </p>
              </div>

              <div className="w-1/4 flex items-center gap-1 min-w-0 justify-end flex-1 pointer-events-auto">
                {hasColorVariants ? (
                  <IconButton
                    icon={<Palette className="sm:size-6 size-9" />}
                    onClick={() => {
                      window.location.href = `/producto/${slug}`;
                    }}
                    variant="primary"
                    size="md"
                    sizeInMobile="md"
                    className="group-hover:scale-105 active:scale-90 transition-fast"
                  />
                ) : (
                  <CartButton
                    quantity={currentQuantity}
                    onAddToCart={() => add(id)}
                    decreaseOne={() => decreaseOne(id)}
                    name={nombre}
                    size="md"
                    sizeInMobile="md"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
