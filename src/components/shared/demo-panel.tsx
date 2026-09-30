"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useDbStore } from "@/lib/db/store";
import { Role } from "@/lib/types";
import { Beaker, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoPanel() {
  const [expanded, setExpanded] = useState(false);
  const { role, switchRole, isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated) return null;

  const handleSwitch = (newRole: Role) => {
    switchRole(newRole);
    router.push(`/${newRole}/dashboard`);
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border bg-[var(--color-surface-card)]/95 shadow-lg backdrop-blur-sm transition-all duration-300",
          expanded ? "w-48" : "w-12"
        )}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-12 w-full items-center justify-between px-3 hover:bg-[var(--color-surface-raised)]"
        >
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-[var(--color-accent)]" />
            {expanded && <span className="text-sm font-semibold">Demo Only</span>}
          </div>
          {expanded && (
            expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
          )}
        </button>

        {expanded && (
          <div className="flex flex-col gap-1 p-2">
            {(["trainee", "trainer", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => handleSwitch(r)}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm font-medium capitalize transition-colors",
                  role === r
                    ? "bg-[var(--color-primary)] text-white"
                    : "hover:bg-[var(--color-surface-raised)]"
                )}
              >
                {r}
              </button>
            ))}
            <hr className="my-1 border-[var(--color-surface-raised)]" />
            <button
              onClick={() => {
                useDbStore.getState().resetDemoData();
                alert('Demo data reset successfully!');
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-red-500 hover:text-white text-red-500"
            >
              Reset Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
