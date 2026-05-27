import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Customizations = Record<string, any>;

interface CartItem {
  id: string;
  quantity: number;
  customizations?: Customizations;
}

interface CartContextType {
  cart: CartItem[];
  hydrated: boolean;
  add: (id: string, customizations?: Customizations) => void;
  remove: (id: string, customizations?: Customizations) => void;
  quantity: (id: string, customizations?: Customizations) => number;
  decreaseOne: (id: string, customizations?: Customizations) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // Comparación profunda de valores
  const deepEqual = (a: any, b: any): boolean => {
    // Si son el mismo valor primitivo o la misma referencia
    if (a === b) return true;

    // Si alguno es null o no es objeto, no son iguales
    if (a == null || b == null) return false;
    if (typeof a !== "object" || typeof b !== "object") return false;

    // Si son arrays, comparar longitud y elementos
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    // Si tienen diferente número de keys, no son iguales
    if (keysA.length !== keysB.length) return false;

    // Comparar cada key recursivamente
    return keysA.every((key) => {
      return keysB.includes(key) && deepEqual(a[key], b[key]);
    });
  };

  const areCustomizationsEqual = (a?: Customizations, b?: Customizations) => {
    if (!a && !b) return true; // Ambos sin customizaciones
    if (!a || !b) return false; // Uno tiene y el otro no

    return deepEqual(a, b);
  };

  const isSameItem = (
    item: CartItem,
    id: string,
    customizations?: Customizations,
  ) => {
    return (
      item.id === id &&
      areCustomizationsEqual(item.customizations, customizations)
    );
  };

  const decreaseOne = (id: string, customizations?: Customizations) => {
    setCart((prev) => {
      const item = prev.find((i) => isSameItem(i, id, customizations));
      if (!item) return prev;

      if (item.quantity === 1) {
        return prev.filter((i) => !isSameItem(i, id, customizations));
      }

      return prev.map((i) =>
        isSameItem(i, id, customizations)
          ? { ...i, quantity: i.quantity - 1 }
          : i,
      );
    });
  };

  const add = (id: string, customizations?: Customizations) => {
    setCart((prev) => {
      const existing = prev.find((i) => isSameItem(i, id, customizations));

      return existing
        ? prev.map((i) =>
            isSameItem(i, id, customizations)
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [...prev, { id, quantity: 1, customizations }];
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

  const remove = (id: string, customizations?: Customizations) =>
    setCart((prev) => prev.filter((i) => !isSameItem(i, id, customizations)));

  const quantity = (id: string, customizations?: Customizations) =>
    cart.find((i) => isSameItem(i, id, customizations))?.quantity ?? 0;

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
