"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { Menu, Search, Bell, Sun, Moon, LogOut, User } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";

interface TopBarProps {
  onMenuClick: () => void;
  collapsed: boolean;
}

export function TopBar({ onMenuClick, collapsed }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const { currentUser, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-[var(--outline)] bg-[var(--surface)]/80 backdrop-blur-xl px-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300",
        "left-0 md:left-64",
        collapsed && "md:left-[72px]"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-[var(--on-surface-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] md:block hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Mobile menu button (always shows sidebar/bottom nav conceptually, but here we just need a visual toggle or logo) */}
        <div className="md:hidden font-heading font-extrabold tracking-tight text-[var(--primary)] text-xl">
          AtmoCraft
        </div>

        <div className="hidden items-center gap-3 rounded-full border border-[var(--outline)] bg-[var(--surface-raised)] px-4 py-2 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20 transition-all md:flex w-72 lg:w-96">
          <Search className="h-4 w-4 text-[var(--on-surface-muted)]" />
          <input
            type="text"
            placeholder="Search courses, trainers..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--on-surface-muted)] text-[var(--on-surface)]"
          />
          <kbd className="hidden rounded bg-[var(--outline)]/50 border border-[var(--outline)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--on-surface-muted)] lg:block">
            ⌘ K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
        
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full p-2.5 text-[var(--on-surface-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <button className="relative rounded-full p-2.5 text-[var(--on-surface-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-[var(--danger)] animate-pulse"></span>
        </button>

        <div className="relative ml-2">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 rounded-full border border-[var(--outline)] bg-[var(--surface-card)] p-1 pr-4 hover:border-[var(--primary)]/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-inner font-bold text-sm">
              {currentUser?.name.charAt(0) || "U"}
            </div>
            <span className="hidden text-sm font-bold text-[var(--on-surface)] sm:block">
              {currentUser?.name || "User"}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 shadow-2xl backdrop-blur-2xl animate-fade-in origin-top-right">
              <div className="mb-2 border-b border-[var(--outline)] px-3 py-3">
                <p className="text-sm font-bold text-[var(--on-surface)] truncate">{currentUser?.name}</p>
                <p className="text-xs font-semibold text-[var(--primary)] capitalize tracking-wide mt-1">
                  {currentUser?.role}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/${currentUser?.role}/profile`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[var(--on-surface)] hover:bg-[var(--surface-raised)] hover:text-[var(--primary)] transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/login";
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
