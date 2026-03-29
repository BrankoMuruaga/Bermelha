import { ArrowLeft, ArrowRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { IconButton } from "./IconButton";

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
}

export default function Pagination({
  totalItems,
  itemsPerPage = 8,
}: PaginationProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    document.getElementById("catalogo")?.scrollIntoView();
  };

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-2 mt-8"
    >
      <IconButton
        icon={<ArrowLeft strokeWidth={1.25} />}
        onClick={() => {
          handlePageChange(page - 1);
        }}
        disabled={page <= 1}
        aria-label="Página anterior"
        className="px-4 py-2 rounded-full text-label-lg surface-card ghost-border transition-smooth hover:bg-surface-dim disabled:opacity-40 disabled:cursor-not-allowed"
      />

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <IconButton
          icon={p}
          key={p}
          onClick={() => {
            handlePageChange(p);
          }}
          variant={p === page ? "primary" : "ghost"}
          aria-label={`Página ${p}`}
          aria-current={p === page ? "page" : undefined}
          className="w-10 h-10 rounded-full text-label-lg transition-smooth"
        />
      ))}

      <IconButton
        icon={<ArrowRight strokeWidth={1.25} />}
        onClick={() => {
          handlePageChange(page + 1);
        }}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className="px-4 py-2 rounded-full text-label-lg surface-card ghost-border transition-smooth hover:bg-surface-dim disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </nav>
  );
}
