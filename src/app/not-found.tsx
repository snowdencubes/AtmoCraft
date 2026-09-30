"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4">
      <EmptyState
        icon={<Search className="h-16 w-16" />}
        title="Page Not Found"
        description="The page you are looking for doesn't exist or has been moved."
        action={{
          label: "Return Home",
          onClick: () => window.location.href = "/",
        }}
        className="max-w-md bg-[var(--color-surface-card)]"
      />
    </div>
  );
}
