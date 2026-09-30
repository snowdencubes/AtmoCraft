"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ClipboardCheck, Clock, BookOpen, ArrowRight } from "lucide-react";
import { assessmentService } from "@/lib/services/assessmentService";
import { Assessment } from "@/lib/types";
import Link from "next/link";

export default function TraineeAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const data = await assessmentService.getAvailableAssessments();
        setAssessments(data);
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAssessments();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Assessments" 
        subtitle="Manage your quizzes, exams, and questionnaires."
        breadcrumbs={[{ label: "Dashboard", href: "/trainee/dashboard" }, { label: "Assessments" }]}
      />
      
      {loading ? (
        <div className="rounded-2xl border bg-[var(--color-surface-card)] p-8 text-center text-muted-foreground">
          Loading assessments...
        </div>
      ) : assessments.length === 0 ? (
        <div className="rounded-2xl border bg-[var(--color-surface-card)] p-8">
          <EmptyState 
            icon={<ClipboardCheck className="h-16 w-16" />}
            title="No Pending Assessments"
            description="You have completed all active assessments. Check back later when your trainers assign new ones."
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {assessment.subject}
                </span>
                <span className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" /> {assessment.duration} min
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{assessment.title}</h3>
              <div className="mb-6 flex items-center text-sm text-muted-foreground">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>{assessment.questions.length} Questions</span>
              </div>
              <div className="mt-auto">
                <Link href={`/trainee/assessments/${assessment.id}`} className="block">
                  <button className="w-full group rounded-lg bg-[var(--color-primary)] py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)] focus-ring flex items-center justify-center">
                    Start Assessment
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
