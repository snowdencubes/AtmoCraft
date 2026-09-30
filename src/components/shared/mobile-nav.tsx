"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserCircle,
  BookOpen,
  Search,
  Library,
  Users,
  Megaphone,
} from "lucide-react";

interface MobileNavProps {
  role: Role | null;
}

const TRAINEE_ITEMS = [
  { name: "Home", href: "/trainee/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/trainee/courses", icon: BookOpen },
  { name: "Search", href: "/trainee/trainer-finder", icon: Search },
  { name: "Profile", href: "/trainee/profile", icon: UserCircle },
];

const TRAINER_ITEMS = [
  { name: "Home", href: "/trainer/dashboard", icon: LayoutDashboard },
  { name: "Library", href: "/trainer/library", icon: Library },
  { name: "Profile", href: "/trainer/profile", icon: UserCircle },
];

const ADMIN_ITEMS = [
  { name: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Content", href: "/admin/content", icon: Megaphone },
];

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();

  let items = TRAINEE_ITEMS;
  if (role === "trainer") items = TRAINER_ITEMS;
  if (role === "admin") items = ADMIN_ITEMS;

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full border-t bg-[var(--color-surface-card)] pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 transition-colors",
              isActive ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "fill-[var(--color-primary-light)]/20")} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
