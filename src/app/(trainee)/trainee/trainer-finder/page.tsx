"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Search } from "lucide-react";

export default function TrainerFinder() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Trainer Finder" 
        subtitle="Search for IMD experts by competency and expertise."
        breadcrumbs={[{ label: "Dashboard", href: "/trainee/dashboard" }, { label: "Trainer Finder" }]}
      />
      
      <div className="rounded-2xl border bg-[var(--color-surface-card)] p-8">
        <EmptyState 
          icon={<Search className="h-16 w-16" />}
          title="Trainer Directory Coming Soon"
          description="The competency-based trainer search feature is currently under development."
        />
      </div>
    </div>
  );
}
