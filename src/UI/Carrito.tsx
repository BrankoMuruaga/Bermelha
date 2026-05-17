import { Button } from "@/components/Button";
import CarritoList from "@/components/CarritoList";
import LoadingScreen from "@/components/Loading";
import { WalletSkeleton } from "@/components/Skeletons";
import { WarningAlert } from "@/components/WarningAlert";
import { CartProvider, useCart } from "@/context/CartContext";
import { WHATSAPP_URL } from "@/data/config";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { set } from "astro:schema";
import { useEffect, useState } from "react";

initMercadoPago(import.meta.env.PUBLIC_MP_PUBLIC_KEY);

interface CarritoProps {
  telefono: number;
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

const Carrito = ({ productos, telefono }: CarritoProps) => {
  const { cart, hydrated, clearCart } = useCart();
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [preferenceError, setPreferenceError] = useState(false);

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
        setPreferenceError(true);
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

  const handleWhatsapp = () => {
    const message = `Hola! Me gustaría hacer un pedido con los siguientes productos:\n\n${productosEnCarrito
      .map(
        (p) =>
          `- ${p.nombre} (Cantidad: ${p.quantity}, Precio unitario: $${p.precio})`,
      )
      .join("\n")}\n\nTotal: $${totalCompra}`;
    const url = `${WHATSAPP_URL}${telefono}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clearCart();
  };

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
            Una vez que confirmes tu compra, nos pondremos en contacto para
            coordinar la entrega.
          </p>
          <WarningAlert>
            Considerá que{" "}
            <strong>tu pedido requerirá unos días de elaboración</strong> antes
            de ser despachado.
          </WarningAlert>
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
          <div className="w-full sm:max-w-[60%] flex flex-col items-center gap-3">
            {!preferenceId && !preferenceError ? (
              <WalletSkeleton />
            ) : !preferenceError ? (
              <>
                <div className="w-full">
                  <Wallet
                    initialization={{ preferenceId }}
                    customization={{
                      customStyle: {
                        buttonHeight: "48px",
                        borderRadius: "10px",
                        verticalPadding: "10px",
                        horizontalPadding: "10px",
                      },
                    }}
                  />
                </div>

                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px bg-surface-dim" />
                  <p className="text-label-sm text-on-surface-variant">o</p>
                  <div className="flex-1 h-px bg-surface-dim" />
                </div>
              </>
            ) : null}

            <Button
              icon={<img src="./whatsapp.svg" alt="WhatsApp" className="w-5" />}
              variant="primary"
              label="Generar pedido por WhatsApp"
              onClick={handleWhatsapp}
              className="w-full justify-center"
            />
          </div>
        </>
      )}
    </section>
  );
};

export default function MainCarrito({ productos, telefono }: CarritoProps) {
  return (
    <CartProvider>
      <Carrito productos={productos} telefono={telefono} />
    </CartProvider>
  );
}
