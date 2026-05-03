import { Button } from "@/components/Button";
import { CartProvider, useCart } from "@/context/CartContext";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const { hydrated, clearCart } = useCart();

  useEffect(() => {
    if (hydrated) clearCart();
  }, [hydrated]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 pt-12 px-6 text-center max-w-md mx-auto">
      {/* Ícono */}
      <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-tertiary"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-2">
        <h1 className="text-headline-md text-primary">¡Pago exitoso!</h1>
        <p className="text-body-lg text-on-surface">
          Gracias por tu compra. Tu pedido fue procesado correctamente.
        </p>
        <p className="text-body-md text-on-surface-variant">
          Nos vamos a comunicar con vos para coordinar la entrega. Si tenés
          alguna consulta, no dudes en contactarnos.
        </p>
      </div>

      <Button
        variant="primary"
        label="Volver al inicio"
        onClick={() => (window.location.href = "/")}
      />
    </div>
  );
};

export default function MainPaymentSuccess() {
  return (
    <CartProvider>
      <PaymentSuccess />
    </CartProvider>
  );
}
