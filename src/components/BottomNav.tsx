interface NavItem {
  icon: React.ReactNode;
  label?: string;
}

interface BottomNavProps {
  items: NavItem[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function BottomNav({
  items,
  activeIndex = 0,
  onChange,
  className = "",
}: BottomNavProps) {
  return (
    <nav
      className={`flex items-center justify-around bg-surface-container-lowest rounded-2xl px-4 py-3 shadow-ambient-md ${className}`}
    >
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={i}
            onClick={() => onChange?.(i)}
            className={`
              flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-smooth
              ${
                isActive
                  ? "bg-primary text-primary-on shadow-ambient-sm"
                  : "text-on-surface-variant hover:bg-surface-dim"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label && <span className="text-label-md">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
