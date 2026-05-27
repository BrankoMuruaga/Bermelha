import { useState } from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import { useWishlist, WishlistProvider } from "@/context/WishlistContext";
import { Heart, Palette, ArrowLeft, X } from "lucide-react";
import { IconButton } from "../components/IconButton";
import { CustomSelect } from "../components/FormFields";
import { Button } from "../components/Button";
import { QuantityControls } from "../components/QuantityControl";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductDetailSkeleton } from "@/components/Skeletons";

interface Color {
  nombre: string;
  codigo: number;
  codigoHex: string;
  imagen?: string;
}

type Customizations = Record<string, any>;

interface ProductDetailProps {
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagenPrincipal: string;
    centimetros: number;
    tags?: string[];
    coleccion?: string | null;
    slug: string;
    customizations?: Customizations;
  };
}

function ProductDetail({ producto }: ProductDetailProps) {
  const {
    id,
    nombre,
    precio,
    imagenPrincipal,
    centimetros,
    coleccion,
    customizations,
  } = producto;

  const { toggle, isWishlisted } = useWishlist();
  const { add } = useCart();
  const hydrated = useHydrated();

  const wished = isWishlisted(id);
  const hasColorVariants = !!(
    customizations?.color && customizations.color.length > 0
  );

  const [selectedOptions, setSelectedOptions] = useState<any>(() => {
    if (!hasColorVariants) return {};
    return {
      color: {
        value: customizations.color[0].codigo,
        label: customizations.color[0].nombre,
      },
    };
  });

  const [localQuantity, setLocalQuantity] = useState(1);

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const currentColorObj = hasColorVariants
    ? customizations.color.find(
        (c: Color) => c.codigo === selectedOptions.color?.value,
      )
    : null;

  const displayImage = currentColorObj?.imagen || imagenPrincipal;
  const cartOptions =
    Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined;

  const getCleanHex = (hex: string) => {
    if (!hex) return "transparent";
    return hex.startsWith("#") ? hex : `#${hex}`;
  };

  const handleAddToCart = () => {
    if (localQuantity > 0) {
      for (let i = 0; i < localQuantity; i++) {
        add(id, cartOptions);
      }
      setLocalQuantity(0);
    }
  };

  if (!hydrated) {
    return <ProductDetailSkeleton />;
  }

  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12 w-full max-w-6xl mx-auto px-4">
      {/* COLUMNA DE IMAGEN PRINCIPAL */}
      <div className="relative overflow-hidden rounded-sm">
        <img
          src={displayImage}
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

      {/* COLUMNA DE DETALLES Y CONTROLES */}
      <div className="w-full flex flex-col items-start gap-6 py-1">
        <div className="w-full flex flex-col gap-4">
          <a
            href="/catalogo"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dim transition-fast group pt-2"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-label-lg font-bold">Volver al catálogo</span>
          </a>
          <div className="flex flex-col gap-1.5">
            {coleccion && (
              <span className="text-label-md font-bold tracking-wider text-secondary uppercase">
                {coleccion}
              </span>
            )}
            <h1 className="text-headline-md sm:text-headline-lg text-on-surface font-serif font-normal!">
              {nombre}
            </h1>
          </div>

          <div className="flex flex-col items-baseline gap-2">
            <span className="sm:text-body-sm text-body-md text-primary font-semibold sm:font-bold">
              Precio por unidad.
            </span>
            <p className="text-4xl text-primary font-medium">
              ${precio.toLocaleString("es-ES")}
            </p>
          </div>

          <div className="flex flex-col gap-4 py-5 my-2 border-y border-outline-variant">
            <div className="flex items-center gap-3">
              <span className="text-label-lg font-bold text-on-surface">
                Altura:
              </span>
              <span className="text-body-lg text-on-surface-variant">
                {centimetros} cm aprox.
              </span>
            </div>

            {/* SECCIÓN INTERACTIVA DE VARIANTES DE COLOR */}
            {hasColorVariants && (
              <div className="flex items-center gap-3 min-h-14">
                <span className="text-label-lg font-bold text-on-surface whitespace-nowrap">
                  Color:
                </span>

                {isColorPickerOpen ? (
                  <>
                    <div className="animate-fadeIn flex-1 max-w-md">
                      <CustomSelect
                        options={customizations.color.map((c: Color) => ({
                          value: c.codigo,
                          label: c.nombre,
                          rightElement: (
                            <span
                              className="w-5 h-5 rounded-full border border-gray-300 block"
                              style={{
                                backgroundColor: getCleanHex(c.codigoHex),
                              }}
                            />
                          ),
                        }))}
                        onSelect={(value) => {
                          setSelectedOptions({
                            ...selectedOptions,
                            color: {
                              value: value,
                              label: customizations.color.find(
                                (c: Color) => c.codigo === Number(value),
                              )?.nombre,
                            },
                          });
                          setIsColorPickerOpen(false);
                        }}
                        placeholder="Selecciona un color"
                        selectedValue={selectedOptions.color?.value}
                      />
                    </div>
                    <IconButton
                      variant="ghost"
                      onClick={() => setIsColorPickerOpen(false)}
                      className="p-2 rounded-full transition-fast text-primary hover:bg-secondary-dim"
                      aria-label="Cerrar selector de color"
                      icon={<X size={20} aria-hidden="true" />}
                    />
                  </>
                ) : (
                  <div className="flex items-center gap-3 animate-fadeIn">
                    <span className="text-body-lg text-on-surface-variant font-medium">
                      {selectedOptions.color?.label}
                    </span>

                    <span
                      className="w-5 h-5 rounded-full border border-gray-300 block"
                      style={{
                        backgroundColor: getCleanHex(currentColorObj.codigoHex),
                      }}
                    />

                    <IconButton
                      onClick={() => setIsColorPickerOpen(true)}
                      className="p-2 rounded-full hover:bg-secondary-dim transition-fast text-primary cursor-pointer"
                      aria-label="Cambiar color"
                      icon={<Palette size={20} aria-hidden="true" />}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <QuantityControls
            quantity={localQuantity}
            onDecrease={() => setLocalQuantity(Math.max(1, localQuantity - 1))}
            onIncrease={() => setLocalQuantity(localQuantity + 1)}
            size="lg"
          />
          <Button
            onClick={handleAddToCart}
            disabled={localQuantity === 0}
            size="lg"
            variant="primary"
            aria-label="Agregar al carrito"
            className="group-hover:scale-105 active:scale-90 transition-fast"
          >
            Agregar al carrito
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function MainProductDetail({ producto }: ProductDetailProps) {
  return (
    <CartProvider>
      <WishlistProvider>
        <ProductDetail producto={producto} />
      </WishlistProvider>
    </CartProvider>
  );
}
