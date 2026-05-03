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
