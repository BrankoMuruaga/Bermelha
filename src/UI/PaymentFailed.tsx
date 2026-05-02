import { Button } from "@/components/Button";

const PaymentFailed = () => {
  return (
    <div className=" flex flex-col items-center justify-center gap-3">
      <p className="text-xl font-bold">¡Pago fallido!</p>
      <p className="text-md text-gray-700">
        Lo sentimos, pero tu pago no se pudo completar.
      </p>
      <Button
        variant="primary"
        label="Volver al inicio"
        onClick={() => (window.location.href = "/")}
      />
    </div>
  );
};

export default PaymentFailed;
