function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-surface-dim rounded-md animate-pulse ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <li className="w-[90%] sm:w-56 shrink-0">
      <article className="p-3 surface-card rounded-md shadow-ambient-sm">
        {/* Imagen */}
        <SkeletonPulse className="w-full aspect-2/3 rounded-sm" />

        <div className="flex flex-col mt-3 gap-2">
          {/* Nombre */}
          <SkeletonPulse className="h-4 w-3/4" />
          {/* Altura */}
          <SkeletonPulse className="h-3 w-1/2" />

          <div className="w-full flex items-center justify-between mt-1">
            {/* Precio */}
            <SkeletonPulse className="h-4 w-1/3" />
            {/* Botón carrito */}
            <SkeletonPulse className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </article>
    </li>
  );
}

export function CollectionCardSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      <SkeletonPulse className="w-full h-full absolute inset-0" />
      <div className="absolute bottom-0 left-0 p-4 flex flex-col gap-2">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-3 w-24" />
      </div>
    </div>
  );
}

export function WalletSkeleton() {
  return (
    <div className="w-full flex flex-col gap-1">
      <SkeletonPulse className="w-full h-12 rounded-sm" />
      <SkeletonPulse className="w-full h-2.5 rounded-sm mx-auto" />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full  px-4">
      {/* COLUMNA DE IMAGEN - Skeleton */}
      <div className="relative">
        <SkeletonPulse className="w-full aspect-2/3 rounded-sm" />
        {/* Placeholder para el botón de favoritos */}
        <SkeletonPulse className="w-6 h-6 rounded-full absolute top-2 right-2" />
      </div>

      {/* COLUMNA DE DETALLES - Skeleton */}
      <div className="w-full flex flex-col items-start gap-6 py-1">
        <div className="w-full flex flex-col gap-4">
          {/* Link "Volver al catálogo" */}
          <SkeletonPulse className="h-5 w-32" />

          {/* Colección + Nombre */}
          <div className="flex flex-col gap-1.5">
            <SkeletonPulse className="h-3 w-20" />
            <SkeletonPulse className="h-8 w-3/4" />
          </div>

          {/* Precio */}
          <div className="flex items-baseline gap-2">
            <SkeletonPulse className="h-10 w-40" />
            <SkeletonPulse className="h-4 w-8" />
          </div>

          {/* Sección de info con border */}
          <div className="flex flex-col gap-4 py-5 my-2 border-y border-outline-variant">
            {/* Altura */}
            <div className="flex items-center gap-3">
              <SkeletonPulse className="h-5 w-16" />
              <SkeletonPulse className="h-5 w-24" />
            </div>

            {/* Color (si tiene variantes) */}
            <div className="flex items-center gap-3">
              <SkeletonPulse className="h-5 w-16" />
              <SkeletonPulse className="h-5 w-32 rounded-full" />
            </div>
          </div>
        </div>

        {/* Controles: QuantitySelector + Botón agregar */}
        <div className="flex items-center gap-4 w-full">
          {/* QuantitySelector skeleton */}
          <div className="flex items-center gap-2">
            <SkeletonPulse className="w-10 h-10 rounded-full" />
            <SkeletonPulse className="w-5 h-6" />
            <SkeletonPulse className="w-10 h-10 rounded-full" />
          </div>
          {/* Botón "Agregar al carrito" */}
          <SkeletonPulse className="h-14 flex-1 rounded-md" />
        </div>
      </div>
    </article>
  );
}
