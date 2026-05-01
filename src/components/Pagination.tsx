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

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];

    const showLeftDots = page > 3;
    const showRightDots = page < totalPages - 2;

    pages.push(1);

    if (showLeftDots) {
      pages.push("...");
    }

    // middle 3: prev, current, next (clamped)
    const start = Math.max(2, Math.min(page - 1, totalPages - 3));
    const end = Math.min(totalPages - 1, Math.max(page + 1, 4));

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (showRightDots) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPages();

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-2 mt-8"
    >
      <IconButton
        icon={<ArrowLeft strokeWidth={1.25} />}
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className="px-4 py-2 rounded-full text-label-lg surface-card ghost-border transition-smooth hover:bg-surface-dim disabled:opacity-40 disabled:cursor-not-allowed"
      />

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-10 h-10 flex items-center justify-center text-label-lg"
          >
            …
          </span>
        ) : (
          <IconButton
            icon={p}
            key={p}
            onClick={() => handlePageChange(p)}
            variant={p === page ? "primary" : "ghost"}
            aria-label={`Página ${p}`}
            aria-current={p === page ? "page" : undefined}
            className="w-10 h-10 rounded-full text-label-lg transition-smooth"
          />
        ),
      )}

      <IconButton
        icon={<ArrowRight strokeWidth={1.25} />}
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className="px-4 py-2 rounded-full text-label-lg surface-card ghost-border transition-smooth hover:bg-surface-dim disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </nav>
  );
}
