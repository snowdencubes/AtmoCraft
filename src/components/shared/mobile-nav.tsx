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

interface MobileNavProps {
  role: Role | null;
}

const TRAINEE_ITEMS = [
  { name: "Dashboard", href: "/trainee/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/trainee/courses", icon: BookOpen },
  { name: "Assessments", href: "/trainee/assessments", icon: ClipboardCheck },
  { name: "Profile", href: "/trainee/profile", icon: UserCircle },
];

const TRAINER_ITEMS = [
  { name: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
  { name: "Resources", href: "/trainer/resources", icon: Library },
  { name: "Assessments", href: "/trainer/assessments", icon: FileQuestion },
  { name: "Profile", href: "/trainer/profile", icon: UserCircle },
];

const ADMIN_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Approvals", href: "/admin/approvals", icon: UserCheck },
];

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();

  let items = TRAINEE_ITEMS;
  if (role === "trainer") items = TRAINER_ITEMS;
  if (role === "admin") items = ADMIN_ITEMS;

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] md:hidden">
      <nav className="flex h-16 items-center justify-around px-2">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-[var(--color-primary)]")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
