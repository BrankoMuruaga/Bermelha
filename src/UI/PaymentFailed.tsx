import { Button } from "@/components/Button";

const PaymentFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 px-6 text-center max-w-md mx-auto">
      {/* Ícono */}
      <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-headline-md text-primary">¡Pago fallido!</h1>
        <p className="text-body-lg text-on-surface">
          Lo sentimos, no pudimos completar tu pago.
        </p>
        <p className="text-body-md text-on-surface-variant">
          Podés intentarlo nuevamente o contactarnos si el problema persiste.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button
          variant="primary"
          label="Intentar nuevamente"
          onClick={() => (window.location.href = "/carrito")}
          className="w-full justify-center"
        />
        <Button
          variant="secondary"
          label="Volver al inicio"
          onClick={() => (window.location.href = "/")}
          className="w-full justify-center"
        />
      </div>
    </div>
  );
};

export default PaymentFailed;
