import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "primary" | "secondary" | "glass" | "ghost" | "outline";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, size = "default", variant = "primary", isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background min-h-[44px]";
    
    const variants = {
      primary: "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md hover:bg-[var(--primary-dark)] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]",
      secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-sm hover:bg-[var(--secondary-light)]",
      glass: "bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20 dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/40",
      ghost: "hover:bg-black/5 dark:hover:bg-white/10 text-[var(--on-surface)]",
      outline: "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] bg-transparent",
    };

    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 px-4 text-xs min-h-[36px]", // Allowing exception to 44px for deliberate sm size, but typically mobile should use default
      lg: "h-12 px-8 text-base",
      icon: "h-11 w-11",
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        ref
      } as any);
    }
    
    return (
      <button className={classes} ref={ref} disabled={isLoading || props.disabled} {...props}>
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
