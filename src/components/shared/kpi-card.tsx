"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number;
  change: number; // percentage
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  className?: string;
}

export function KPICard({ title, value, change, trend, icon: Icon, className }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Simple count up animation
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(Math.floor(easeProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className={cn("group flex flex-col justify-between rounded-2xl border bg-[var(--color-surface-card)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md", className)}>
      <div className="mb-4 flex items-start justify-between">
        <p className="text-sm font-medium text-[var(--color-on-surface-muted)]">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-raised)] text-[var(--color-secondary)] transition-colors group-hover:bg-[var(--color-secondary)] group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <h4 className="font-heading text-3xl font-bold">{displayValue.toLocaleString()}</h4>
        
        <div className={cn(
          "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
          trend === "up" && "bg-[var(--color-success)]/10 text-[var(--color-success)]",
          trend === "down" && "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
          trend === "neutral" && "bg-[var(--color-on-surface-muted)]/10 text-[var(--color-on-surface-muted)]"
        )}>
          {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
          {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
          {trend === "neutral" && <Minus className="h-3 w-3" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
}
