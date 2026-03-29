type IconButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "ghost";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: "xs" | "sm" | "md" | "lg";
  active?: boolean;
}

const iconButtonVariants: Record<IconButtonVariant, string> = {
  primary: "bg-primary text-primary-on hover:bg-primary-dim",
  secondary: "bg-secondary text-secondary-on hover:brightness-90",
  tertiary: "bg-tertiary text-tertiary-on hover:brightness-90",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost:
    "bg-surface-dim text-on-surface-variant hover:bg-surface-container-high",
};

const iconButtonSizes: Record<"xs" | "sm" | "md" | "lg", string> = {
  xs: "p-1 text-sm",
  sm: "p-2 text-sm",
  md: "p-3 text-base",
  lg: "p-4 text-lg",
};

export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  active = false,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`
        cursor-pointer inline-flex items-center justify-center rounded-full transition-all
        ${iconButtonVariants[variant]}
        ${iconButtonSizes[size]}
        ${active ? "ring-2 ring-primary/40" : ""}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
}
