import { SearchInput } from "@/components/SearchInput";
import { NuqsAdapter } from "nuqs/adapters/react";
import Bento from "./Bento";
import Catalogo from "./Catalogo";
import CardPersonalizado from "../components/CardPersonalizado";

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
  const ITEMS_PER_PAGE = 4; // Verificar como ajustarlo para que sea responsive, por ejemplo 2 en pantallas pequeñas y 4 en grandes

  return (
    <NuqsAdapter>
      {/*Bento*/}
      <section className="flex-1 w-full pb-5 sm:pb-10">
        <Bento colecciones={colecciones} />
      </section>

      {/*Barra de busqueda*/}
      <SearchInput placeholder="¿Qué amigurumi buscas hoy?" className="mb-6" />

      {/*Catálogo*/}
      <Catalogo itemsPerPage={ITEMS_PER_PAGE} productos={productos} />

      <CardPersonalizado />
    </NuqsAdapter>
  );
};

export default Main;
