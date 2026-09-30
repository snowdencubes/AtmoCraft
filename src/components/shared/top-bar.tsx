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
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-[var(--color-surface-card)] px-4 shadow-sm transition-all duration-300",
        "left-0 md:left-64",
        collapsed && "md:left-[72px]"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-[var(--color-surface-raised)] focus-ring md:block hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-[var(--color-on-surface-muted)]" />
        </button>
        {/* Mobile menu button (always shows sidebar/bottom nav conceptually, but here we just need a visual toggle or logo) */}
        <div className="md:hidden font-heading font-bold text-[var(--color-primary)]">
          AtmoCraft
        </div>

        <div className="hidden items-center gap-2 rounded-full border bg-[var(--color-surface)] px-3 py-1.5 focus-within:ring-2 focus-within:ring-[var(--color-secondary)] md:flex">
          <Search className="h-4 w-4 text-[var(--color-on-surface-muted)]" />
          <input
            type="text"
            placeholder="Search courses, trainers..."
            className="w-64 bg-transparent text-sm outline-none placeholder:text-[var(--color-on-surface-muted)]"
          />
          <kbd className="hidden rounded bg-[var(--color-outline)] px-1.5 text-xs text-[var(--color-on-surface-muted)] lg:block">
            Ctrl K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
        
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full p-2 hover:bg-[var(--color-surface-raised)] focus-ring"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-[var(--color-on-surface-muted)]" />
          ) : (
            <Moon className="h-5 w-5 text-[var(--color-on-surface-muted)]" />
          )}
        </button>

        <button className="relative rounded-full p-2 hover:bg-[var(--color-surface-raised)] focus-ring">
          <Bell className="h-5 w-5 text-[var(--color-on-surface-muted)]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-danger)]"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 rounded-full border p-1 pr-3 hover:bg-[var(--color-surface-raised)] focus-ring"
          >
            <div className="flex h-8 w-8 items-center justify-center bg-[var(--color-primary-light)] text-white shadow-[0_0_10px_rgba(0,0,0,0.5)] [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]">
              {currentUser?.name.charAt(0) || "U"}
            </div>
            <span className="hidden text-sm font-medium sm:block">
              {currentUser?.name || "User"}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-[var(--color-surface-card)] py-1 shadow-md">
              <div className="border-b px-4 py-2">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-[var(--color-on-surface-muted)] capitalize">
                  {currentUser?.role}
                </p>
              </div>
              <Link
                href={`/${currentUser?.role}/profile`}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--color-surface-raised)]"
                onClick={() => setShowDropdown(false)}
              >
                <User className="h-4 w-4" /> My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-surface-raised)]"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
