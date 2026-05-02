import CarritoList from "@/components/CarritoList";
import LoadingScreen from "@/components/Loading";
import { CartProvider, useCart } from "@/context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

initMercadoPago("APP_USR-b9858e60-b8f0-4837-b24b-c7d0bc63b624");

interface CarritoProps {
  productos: {
    id: string;
    nombre: string;
    precio: number;
    imagenPrincipal: string;
    centimetros: number;
    tags?: string[];
    quantity?: number;
  }[];
}

const Carrito = ({ productos }: CarritoProps) => {
  const { cart, hydrated, clearCart } = useCart();
  const [preferenceId, setPreferenceId] = useState<string>("");

  useEffect(() => {
    if (!hydrated || cart.length === 0) return;

    const createPreference = async () => {
      const productosEnCarrito = cart.map((item) => {
        const producto = productos.find((p) => p.id === item.id);
        return producto
          ? { ...producto, quantity: item.quantity }
          : {
              id: item.id,
              nombre: "Producto desconocido",
              precio: 0,
              imagenPrincipal: "",
              centimetros: 0,
              quantity: item.quantity,
            };
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: productosEnCarrito }),
      });

      if (!response.ok) {
        console.error("Error al crear preferencia:", response.statusText);
        return;
      }

      const data = await response.json();
      setPreferenceId(data.preferenceId);
    };

    createPreference();
  }, [cart, hydrated]);

  if (!hydrated) return <LoadingScreen />;

  const productosEnCarrito = cart.map((item) => {
    const producto = productos.find((p) => p.id === item.id);
    return producto
      ? { ...producto, quantity: item.quantity }
      : {
          id: item.id,
          nombre: "Producto desconocido",
          precio: 0,
          imagenPrincipal: "",
          centimetros: 0,
          quantity: item.quantity,
        };
  });

  const totalCompra = productosEnCarrito.reduce(
    (acc, p) => acc + p.precio * p.quantity,
    0,
  );

  return (
    <section className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-label-lg text-xl text-primary">Carrito de compras</h1>
      {cart.length === 0 ? (
        <p className="text-body-md text-on-surface-variant py-8 text-center">
          Tu carrito está vacío.
        </p>
      ) : (
        <>
          <p className="text-center">
            Una vez que hayas generado el pedido nos pondremos en contacto
            contigo para coordinar la entrega.
          </p>
          <CarritoList productos={productosEnCarrito} />

          <div className="bg-surface-container-lowest rounded-md px-6 py-5 shadow-ambient-sm flex flex-col gap-3 w-full">
            <p className="text-label-md text-on-surface-variant">RESUMEN</p>
            <div className="flex justify-between items-center border-t border-surface-dim pt-3">
              <p className="text-title-md text-on-surface">
                Total ({cart.reduce((acc, i) => acc + i.quantity, 0)} productos)
              </p>
              <p className="text-headline-md text-primary">
                ${totalCompra.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="w-full sm:max-w-[60%] flex flex-col items-center gap-4">
            {preferenceId && (
              <div className="w-80 h-20">
                <Wallet initialization={{ preferenceId }} />
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default function MainCarrito({ productos }: CarritoProps) {
  return (
    <CartProvider>
      <Carrito productos={productos} />
    </CartProvider>
  );
}
