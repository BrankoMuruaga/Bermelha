import { Button } from "@/components/Button";

const PaymentSuccess = () => {
  return (
    <div className=" flex flex-col items-center justify-center gap-3">
      <p className="text-xl font-bold">¡Pago exitoso!</p>
      <p className="text-md text-gray-700">
        Gracias por tu compra. Tu pedido ha sido procesado correctamente.
      </p>
      <Button
        variant="primary"
        label="Volver al inicio"
        onClick={() => (window.location.href = "/")}
      />
    </div>
  );
};

export default PaymentSuccess;
