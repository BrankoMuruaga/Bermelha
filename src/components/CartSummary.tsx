import { Button } from "@/components/Button";
import { type Address } from "@/components/ShippingSelector";

interface CartSummaryProps {
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  canCheckout: boolean;
  isLoadingMP: boolean;
  onMercadoPago: () => void;
  onWhatsapp: () => void;
}

export const CartSummary = ({
  totalItems,
  subtotal,
  shippingCost,
  canCheckout,
  isLoadingMP,
  onMercadoPago,
  onWhatsapp,
}: CartSummaryProps) => {
  const totalCompra = subtotal + shippingCost;

  return (
    <section className="w-full lg:w-1/3 bg-surface-container-lowest rounded-t-md lg:rounded-md px-6 py-5 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] lg:shadow-ambient-sm flex flex-col gap-3 sticky bottom-0 lg:bottom-auto lg:top-18 border-t lg:border-none border-surface-dim">
      <p className="text-label-md text-on-surface-variant">RESUMEN</p>

      <div className="flex flex-col gap-2 pt-1">
        <div className="flex justify-between items-center">
          <p className="text-body-md text-primary font-bold text-[12px]">
            Productos ({totalItems})
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
            onClick={onMercadoPago}
            disabled={isLoadingMP || !canCheckout}
            className="w-80 h-12 sm:h-16 flex items-center gap-2 transition-smooth justify-center disabled:opacity-70"
            variant="primary"
            label={isLoadingMP ? "Conectando..." : "Pagar con Mercado Pago"}
            icon={
              isLoadingMP ? (
                <span className="animate-pulse">Conectando...</span>
              ) : (
                <img src="./logo-MP.svg" alt="Mercado Pago" className="w-14" />
              )
            }
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
          variant="primary"
          label="Solicitar por WhatsApp"
          onClick={onWhatsapp}
          className="w-80 h-12 sm:h-16 justify-center"
        />
      </div>
    </section>
  );
};
