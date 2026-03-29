// components/Personalizado.tsx
import { Button } from "@/components/Button";
import { QuantityControls } from "@/components/QuantityControl";
import { WHATSAPP_URL } from "@/data/config";
import { useState } from "react";

interface FormState {
  nombre: string;
  descripcion: string;
  cantidad: number;
}

export default function Personalizado({ telefono }: { telefono: number }) {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    descripcion: "",
    cantidad: 1,
  });

  const handleSubmit = () => {
    const message = `Hola! Me gustaría hacer un pedido personalizado.\n\nNombre: ${form.nombre}\nDescripción: ${form.descripcion}\nCantidad: ${form.cantidad}`;
    const url = `${WHATSAPP_URL}${telefono}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-12 items-center">
      {/* Texto */}
      <div className="flex flex-col gap-4 md:w-1/2 text-center">
        <h1 className="text-label-lg text-xl text-primary">
          Pedido personalizado
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Desde personajes específicos hasta réplicas de tus mascotas, creamos
          el amigurumi de tus sueños con la mejor calidad y todo nuestro cariño.
        </p>
      </div>

      {/* Formulario */}
      <div className="md:w-1/2 w-full bg-surface-container-lowest rounded-md p-8 shadow-ambient-md flex flex-col gap-7">
        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label className="text-label-lg text-on-surface" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            className="bg-surface-container-low rounded-full px-5 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant placeholder:opacity-55 ghost-border focus:ring-2 focus:ring-primary/30 outline-none transition-smooth"
          />
          <p className="text-body-sm text-on-surface-variant ml-1">
            Decinos como te llamamos para ponernos en contacto con vos.
          </p>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <label
            className="text-label-lg text-on-surface"
            htmlFor="descripcion"
          >
            Describí tu idea
          </label>
          <textarea
            id="descripcion"
            rows={4}
            placeholder="Contanos los colores, tamaño, detalles especiales..."
            value={form.descripcion}
            onChange={(e) =>
              setForm((f) => ({ ...f, descripcion: e.target.value }))
            }
            className="bg-surface-container-low rounded-md px-5 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant ghost-border focus:ring-2 focus:ring-primary/30 outline-none transition-smooth resize-none placeholder:opacity-55"
          />
        </div>

        {/* Cantidad */}
        <div className="flex items-center justify-between">
          <label className="text-label-lg text-on-surface">Cantidad</label>
          <QuantityControls
            quantity={form.cantidad}
            onIncrease={() =>
              setForm((f) => ({ ...f, cantidad: f.cantidad + 1 }))
            }
            onDecrease={() =>
              setForm((f) => ({ ...f, cantidad: Math.max(1, f.cantidad - 1) }))
            }
          />
        </div>

        <Button
          icon={<img src="./whatsapp.svg" alt="Sparkle" className="w-5" />}
          variant="primary"
          label="Generar pedido"
          onClick={handleSubmit}
          className="w-full justify-center mt-2"
          disabled={!form.nombre || !form.descripcion}
        />
      </div>
    </div>
  );
}
