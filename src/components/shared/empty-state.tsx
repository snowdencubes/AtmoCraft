import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center", className)}>
      <div className="mb-4 text-[var(--color-on-surface-muted)] opacity-50">
        {icon}
      </div>
      <h3 className="mb-2 font-heading text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[var(--color-on-surface-muted)]">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)] focus-ring"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
