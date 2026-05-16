import { Button } from "@/components/Button";
import { CartProvider, useCart } from "@/context/CartContext";
import { mailContact } from "@/data/config";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const { hydrated, clearCart } = useCart();

  useEffect(() => {
    if (hydrated) clearCart();
  }, [hydrated]);

  return (
    <div className="flex flex-col items-center justify-center pt-12 px-6 text-center max-w-lg mx-auto">
      {/* Ícono */}
      <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center mb-6">
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

      {/* Mensaje Principal */}
      <h1 className="text-headline-md text-primary mb-2">¡Pago exitoso!</h1>
      <p className="text-body-lg text-on-surface mb-8">
        Gracias por tu compra. <br />
        Tu pedido fue procesado correctamente.
      </p>

      {/* Sección de Correo */}
      <div className="flex flex-col gap-1 surface-high ghost-border px-4 py-5 rounded-md w-full mb-8">
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-body-md text-on-surface font-semibold m-0">
            Te enviamos el comprobante por mail
          </p>
        </div>
        <p className="text-body-sm text-on-surface-variant m-0">
          Revisá tu bandeja de entrada. Por las dudas, chequeá también la
          carpeta de promociones o correo no deseado.
        </p>
      </div>

      {/* Botón de Acción */}
      <Button
        variant="primary"
        label="Volver al inicio"
        onClick={() => (window.location.href = "/")}
      />

      {/* Soporte */}
      <p className="text-body-sm text-on-surface-variant mt-8">
        ¿Tenés alguna duda? Escribinos a{" "}
        <a
          href={`mailto:${mailContact}`}
          className="text-primary font-semibold hover:underline transition-smooth"
        >
          {mailContact}
        </a>
      </p>
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
