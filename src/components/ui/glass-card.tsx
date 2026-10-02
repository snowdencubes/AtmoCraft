import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl",
          "dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]",
          "motion-reduce:backdrop-blur-none motion-reduce:bg-[var(--surface-card)]",
          hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]",
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"
