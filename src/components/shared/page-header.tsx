import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end", className)}>
      <div className="flex flex-col gap-2">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-[var(--color-on-surface-muted)]">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-4 w-4" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[var(--color-primary)] hover:underline focus-ring rounded">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-[var(--color-on-surface)]">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-[var(--color-on-surface-muted)]">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
