"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function AdminDashboard() {
  const { currentUser } = useAuthStore();
  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={`Admin Dashboard, ${currentUser?.name.split(' ')[0]}`}
      />
      
      <div className="rounded-2xl border bg-[var(--color-surface-card)] p-8">
        <EmptyState 
          icon={<LayoutDashboard className="h-16 w-16" />}
          title="Admin Overview"
          description="System-wide metrics and KPIs will appear here."
        />
      </div>
    </div>
  );
}
