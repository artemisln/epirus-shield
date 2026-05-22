import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-foreground text-background hover:bg-foreground/90",
  outline: "border-2 border-foreground text-foreground hover:bg-surface-elevated",
  ghost: "text-foreground hover:bg-surface-elevated",
  link: "text-foreground underline-offset-4 hover:underline",
};

const disabledClasses: Record<ButtonVariant, string> = {
  primary: "disabled:bg-muted-light disabled:text-muted disabled:cursor-not-allowed",
  secondary: "disabled:bg-muted-light disabled:text-muted disabled:cursor-not-allowed",
  outline: "disabled:border-muted-light disabled:text-muted disabled:cursor-not-allowed",
  ghost: "disabled:text-muted disabled:cursor-not-allowed",
  link: "disabled:text-muted disabled:cursor-not-allowed disabled:no-underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-semibold rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
