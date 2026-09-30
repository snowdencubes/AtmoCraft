"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserCircle,
  BookOpen,
  ClipboardCheck,
  Search,
  Library,
  FileQuestion,
  BarChart3,
  Users,
  UserCheck,
  Megaphone,
} from "lucide-react";

interface SidebarProps {
  role: Role | null;
  collapsed: boolean;
}

const TRAINEE_ITEMS = [
  { name: "Dashboard", href: "/trainee/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/trainee/profile", icon: UserCircle },
  { name: "Courses", href: "/trainee/courses", icon: BookOpen },
  { name: "Assessments", href: "/trainee/assessments", icon: ClipboardCheck },
  { name: "Trainer Finder", href: "/trainee/trainer-finder", icon: Search },
];

const TRAINER_ITEMS = [
  { name: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/trainer/profile", icon: UserCircle },
  { name: "My Library", href: "/trainer/library", icon: Library },
  { name: "Questionnaires", href: "/trainer/questionnaires", icon: FileQuestion },
  { name: "Performance", href: "/trainer/performance", icon: BarChart3 },
];

const ADMIN_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Approvals", href: "/admin/approvals", icon: UserCheck },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Content Manager", href: "/admin/content", icon: Megaphone },
];

export function Sidebar({ role, collapsed }: SidebarProps) {
  const pathname = usePathname();

  let items = TRAINEE_ITEMS;
  if (role === "trainer") items = TRAINER_ITEMS;
  if (role === "admin") items = ADMIN_ITEMS;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen transition-all duration-300 md:block",
        "bg-[var(--color-primary)] text-white",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-[var(--color-primary-light)] px-4">
        <Link href="/" className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--color-secondary)] font-bold">
            CC
          </div>
          {!collapsed && (
            <span className="font-heading text-lg font-bold">Capacity Connect</span>
          )}
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-2 px-3">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors focus-ring",
                isActive
                  ? "bg-[var(--color-primary-light)] font-medium"
                  : "hover:bg-[var(--color-primary-dark)]"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon
                className={cn("h-5 w-5 shrink-0", isActive ? "text-[var(--color-accent)]" : "text-slate-300")}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
