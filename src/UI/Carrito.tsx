import { Button } from "@/components/Button";
import CarritoList from "@/components/CarritoList";
import LoadingScreen from "@/components/Loading";
import { CartProvider, useCart } from "@/context/CartContext";
import { WHATSAPP_URL } from "@/data/config";

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

  const handleSubmit = () => {
    const message = `Hola! Me gustaría hacer un pedido con los siguientes productos:\n\n${productosEnCarrito
      .map(
        (p) =>
          `- ${p.nombre} (Cantidad: ${p.quantity}, Precio unitario: $${p.precio})`,
      )
      .join("\n")}\n\nTotal: $${totalCompra}`;
    const url = `${WHATSAPP_URL}${telefono}?text=${encodeURIComponent(
      message,
    )}`;
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
            Una vez que hayas generado el pedido nos pondremos en contacto
            contigo para coordinar la entrega.
          </p>
          <CarritoList productos={productosEnCarrito} />

          {/* Resumen de compra */}
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
          <div className="w-full sm:max-w-[60%]">
            <Button
              icon={<img src="./whatsapp.svg" alt="Sparkle" className="w-5" />}
              variant="primary"
              label="Generar pedido"
              onClick={handleSubmit}
              className="w-full justify-center mt-2"
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
