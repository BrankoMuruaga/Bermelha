import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface WishlistContextType {
  wishlist: string[];
  hydrated: boolean;
  toggle: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useLocalStorage<string[]>("wishlist", []);
  const [hydrated, setHydrated] = useState(false); // 👈 nuevo

  useEffect(() => setHydrated(true), []); // 👈 nuevo

  const toggle = (id: string) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const isWishlisted = (id: string) => hydrated && wishlist.includes(id); // 👈 modificado

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggle, isWishlisted, hydrated }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist debe usarse dentro de WishlistProvider");
  return ctx;
}
