import { Button } from "@/components/Button";
import CarritoList from "@/components/CarritoList";
import LoadingScreen from "@/components/Loading";
import { WarningAlert } from "@/components/WarningAlert";
import { CartProvider, useCart } from "@/context/CartContext";
import { WHATSAPP_URL } from "@/data/config";
import { useState } from "react";
import { ShippingSelector, type Address } from "@/components/ShippingSelector";

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
  const [isLoadingMP, setIsLoadingMP] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

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

  const subtotal = productosEnCarrito.reduce(
    (acc, p) => acc + p.precio * p.quantity,
    0,
  );
  const totalCompra = subtotal + shippingCost;

  const canCheckout = selectedAddress !== null && shippingCost > 0;

  const handleMercadoPago = async () => {
    setIsLoadingMP(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: productosEnCarrito,
          shippingInfo: { cost: shippingCost, address: selectedAddress },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear preferencia");
      }

      const data = await response.json();

      if (data.initPoint) {
        window.location.href = data.initPoint;
      }
    } catch (error) {
      console.error("Fallo la petición:", error);
      alert("Hubo un error al conectar con Mercado Pago. Intentá nuevamente.");
    } finally {
      setIsLoadingMP(false);
    }
  };

  const handleWhatsapp = () => {
    const addressText = selectedAddress
      ? `\n📍 Envío a: ${selectedAddress.street} ${selectedAddress.number} (${selectedAddress.postalCode}) - ${selectedAddress.deliveryType === "D" ? "Domicilio" : "Sucursal"}\nCosto de envío: $${shippingCost}`
      : "";

    const message = `Hola! Me gustaría hacer un pedido:\n\n${productosEnCarrito
      .map((p) => `- ${p.nombre} (x${p.quantity}): $${p.precio}`)
      .join("\n")}${addressText}\n\n*Total a pagar: $${totalCompra}*`;

    const url = `${WHATSAPP_URL}${telefono}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clearCart();
  };

  return (
    <section className="flex flex-col items-center gap-6 w-full relative">
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

          <section className="w-full flex flex-col lg:flex-row items-start gap-8 mt-2">
            <div className="flex sm:hidden w-full border-b border-surface-dim  flex-col gap-4">
              <p className="text-label-md text-on-surface-variant">
                DATOS DE ENVÍO
              </p>
              <ShippingSelector
                onShippingCalculated={(cost, addr) => {
                  setShippingCost(cost);
                  setSelectedAddress(addr);
                }}
              />
            </div>
            <div className="w-full lg:w-2/3">
              <CarritoList productos={productosEnCarrito} />
            </div>

            <div className=" w-full lg:w-1/3 bg-surface-container-lowest rounded-t-md lg:rounded-md px-6 py-5 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] lg:shadow-ambient-sm flex flex-col gap-3 sticky bottom-0 lg:bottom-auto lg:top-18 z-40 border-t lg:border-none border-surface-dim">
              <div className="hidden sm:flex border-b border-surface-dim  flex-col gap-4">
                <p className="text-label-md text-on-surface-variant">
                  DATOS DE ENVÍO
                </p>
                <ShippingSelector
                  onShippingCalculated={(cost, addr) => {
                    setShippingCost(cost);
                    setSelectedAddress(addr);
                  }}
                />
              </div>
              <p className="text-label-md text-on-surface-variant ">RESUMEN</p>

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex justify-between items-center">
                  <p className="text-body-md text-primary font-bold text-[12px]">
                    Productos ({cart.reduce((acc, i) => acc + i.quantity, 0)})
                  </p>
                  <p className="text-body-md text-on-surface">
                    ${subtotal.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-body-md text-primary font-bold text-[12px]">
                    Envío
                  </p>
                  <p className="text-body-md text-on-surface">
                    {shippingCost > 0
                      ? `$${shippingCost.toLocaleString()}`
                      : "A calcular"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-surface-dim pt-3 mt-1">
                <p className="text-title-md text-on-surface font-bold">TOTAL</p>
                <p className="text-headline-md text-primary">
                  ${totalCompra.toLocaleString()}
                </p>
              </div>

              {!canCheckout && (
                <p className="text-[12px] text-red-500 text-center font-semibold mb-1">
                  Seleccione un método de envío.
                </p>
              )}

              <div className="w-full flex flex-col items-center justify-center gap-1 mt-2">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Button
                    onClick={handleMercadoPago}
                    disabled={isLoadingMP || !canCheckout}
                    className="w-80 h-12 sm:h-16 flex items-center gap-2 transition-smooth justify-center disabled:opacity-70"
                    icon={
                      isLoadingMP ? (
                        <span className="animate-pulse">Conectando...</span>
                      ) : (
                        <img
                          src="./logo-MP.svg"
                          alt="Mercado Pago"
                          className="w-14"
                        />
                      )
                    }
                    variant="primary"
                    label={isLoadingMP ? "" : "Pagar con Mercado Pago"}
                  />
                  <p className="text-[12px] text-gray-500 font-semibold -mt-1">
                    Paga de forma segura
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full my-1">
                  <div className="flex-1 h-px bg-surface-dim" />
                  <p className="text-label-sm text-on-surface-variant">o</p>
                  <div className="flex-1 h-px bg-surface-dim" />
                </div>

                <Button
                  icon={
                    <img src="./whatsapp.svg" alt="WhatsApp" className="w-7" />
                  }
                  variant="primary"
                  label="Solicitar por WhatsApp"
                  onClick={handleWhatsapp}
                  className="w-80 h-12 sm:h-16 justify-center"
                />
              </div>
            </div>
          </section>
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
