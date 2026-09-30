"use client";

import { useEffect, useState } from "react";
import { Search, MonitorPlay, User, LayoutDashboard, Settings, X, ChevronRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { currentUser, role } = useAuthStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Don't render for unauthenticated users
  if (!currentUser) return null;

  const navigate = (path: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  };

  const commands = [
    { name: "Go to Dashboard", icon: LayoutDashboard, path: `/${role}/dashboard`, roles: ["trainee", "trainer", "admin"] },
    { name: "My Profile", icon: User, path: `/${role}/profile`, roles: ["trainee", "trainer"] },
    { name: "Browse Courses", icon: BookOpen, path: `/trainee/courses`, roles: ["trainee"] },
    { name: "Assessments", icon: MonitorPlay, path: `/trainee/assessments`, roles: ["trainee"] },
    { name: "System Settings", icon: Settings, path: `/admin/settings`, roles: ["admin"] },
  ].filter(cmd => cmd.roles.includes(role || ""));

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-card)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-[var(--color-outline)] px-4">
          <Search className="h-5 w-5 shrink-0 text-[var(--color-on-surface-muted)]" />
          <input
            autoFocus
            className="flex h-14 w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[var(--color-on-surface-muted)] text-[var(--color-on-surface)]"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="rounded p-1 hover:bg-[var(--color-surface-raised)] focus-ring transition-colors">
            <X className="h-4 w-4 text-[var(--color-on-surface-muted)]" />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <p className="p-4 text-center text-sm text-[var(--color-on-surface-muted)]">
              No results found.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="px-2 pb-1 pt-2 text-xs font-semibold text-[var(--color-on-surface-muted)]">
                Quick Actions
              </div>
              {filteredCommands.map((command, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(command.path)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-[var(--color-on-surface)] hover:bg-[var(--color-surface-raised)] transition-colors focus-ring text-left group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary-light)]/10 text-[var(--color-primary)]">
                    <command.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 font-medium">{command.name}</span>
                  <ChevronRight className="h-4 w-4 text-[var(--color-on-surface-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between border-t border-[var(--color-outline)] bg-[var(--color-surface-raised)]/50 px-4 py-3 text-xs text-[var(--color-on-surface-muted)]">
          <span>Search the portal</span>
          <div className="flex gap-1">
            <kbd className="rounded border border-[var(--color-outline)] bg-[var(--color-surface)] px-1.5 py-0.5 font-mono text-[10px]">esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
