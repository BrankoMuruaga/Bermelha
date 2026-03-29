import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import Pagination from "../components/Pagination";
import { ProductCard } from "../components/ProductCard";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductCardSkeleton } from "@/components/Skeletons";

interface CatalogoProps {
  itemsPerPage?: number;
  productos: {
    id: string;
    nombre: string;
    precio: number;
    imagenPrincipal: string;
    centimetros: number;
    tags?: string[];
    coleccion?: string | null;
  }[];
}

export default function Catalogo({
  itemsPerPage = 4,
  productos,
}: CatalogoProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [query] = useQueryState("q", parseAsString.withDefault(""));
  const hydrated = useHydrated();

  const filtered = productos.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q)) ||
      p.coleccion?.toLowerCase().includes(q)
    );
  });

  // Resetear página cuando cambia la búsqueda
  const prevQuery = useRef(query);
  useEffect(() => {
    if (prevQuery.current !== query) {
      setPage(null); // null = elimina el param de la url
      prevQuery.current = query;
    }
  }, [query]);

  const paginatedProducts = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <CartProvider>
      <WishlistProvider>
        <section id="catalogo" className="w-full px-2">
          {filtered.length === 0 && (
            <p className="text-body-md text-on-surface-variant py-8 text-center">
              {`No encontramos productos para "${query}"`}
            </p>
          )}
          {hydrated && filtered.length > 0 && (
            <ul className="flex flex-wrap gap-6 pb-2 items-center justify-center">
              {paginatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </ul>
          )}
          {!hydrated && (
            <ul className="flex flex-wrap gap-6 pb-2 items-center justify-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </ul>
          )}
          <Pagination
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
          />
        </section>
      </WishlistProvider>
    </CartProvider>
  );
}
