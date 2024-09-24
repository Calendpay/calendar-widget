import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type IButtonProps = {
  variant: "primary" | "secondary" | "success" | "danger" | "disabled";
  size: "xSmall" | "small" | "base" | "large" | "xl" | "2xl";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: ComponentProps<"button">["className"];
  state?: "default" | "loading" | "success" | "error";
  children: ReactNode;
} & ComponentProps<"button">;

type IVariantStyles = {
  [key in IButtonProps["variant"]]: ComponentProps<"button">["className"];
};

type ISizeStyles = {
  [key in IButtonProps["size"]]: ComponentProps<"button">["className"];
};

export const variantStyles: IVariantStyles = {
  primary:
    "bg-button-primary-background text-button-primary-text hover:bg-button-primary-hover-background",
  secondary:
    "bg-button-secondary-background text-button-secondary-text hover:bg-button-secondary-hover-background",
  success:
    "bg-button-success-background text-button-success-text hover:bg-button-success-hover-background",
  danger:
    "bg-button-danger-background text-button-danger-text hover:bg-button-danger-hover-background",
  disabled:
    "bg-button-disabled-background text-button-disabled-text pointer-events-none cursor-not-allowed",
};

export const sizeStyles: ISizeStyles = {
  xSmall: "py-1.5 px-2 text-xs rounded-md font-medium",
  small: "py-2 px-3 text-xs rounded-md font-medium",
  base: "py-2 px-3 text-sm rounded-md font-medium",
  large: "py-2.5 px-3.5 text-sm font-medium rounded-md",
  xl: "py-3 px-6 text-base font-semibold rounded-lg",
  "2xl": "py-3 px-8 text-lg font-semibold rounded-lg",
};

const Button = ({
  className,
  children,
  variant = "primary",
  size = "base",
  iconLeft,
  iconRight,
  ...buttonProps
}: IButtonProps) => {
  return (
    <button
      {...buttonProps}
      className={`${twMerge(
        `${variantStyles[variant]} ${sizeStyles[size]}  transition ease-in flex items-center justify-start gap-2 ${className}`
      )}`}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
};

export default Button;
