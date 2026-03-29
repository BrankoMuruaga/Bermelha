type ButtonVariant = "primary" | "secondary" | "inverted" | "outlined";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  label?: string;
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide transition-smooth rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-on hover:bg-primary-dim active:scale-95 shadow-ambient-sm",
  secondary:
    "bg-secondary-container text-secondary hover:brightness-95 active:scale-95",
  inverted: "bg-on-surface text-surface hover:opacity-90 active:scale-95",
  outlined:
    "bg-transparent text-on-surface border border-outline-variant hover:bg-surface-dim active:scale-95",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-label-md",
  md: "px-6 py-3 text-label-lg",
  lg: "px-8 py-4 text-label-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  label,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label ?? children}
    </button>
  );
}
