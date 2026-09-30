"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ClipboardCheck } from "lucide-react";

export default function TraineeAssessments() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Assessments" 
        subtitle="Manage your quizzes, exams, and questionnaires."
        breadcrumbs={[{ label: "Dashboard", href: "/trainee/dashboard" }, { label: "Assessments" }]}
      />
      
      <div className="rounded-2xl border bg-[var(--color-surface-card)] p-8">
        <EmptyState 
          icon={<ClipboardCheck className="h-16 w-16" />}
          title="No Pending Assessments"
          description="You have completed all active assessments. Check back later when your trainers assign new ones."
        />
      </div>
    </div>
  );
}
