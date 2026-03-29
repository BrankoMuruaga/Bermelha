import { CartProvider, useCart } from "@/context/CartContext";
import { navbar } from "@/data/config";
import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { total, hydrated } = useCart();
  const notificationCart = hydrated && total > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest ghost-border border-b shadow-ambient-sm rounded-b-md">
      <div className="mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/">
          <img src="./Bermelha-logo.svg" alt="Bermelha" className="w-28" />
        </a>

        {/* Links — desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navbar.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-label-lg text-on-surface-variant hover:text-primary transition-smooth"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Iconos + hamburguesa */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="/favoritos"
              aria-label="Favoritos"
              className="text-on-surface-variant hover:text-primary transition-smooth"
            >
              <Heart size={20} />
            </a>
            <a
              href="/carrito"
              aria-label="Carrito"
              className="text-on-surface-variant hover:text-primary transition-smooth relative"
            >
              <ShoppingCart size={20} />
              {notificationCart && (
                <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full" />
              )}
            </a>
          </div>
          <button
            className="md:hidden text-on-surface-variant hover:text-primary transition-smooth"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {open && (
        <ul className="md:hidden flex flex-col surface-card border-t ghost-border px-6 py-4 gap-4">
          {navbar.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-label-lg text-on-surface-variant hover:text-primary transition-smooth block"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default function MainNavbar() {
  return (
    <CartProvider>
      <Navbar />
    </CartProvider>
  );
}
