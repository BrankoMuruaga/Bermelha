import { SearchInput } from "@/components/SearchInput";
import { useWishlist, WishlistProvider } from "@/context/WishlistContext";
import { ITEMS_PER_PAGE } from "@/data/config";
import { NuqsAdapter } from "nuqs/adapters/react";
import Catalogo from "./Catalogo";
import LoadingScreen from "@/components/Loading";

interface FavoritosProps {
  productos: {
    id: string;
    nombre: string;
    precio: number;
    imagenPrincipal: string;
    centimetros: number;
    tags?: string[];
  }[];
}

function Favoritos({ productos }: FavoritosProps) {
  const { wishlist, hydrated } = useWishlist();

  const productosFavoritos = productos.filter((p) => wishlist.includes(p.id));

  if (!hydrated) return <LoadingScreen />;

  return (
    <>
      <h3 className="text-label-lg text-primary text-xl">Favoritos</h3>

      {wishlist.length === 0 ? (
        <p className="text-body-md text-on-surface-variant py-8 text-center">
          No tienes favoritos aún. ¡Explora el catálogo y agrega tus amigurumis
          favoritos!
        </p>
      ) : (
        <>
          <SearchInput placeholder="Buscar en favoritos..." className="mb-6" />
          <Catalogo
            itemsPerPage={ITEMS_PER_PAGE}
            productos={productosFavoritos}
          />
        </>
      )}
    </>
  );
}

export default function MainFavoritos({ productos }: FavoritosProps) {
  return (
    <WishlistProvider>
      <NuqsAdapter>
        <Favoritos productos={productos} />
      </NuqsAdapter>
    </WishlistProvider>
  );
}
