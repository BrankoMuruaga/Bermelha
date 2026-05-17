import { SearchInput } from "@/components/SearchInput";
import { NuqsAdapter } from "nuqs/adapters/react";
import CardPersonalizado from "../components/CardPersonalizado";
import Bento from "./Bento";
import Catalogo from "./Catalogo";
import { ArrowRight } from "lucide-react";

interface MainProps {
  productos: {
    id: string;
    nombre: string;
    precio: number;
    imagenPrincipal: string;
    centimetros: number;
    tags?: string[];
    coleccion?: string | null;
  }[];
  colecciones: {
    id: string;
    nombre: string;
    subtitulo: string;
    imagen: string;
    destacado: boolean;
    posicion: 1 | 2 | 3 | 4 | null;
  }[];
}

const Main = ({ productos, colecciones }: MainProps) => {
  const ITEMS_PER_PAGE = 4;

  return (
    <NuqsAdapter>
      {/*Bento*/}
      <section className="flex-1 w-full pb-5 sm:pb-10">
        <Bento colecciones={colecciones} />
      </section>

      {/*Buscador*/}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-2 mb-6 px-4 sm:px-0">
        <SearchInput placeholder="¿Qué amigurumi buscas hoy?" />

        <div className="w-full flex justify-end">
          <a
            href="/catalogo"
            className="group inline-flex items-center gap-1.5 text-sm sm:text-base font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Explora el catálogo completo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/*Catálogo*/}
      <div className="w-full flex flex-col items-center gap-2">
        <Catalogo itemsPerPage={ITEMS_PER_PAGE} productos={productos} />
      </div>

      <CardPersonalizado />
    </NuqsAdapter>
  );
};

export default Main;
