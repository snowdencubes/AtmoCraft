"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger" | "warning";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-on-surface)]/40 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-xl animate-slide-up"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-raised)] focus-ring"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 id="dialog-title" className="font-heading text-xl font-bold">
          {title}
        </h2>
        <p id="dialog-desc" className="mt-2 text-[var(--color-on-surface-muted)]">
          {description}
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-[var(--color-surface-raised)] focus-ring"
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus-ring disabled:opacity-70",
              confirmVariant === "primary" && "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]",
              confirmVariant === "danger" && "bg-[var(--color-danger)] hover:bg-red-700",
              confirmVariant === "warning" && "bg-[var(--color-warning)] hover:bg-amber-600"
            )}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
