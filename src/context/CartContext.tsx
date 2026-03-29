import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CartItem {
  id: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  hydrated: boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  quantity: (id: string) => number;
  decreaseOne: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const decreaseOne = (id: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const add = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      return existing
        ? prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...prev, { id, quantity: 1 }];
    });
  };

  const clearCart = () =>
    setCart(() => {
      localStorage.removeItem("cart");
      window.dispatchEvent(
        new StorageEvent("storage", { key: "cart", newValue: null }),
      );
      return [];
    });

  const remove = (id: string) =>
    setCart((prev) => prev.filter((i) => i.id !== id));
  const quantity = (id: string) => cart.find((i) => i.id === id)?.quantity ?? 0;
  const total = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        hydrated,
        add,
        remove,
        quantity,
        decreaseOne,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
