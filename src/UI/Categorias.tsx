import { CollectionCard } from "@/components/CollectionCard";
import { NuqsAdapter } from "nuqs/adapters/react";

interface CategoriasProps {
  colecciones: {
    id: string;
    nombre: string;
    subtitulo: string;
    imagen: string;
  }[];
}

function Categorias({ colecciones }: CategoriasProps) {
  return (
    <>
      <h3 className="text-label-lg text-xl text-primary">Categorias</h3>
      <p className="text-md text-center mb-4">
        Explora nuestras categorías de amigurumis para encontrar el diseño
        perfecto que se adapte a tu estilo y preferencias. Desde adorables
        animales hasta personajes de fantasía, tenemos una amplia variedad de
        opciones para elegir.
      </p>

      <section className="flex flex-col flex-wrap sm:flex-row gap-6 w-full justify-center">
        {colecciones.map((c) => (
          <CollectionCard
            key={c.id}
            title={c.nombre}
            subtitle={c.subtitulo}
            image={c.imagen}
            className="sm:w-1/4"
          />
        ))}
      </section>
    </>
  );
}

export default function MainCategorias({ colecciones }: CategoriasProps) {
  return (
    <NuqsAdapter>
      <Categorias colecciones={colecciones} />
    </NuqsAdapter>
  );
}
