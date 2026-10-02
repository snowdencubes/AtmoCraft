import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-2xl",
          "dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "motion-reduce:backdrop-blur-none motion-reduce:bg-[var(--surface-card)]",
          className
        )}
        {...props}
      />
    )
  }
)
GlassPanel.displayName = "GlassPanel"
