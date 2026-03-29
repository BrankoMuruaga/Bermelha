import { IconButton } from "@/components/IconButton";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface PreguntasFrecuentesProps {
  preguntasFrecuentes: {
    pregunta: string;
    respuesta: string;
  }[];
}

const PreguntaItem = ({
  pregunta,
  respuesta,
}: {
  pregunta: string;
  respuesta: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <li className="bg-surface-container-lowest rounded-md px-6 py-5 shadow-ambient-sm">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-title-md text-on-surface">{pregunta}</h3>
          <IconButton
            icon={open ? <Minus size={16} /> : <Plus size={16} />}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar respuesta" : "Ver respuesta"}
            aria-expanded={open}
            variant="ghost"
            size="sm"
            className="shrink-0"
          />
        </div>

        {open && (
          <p className="text-body-md text-on-surface-variant mt-4 pt-4 border-t border-surface-dim">
            {respuesta}
          </p>
        )}
      </li>
    </>
  );
};

const PreguntasFrecuentes = ({
  preguntasFrecuentes,
}: PreguntasFrecuentesProps) => {
  return (
    <>
      <h1 className="text-label-lg text-xl text-primary">
        Preguntas frecuentes
      </h1>
      <ul className="flex flex-col gap-4 w-full">
        {preguntasFrecuentes.map((item) => (
          <PreguntaItem key={item.pregunta} {...item} />
        ))}
      </ul>
    </>
  );
};

export default PreguntasFrecuentes;
