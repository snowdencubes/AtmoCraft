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
    <div className={cn("group relative flex flex-col justify-between rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--primary)]/30 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <p className="text-sm font-semibold text-[var(--on-surface-muted)] tracking-wide">{title}</p>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-raised)] text-[var(--primary)] transition-all duration-300 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] group-hover:scale-110 border border-[var(--outline)] group-hover:border-[var(--primary)]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <h4 className="font-heading text-4xl font-extrabold text-[var(--on-surface)] tracking-tight">{displayValue.toLocaleString()}</h4>
          
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm border",
            trend === "up" && "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
            trend === "down" && "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20",
            trend === "neutral" && "bg-[var(--on-surface-muted)]/10 text-[var(--on-surface-muted)] border-[var(--outline)]"
          )}>
            {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
            {trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend === "neutral" && <Minus className="h-3.5 w-3.5" />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
