import { useState, useMemo } from "react";
import CarritoList from "@/components/CarritoList";
import LoadingScreen from "@/components/Loading";
import { ShippingSelector, type Address } from "@/components/ShippingSelector";
import { CartProvider, useCart } from "@/context/CartContext";
import { WHATSAPP_URL } from "@/data/config";
import { CartSummary } from "@/components/CartSummary";
import { CartWarnings } from "@/components/CartWarnings";
import { FormInput } from "@/components/FormFields";

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
  montoParaEnvioGratis: number;
}

const Carrito = ({
  productos,
  telefono,
  montoParaEnvioGratis,
}: CarritoProps) => {
  const { cart, hydrated, clearCart } = useCart();
  const [isLoadingMP, setIsLoadingMP] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [email, setEmail] = useState("");

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

  const tieneEnvioGratis = subtotal >= montoParaEnvioGratis;
  const costoEnvioFinal = tieneEnvioGratis ? 0 : shippingCost;

  const canCheckout =
    selectedAddress !== null &&
    (costoEnvioFinal > 0 || tieneEnvioGratis) &&
    email.trim() !== "";

  const errorMessage = useMemo(() => {
    if (!selectedAddress) return "Seleccione un método de envío.";
    if (email.trim() === "") return "Por favor, ingrese un email de contacto.";
    return undefined;
  }, [selectedAddress, email]);

  const handleMercadoPago = async () => {
    setIsLoadingMP(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: productosEnCarrito,
          shippingInfo: { cost: costoEnvioFinal, address: selectedAddress },
          prayer: { email: email.trim() },
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
    const costoEnvioFinal = tieneEnvioGratis ? 0 : shippingCost;
    const costoEnvioTexto = tieneEnvioGratis
      ? "¡Gratis!"
      : `$${shippingCost.toLocaleString()}`;

    let addressText = "";
    if (selectedAddress) {
      if (selectedAddress.deliveryType === "D") {
        addressText = `\n📍 Envío a Domicilio: ${selectedAddress.street} ${selectedAddress.number} (CP: ${selectedAddress.postalCode})`;
      } else {
        addressText = `\n📍 Retiro en Sucursal: ${selectedAddress.sucursalNombre} (CP: ${selectedAddress.postalCode})`;
      }
      addressText += `\n👤 Destinatario: ${selectedAddress.nombreApellido || "No especificado"}\n📞 Teléfono: ${selectedAddress.telefono || "No especificado"}\nCosto de envío: ${costoEnvioTexto}`;
    }

    const message = `Hola! Me gustaría hacer un pedido:\n\n${productosEnCarrito
      .map(
        (p) =>
          `- ${p.nombre} (x${p.quantity}): $${(p.precio * (p.quantity || 1)).toLocaleString()}`,
      )
      .join(
        "\n",
      )}\n${addressText}\n📧 Email de contacto: ${email}\n\n*Total a pagar: $${(subtotal + costoEnvioFinal).toLocaleString()}*`;

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

          {/* Se corrigió la alineación vertical a items-start */}
          <section className="w-full flex flex-col lg:flex-row items-start gap-6 mt-2">
            <div className="flex w-full flex-col gap-3 lg:w-2/3 px-3">
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
            <div className="flex w-full flex-col gap-3 lg:w-1/3 px-3">
              <p className="text-label-md text-on-surface-variant">
                EMAIL DE CONTACTO
              </p>
              <FormInput
                placeholder="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </section>

          <section className="w-full flex flex-col items-start mt-4">
            <section className="w-full flex flex-col lg:flex-row items-start gap-8">
              <div className="w-full lg:w-2/3">
                <CarritoList productos={productosEnCarrito} />
              </div>

              <CartSummary
                totalItems={totalItems}
                subtotal={subtotal}
                shippingCost={costoEnvioFinal}
                canCheckout={canCheckout}
                errorMessage={errorMessage}
                isLoadingMP={isLoadingMP}
                isAddressSelected={selectedAddress !== null}
                tieneEnvioGratis={tieneEnvioGratis}
                montoParaEnvioGratis={montoParaEnvioGratis}
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

export default function MainCarrito({
  productos,
  telefono,
  montoParaEnvioGratis,
}: CarritoProps) {
  return (
    <CartProvider>
      <Carrito
        productos={productos}
        telefono={telefono}
        montoParaEnvioGratis={montoParaEnvioGratis}
      />
    </CartProvider>
  );
}
