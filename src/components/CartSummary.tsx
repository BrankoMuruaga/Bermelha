import { Button } from "@/components/Button";
import { useMemo } from "react";

interface CartSummaryProps {
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  canCheckout: boolean;
  errorMessage?: string;
  isLoadingMP: boolean;
  montoParaEnvioGratis: number;
  isAddressSelected: boolean;
  tieneEnvioGratis: boolean;
  onMercadoPago: () => void;
  onWhatsapp: () => void;
}

export const CartSummary = ({
  totalItems,
  subtotal,
  shippingCost,
  canCheckout,
  errorMessage,
  isLoadingMP,
  isAddressSelected,
  tieneEnvioGratis,
  montoParaEnvioGratis,
  onMercadoPago,
  onWhatsapp,
}: CartSummaryProps) => {
  const totalCompra = useMemo(
    () => subtotal + shippingCost,
    [subtotal, shippingCost],
  );

  const shippingLabel = useMemo(() => {
    if (!isAddressSelected) return "A calcular";
    if (tieneEnvioGratis || shippingCost === 0) return "¡Gratis!";
    return `$${shippingCost.toLocaleString()}`;
  }, [isAddressSelected, tieneEnvioGratis, shippingCost]);

  return (
    <section className="w-full lg:w-1/3 bg-surface-container-lowest rounded-t-md lg:rounded-md px-6 py-5 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] lg:shadow-ambient-sm flex flex-col gap-3 sticky bottom-0 lg:bottom-auto lg:top-18 border-t lg:border-none border-surface-dim">
      <p className="text-label-md text-on-surface-variant">RESUMEN</p>

      <div className="flex flex-col gap-2 pt-1">
        {/* Productos */}
        <div className="flex justify-between items-center">
          <p className="text-body-md text-primary font-bold text-[12px]">
            Productos ({totalItems})
          </p>
          <p className="text-body-md text-on-surface">
            ${subtotal.toLocaleString()}
          </p>
        </div>

        {/* Envío */}
        <div className="flex justify-between items-center">
          <p className="text-body-md text-primary font-bold text-[12px]">
            Envío
          </p>
          <p className="text-body-md text-on-surface">{shippingLabel}</p>
        </div>

        {/* Alerta de Envío Gratis */}
        {subtotal < montoParaEnvioGratis && !tieneEnvioGratis && (
          <p className="text-[11px] text-primary/80 italic m-0 mt-1">
            Agregá ${(montoParaEnvioGratis - subtotal).toLocaleString()} más
            para obtener ¡Envío Gratis!
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t border-surface-dim pt-3 mt-1">
        <p className="text-title-md text-on-surface font-bold">TOTAL</p>
        <p className="text-headline-md text-primary">
          ${totalCompra.toLocaleString()}
        </p>
      </div>

      {/* Mensaje de Error */}
      {!canCheckout && errorMessage && (
        <p className="text-[12px] text-red-500 text-center font-semibold my-1 animate-fadeIn">
          {errorMessage}
        </p>
      )}

      {/* Acciones de Pago */}
      <div className="w-full flex flex-col items-center justify-center gap-1 mt-2">
        <div className="flex flex-col items-center justify-center gap-1 w-full">
          <Button
            onClick={onMercadoPago}
            disabled={isLoadingMP || !canCheckout}
            className="w-full h-12 sm:h-16 flex items-center gap-2 transition-smooth justify-center disabled:opacity-50"
            variant="primary"
            label={isLoadingMP ? "Conectando..." : "Pagar con Mercado Pago"}
            icon={
              !isLoadingMP && (
                <img src="./logo-MP.svg" alt="Mercado Pago" className="w-14" />
              )
            }
          />
          <p className="text-[11px] text-on-surface-variant font-medium">
            Pagá de forma segura
          </p>
        </div>

        {/* Divisor "o" */}
        <div className="flex items-center gap-3 w-full my-1">
          <div className="flex-1 h-px bg-surface-dim" />
          <p className="text-label-sm text-on-surface-variant">o</p>
          <div className="flex-1 h-px bg-surface-dim" />
        </div>

        {/* Botón WhatsApp */}
        <Button
          variant="primary"
          label="Solicitar por WhatsApp"
          icon={<img src="./whatsapp.svg" alt="WhatsApp" className="w-5" />}
          onClick={onWhatsapp}
          className="w-full h-12 sm:h-16 justify-center disabled:opacity-50"
        />
      </div>
    </section>
  );
};
