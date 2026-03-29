import { CollectionCard } from "@/components/CollectionCard";

interface BentoProps {
  colecciones: {
    id: string;
    nombre: string;
    subtitulo: string;
    imagen: string;
    destacado: boolean;
    posicion: 1 | 2 | 3 | 4 | null;
  }[];
}

export default function Bento({ colecciones }: BentoProps) {
  const coleccionesDestacadas = colecciones.filter((c) => c.destacado);

  const sinPosicion = coleccionesDestacadas.filter((c) => !c.posicion);

  let sinPosicionIndex = 0;
  const getColeccion = (posicion: 1 | 2 | 3 | 4) => {
    const found = coleccionesDestacadas.find((c) => c.posicion === posicion);
    if (found) return found;
    // Busca la siguiente sin posición que no tenga posición asignada
    while (sinPosicionIndex < sinPosicion.length) {
      return sinPosicion[sinPosicionIndex++];
    }
    return undefined;
  };

  const coleccion1 = getColeccion(1);
  const coleccion2 = getColeccion(2);
  const coleccion3 = getColeccion(3);
  const coleccion4 = getColeccion(4);

  return (
    <section className="w-full flex flex-col sm:flex-row gap-3 sm:gap-6 sm:h-120 2xl:h-160">
      {/* Card grande */}

      {coleccion1 && (
        <CollectionCard
          image={coleccion1.imagen}
          title={coleccion1.nombre}
          subtitle={coleccion1.subtitulo}
          className="h-64 sm:h-full sm:w-1/2"
        />
      )}

      {/* Grid derecho */}
      <div className="flex flex-col gap-3 sm:gap-6 sm:w-1/2 sm:h-full">
        <div className="flex gap-3 sm:gap-6 h-64 sm:h-1/2">
          {coleccion2 && (
            <CollectionCard
              image={coleccion2.imagen}
              title={coleccion2.nombre}
              subtitle={coleccion2.subtitulo}
              className="w-1/2 h-full"
            />
          )}
          {coleccion3 && (
            <CollectionCard
              image={coleccion3.imagen}
              title={coleccion3.nombre}
              subtitle={coleccion3.subtitulo}
              className="w-1/2 h-full"
            />
          )}
        </div>

        {coleccion4 && (
          <CollectionCard
            image={coleccion4.imagen}
            title={coleccion4.nombre}
            subtitle={coleccion4.subtitulo}
            className="h-64 sm:flex-1 sm:h-full"
          />
        )}
      </div>
    </section>
  );
}
