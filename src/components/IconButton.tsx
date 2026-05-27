import React from "react";

type IconButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "ghost";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  sizeInMobile?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
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

const mobilePadding: Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl", string> =
  {
    xs: "p-1",
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
    xl: "p-5",
    "2xl": "p-6",
  };

const mobileTextSize: Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl", string> =
  {
    xs: "text-sm",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

const desktopPadding: Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl", string> =
  {
    xs: "sm:p-1",
    sm: "sm:p-2",
    md: "sm:p-3",
    lg: "sm:p-4",
    xl: "sm:p-5",
    "2xl": "sm:p-6",
  };

const desktopTextSize: Record<
  "xs" | "sm" | "md" | "lg" | "xl" | "2xl",
  string
> = {
  xs: "sm:text-sm",
  sm: "sm:text-sm",
  md: "sm:text-base",
  lg: "sm:text-lg",
  xl: "sm:text-xl",
  "2xl": "sm:text-2xl",
};

export function IconButton({
  icon,
  variant = "ghost",
  size = "sm",
  sizeInMobile = "sm",
  active = false,
  className = "",
  ...props
}: IconButtonProps) {
  const paddingClass = `${mobilePadding[sizeInMobile]} ${desktopPadding[size]}`;
  const textSizeClass = `${mobileTextSize[sizeInMobile]} ${desktopTextSize[size]}`;

  return (
    <button
      className={`cursor-pointer inline-flex items-center justify-center rounded-full transition-all ${iconButtonVariants[variant]} ${paddingClass} ${textSizeClass} ${active ? "ring-2 ring-primary/40" : ""} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
