import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
}

export function SearchInput({
  className = "",
  placeholder = "Buscar...",
}: SearchInputProps) {
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));

  return (
    <section
      className={`w-full max-w-2xl flex items-center gap-3 bg-surface-container-low rounded-full px-5 py-3 ghost-border transition-smooth focus-within:ring-2 focus-within:ring-primary/30 ${className}`}
    >
      <Search strokeWidth={2} className="text-on-surface-variant opacity-75" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value || null)}
        placeholder={placeholder}
        className="bg-transparent text-body-lg text-on-surface placeholder:text-on-surface-variant placeholder:opacity-55 w-full outline-none"
      />
    </section>
  );
}
