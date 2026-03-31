interface CollectionCardProps {
  image: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function CollectionCard({
  image,
  title,
  subtitle,
  className = "",
}: CollectionCardProps) {
  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `/?q=${encodeURIComponent(title)}#catalogo`;
      }}
      className={`relative overflow-hidden rounded-md cursor-pointer group transition-smooth hover:scale-105 hover:shadow-ambient-lg ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover aspect-square"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 text-left">
        <h3 className="text-title-md text-white text-xl">{title}</h3>
        {subtitle && <p className=" text-white/75 mb-1 text-md">{subtitle}</p>}
      </div>
    </a>
  );
}
