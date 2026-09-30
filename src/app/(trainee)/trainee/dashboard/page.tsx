"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getEnrollments, getCourses, getAnnouncements } from "@/lib/services";
import { Course, Enrollment, Announcement } from "@/lib/types";
import { KPICard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { SkeletonCard, SkeletonKPI, SkeletonLine } from "@/components/shared/skeleton";
import { BookOpen, Award, TrendingUp, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TraineeDashboard() {
  const { currentUser } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      const [eData, cData, aData] = await Promise.all([
        getEnrollments(currentUser.id),
        getCourses(),
        getAnnouncements()
      ]);
      setEnrollments(eData);
      setCourses(cData);
      setAnnouncements(aData.filter(a => a.type === 'notification' || a.type === 'announcement').slice(0, 3));
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  const ongoingCount = enrollments.filter(e => e.progress < 100).length;
  const completedCount = enrollments.filter(e => e.progress === 100).length;
  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length) 
    : 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title={`Welcome back, ${currentUser?.name.split(' ')[0]}!`} 
        subtitle="Here's what's happening with your learning journey." 
      />

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonKPI key={i} />)
        ) : (
          <>
            <KPICard title="Ongoing Courses" value={ongoingCount} change={12} trend="up" icon={BookOpen} />
            <KPICard title="Completed Courses" value={completedCount} change={5} trend="up" icon={Award} />
            <KPICard title="Avg. Progress" value={avgProgress} change={2} trend="neutral" icon={TrendingUp} />
            <KPICard title="Learning Hours" value={34} change={8} trend="up" icon={Clock} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content - Left 2 columns */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Continue Learning */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Continue Learning</h2>
              <Link href="/trainee/courses" className="text-sm font-medium text-[var(--color-primary)] hover:underline focus-ring rounded">
                View all
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {loading ? (
                Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : enrollments.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-[var(--color-on-surface-muted)]">
                  You haven't enrolled in any courses yet.
                </div>
              ) : (
                enrollments.filter(e => e.progress < 100).map(enrollment => {
                  const course = courses.find(c => c.id === enrollment.courseId);
                  if (!course) return null;
                  return (
                    <div key={enrollment.id} className="group flex flex-col gap-4 rounded-xl border bg-[var(--color-surface-card)] p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)]/10 text-[var(--color-primary)]">
                        <BookOpen className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-[var(--color-on-surface-muted)]">{course.trainerName}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
                            <div 
                              className="h-full rounded-full bg-[var(--color-secondary)] transition-all duration-1000" 
                              style={{ width: `${enrollment.progress}%` }} 
                            />
                          </div>
                          <span className="text-xs font-medium text-[var(--color-on-surface-muted)]">{enrollment.progress}%</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-transform group-hover:scale-110 focus-ring">
                          <PlayCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Sidebar - Right column */}
        <div className="flex flex-col gap-8">
          {/* Announcements */}
          <section className="rounded-xl border bg-[var(--color-surface-card)] shadow-sm">
            <div className="border-b p-4">
              <h2 className="font-heading font-bold">Important Announcements</h2>
            </div>
            <div className="flex flex-col p-4 gap-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => <SkeletonLine key={i} className="h-16" />)
              ) : announcements.length === 0 ? (
                <p className="text-sm text-[var(--color-on-surface-muted)] text-center py-4">No new announcements</p>
              ) : (
                announcements.map(ann => (
                  <div key={ann.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className={cn(
                      "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                      ann.type === 'notification' ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-warning)]'
                    )} />
                    <div>
                      <h4 className="text-sm font-semibold">{ann.title}</h4>
                      <p className="mt-1 text-xs text-[var(--color-on-surface-muted)] line-clamp-2">{ann.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          
          {/* Upcoming Assessments Mini */}
          <section className="rounded-xl border bg-[var(--color-surface-card)] shadow-sm">
            <div className="border-b p-4">
              <h2 className="font-heading font-bold">Pending Actions</h2>
            </div>
            <div className="p-4 text-center py-8">
              <p className="text-sm text-[var(--color-on-surface-muted)]">You're all caught up!</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
