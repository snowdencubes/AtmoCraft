"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/lib/types";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { MobileNav } from "./mobile-nav";
import { DemoPanel } from "./demo-panel";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole: Role;
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || !role) {
      router.push("/login");
    } else if (role !== requiredRole) {
      // In a real app we might redirect to their own dashboard or a forbidden page
      router.push(`/${role}/dashboard`);
    }
  }, [isAuthenticated, role, requiredRole, router]);

  if (!mounted || !isAuthenticated || !role || role !== requiredRole) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>; // Loading state while redirecting
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <Sidebar role={role} collapsed={collapsed} />
      <TopBar onMenuClick={() => setCollapsed(!collapsed)} collapsed={collapsed} />
      
      <main
        className={cn(
          "min-h-screen pb-16 pt-16 transition-all duration-300 md:pb-0",
          collapsed ? "md:pl-[72px]" : "md:pl-64"
        )}
      >
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>

      <MobileNav role={role} />
      <DemoPanel />
    </div>
  );
}
