"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
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
  { name: "Resource Library", href: "/trainer/resources", icon: Library },
  { name: "Assessments", href: "/trainer/assessments", icon: FileQuestion },
  { name: "Performance", href: "/trainer/performance", icon: BarChart3 },
];

const ADMIN_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Approvals", href: "/admin/users?filter=pending", icon: UserCheck },
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
        "fixed left-0 top-0 z-40 hidden h-screen transition-all duration-300 md:flex flex-col border-r border-white/5",
        "bg-[var(--primary-dark)] text-white shadow-2xl",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-[72px] items-center justify-center border-b border-white/10 px-4">
        <Link href="/" className="flex items-center gap-3 overflow-hidden whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg p-1">
          <Logo className="h-9 w-9 shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          {!collapsed && (
            <span className="font-heading text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">AtmoCraft</span>
          )}
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-2 px-3 flex-1 overflow-y-auto custom-scrollbar">
        {!collapsed && (
          <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-white/40">
            Navigation
          </div>
        )}
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                isActive
                  ? "bg-gradient-to-r from-[var(--primary)]/40 to-transparent font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "hover:bg-white/5 text-white/70 hover:text-white font-medium"
              )}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -mt-3 h-6 w-1 rounded-r-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
              )}
              <item.icon
                className={cn("h-5 w-5 shrink-0 transition-all duration-300", 
                  isActive ? "text-[var(--accent)] drop-shadow-[0_0_8px_rgba(232,148,58,0.5)]" : "text-white/50 group-hover:text-white/90"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
      
      {!collapsed && (
        <div className="p-4 mb-4">
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4 border border-white/10 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--accent)]/20 rounded-full blur-xl pointer-events-none" />
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">IMD Support</p>
            <p className="text-xs text-white/60 leading-relaxed mb-3">Need help with your courses?</p>
            <button className="w-full rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 transition-colors">
              Contact Helpdesk
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
