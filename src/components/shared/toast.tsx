"use client";

import { create } from "zustand";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 md:bottom-6 md:right-6">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex w-full max-w-sm items-start gap-3 rounded-xl border bg-[var(--color-surface-card)] p-4 shadow-lg animate-slide-up",
              toast.type === "success" && "border-[var(--color-success)]/20",
              toast.type === "error" && "border-[var(--color-danger)]/20",
              toast.type === "warning" && "border-[var(--color-warning)]/20"
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0",
                toast.type === "success" && "text-[var(--color-success)]",
                toast.type === "error" && "text-[var(--color-danger)]",
                toast.type === "warning" && "text-[var(--color-warning)]",
                toast.type === "info" && "text-[var(--color-secondary)]"
              )}
            />
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              {toast.description && (
                <p className="mt-1 text-sm text-[var(--color-on-surface-muted)]">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-full p-1 text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-raised)] focus-ring"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
