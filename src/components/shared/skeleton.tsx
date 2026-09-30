import { cn } from "@/lib/utils";

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn("h-4 w-full animate-pulse-slow rounded bg-[var(--color-outline)]", className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-[var(--color-surface-card)] p-4 shadow-sm">
      <div className="h-32 w-full animate-pulse-slow rounded-lg bg-[var(--color-outline)]" />
      <SkeletonLine className="w-3/4" />
      <SkeletonLine className="w-1/2" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 animate-pulse-slow rounded-md bg-[var(--color-outline)]" />
        <div className="h-8 w-20 animate-pulse-slow rounded-md bg-[var(--color-outline)]" />
      </div>
    </div>
  );
}

export function SkeletonKPI() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-[var(--color-surface-card)] p-4 shadow-sm">
      <div className="h-12 w-12 shrink-0 animate-pulse-slow rounded-full bg-[var(--color-outline)]" />
      <div className="flex w-full flex-col gap-2">
        <SkeletonLine className="w-1/2" />
        <SkeletonLine className="h-8 w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-[var(--color-surface-card)] shadow-sm">
      <div className="border-b bg-[var(--color-surface-raised)] p-4">
        <SkeletonLine className="h-6 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b p-4 last:border-0">
          <SkeletonLine className="w-1/4" />
          <SkeletonLine className="w-1/3" />
          <SkeletonLine className="w-1/4" />
        </div>
      ))}
    </div>
  );
}
