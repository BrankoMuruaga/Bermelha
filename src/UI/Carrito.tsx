import { useState, useMemo } from "react";
import CarritoList from "@/components/CarritoList";
import LoadingScreen from "@/components/Loading";
import { ShippingSelector, type Address } from "@/components/ShippingSelector";
import { CartProvider, useCart } from "@/context/CartContext";
import { WHATSAPP_URL } from "@/data/config";
import { CartSummary } from "@/components/CartSummary";
import { CartWarnings } from "@/components/CartWarnings";

interface Product {
  id: string;
  nombre: string;
  precio: number;
  imagenPrincipal: string;
  centimetros: number;
  tags?: string[];
  quantity?: number;
}

interface CarritoProps {
  telefono: number;
  productos: Product[];
}

const Carrito = ({ productos, telefono }: CarritoProps) => {
  const { cart, hydrated, clearCart } = useCart();
  const [isLoadingMP, setIsLoadingMP] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const productosEnCarrito = useMemo(() => {
    return cart.map((item) => {
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
  }, [cart, productos]);

  const subtotal = useMemo(() => {
    return productosEnCarrito.reduce(
      (acc, p) => acc + p.precio * (p.quantity || 0),
      0,
    );
  }, [productosEnCarrito]);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, i) => acc + i.quantity, 0);
  }, [cart]);

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

      if (!response.ok) throw new Error("Error al crear preferencia");

      const data = await response.json();
      if (data.initPoint) window.location.href = data.initPoint;
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
      .join(
        "\n",
      )}${addressText}\n\n*Total a pagar: $${subtotal + shippingCost}*`;

    const url = `${WHATSAPP_URL}${telefono}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clearCart();
  };

  if (!hydrated) return <LoadingScreen />;

  return (
    <section className="flex flex-col items-center gap-6 w-full relative">
      <h1 className="text-label-lg text-xl text-primary">Carrito de compras</h1>

      {cart.length === 0 ? (
        <p className="text-body-md text-on-surface-variant py-8 text-center">
          Tu carrito está vacío.
        </p>
      ) : (
        <>
          <CartWarnings />

          <div className="flex w-full flex-col gap-4">
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
          <section className="w-full flex flex-col items-start">
            <section className="w-full flex flex-col lg:flex-row items-start gap-8">
              <div className="w-full lg:w-2/3">
                <CarritoList productos={productosEnCarrito} />
              </div>

              <CartSummary
                totalItems={totalItems}
                subtotal={subtotal}
                shippingCost={shippingCost}
                canCheckout={canCheckout}
                isLoadingMP={isLoadingMP}
                onMercadoPago={handleMercadoPago}
                onWhatsapp={handleWhatsapp}
              />
            </section>
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
