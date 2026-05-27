import { WarningAlert } from "@/components/WarningAlert";

export const CartWarnings = () => {
  return (
    <>
      <WarningAlert>
        Considerá que{" "}
        <strong>tu pedido requerirá unos días de elaboración</strong> antes de
        ser despachado.
      </WarningAlert>
    </>
  );
};
