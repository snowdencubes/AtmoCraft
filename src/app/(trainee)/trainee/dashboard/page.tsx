"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getAnnouncements } from "@/lib/services";
import { courseService } from "@/lib/services/courseService";
import { Course, Announcement } from "@/lib/types";
import { KPICard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { SkeletonCard, SkeletonKPI, SkeletonLine } from "@/components/shared/skeleton";
import { BookOpen, Award, TrendingUp, Clock, PlayCircle, Megaphone, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TraineeDashboard() {
  const { currentUser } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<(Course & { progress: number })[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      const [coursesData, aData] = await Promise.all([
        courseService.getEnrolledCourses(currentUser.id),
        getAnnouncements()
      ]);
      setEnrolledCourses(coursesData);
      setAnnouncements(aData.filter(a => a.type === 'notification' || a.type === 'announcement').slice(0, 3));
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  const ongoingCount = enrolledCourses.filter(c => c.progress < 100).length;
  const completedCount = enrolledCourses.filter(c => c.progress === 100).length;
  const avgProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((acc, curr) => acc + curr.progress, 0) / enrolledCourses.length) 
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

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Main Content - Left 2 columns */}
        <div className="flex flex-col gap-8 xl:col-span-2">
          {/* Continue Learning */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--on-surface)] flex items-center gap-2">
                <span className="h-6 w-2 rounded-full bg-[var(--primary)]"></span>
                Continue Learning
              </h2>
              <Link href="/trainee/courses" className="text-sm font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-md px-2 py-1">
                View all courses &rarr;
              </Link>
            </div>
            
            <div className="flex flex-col gap-5">
              {loading ? (
                Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : enrolledCourses.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[var(--outline)] bg-[var(--surface-raised)] p-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-4">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--on-surface)] mb-2">No Active Courses</h3>
                  <p className="text-sm text-[var(--on-surface-muted)] mb-6 max-w-sm mx-auto">
                    You haven't enrolled in any courses yet. Browse the catalog to start your learning journey.
                  </p>
                  <Link href="/trainee/courses" className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
                    Browse Catalog
                  </Link>
                </div>
              ) : (
                enrolledCourses.filter(c => c.progress < 100).map(course => (
                    <div key={course.id} className="group relative flex flex-col gap-4 rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--primary)]/30 hover:-translate-y-1 sm:flex-row sm:items-center overflow-hidden">
                      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--primary)]/5 blur-2xl transition-all group-hover:bg-[var(--primary)]/10" />
                      
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 text-[var(--primary)] border border-[var(--primary)]/10 shadow-sm relative z-10">
                        <BookOpen className="h-8 w-8" />
                      </div>
                      <div className="flex-1 relative z-10">
                        <h3 className="font-heading text-lg font-bold text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">{course.title}</h3>
                        <p className="text-sm font-medium text-[var(--on-surface-muted)] mt-1">Instructor: {course.trainerName}</p>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--outline)]/50">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-1000 relative" 
                              style={{ width: `${course.progress}%` }} 
                            >
                              <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" style={{ transform: 'translateX(-100%)' }} />
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-[var(--on-surface)]">{course.progress}%</span>
                        </div>
                      </div>
                      <div className="shrink-0 relative z-10 mt-4 sm:mt-0">
                        <Link href={`/trainee/courses/${course.id}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--primary)] transition-all duration-300 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] group-hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
                          <PlayCircle className="h-6 w-6 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar - Right column */}
        <div className="flex flex-col gap-8">
          {/* Announcements */}
          <section className="rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--outline)] bg-[var(--surface-raised)]/50 p-5">
              <h2 className="font-heading text-lg font-bold tracking-tight text-[var(--on-surface)] flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Megaphone className="h-3.5 w-3.5" />
                </span>
                Notice Board
              </h2>
            </div>
            <div className="flex flex-col p-5 gap-5">
              {loading ? (
                Array(3).fill(0).map((_, i) => <SkeletonLine key={i} className="h-16 rounded-xl" />)
              ) : announcements.length === 0 ? (
                <p className="text-sm font-medium text-[var(--on-surface-muted)] text-center py-6">No new announcements</p>
              ) : (
                announcements.map(ann => (
                  <div key={ann.id} className="group flex gap-4 pb-5 border-b border-[var(--outline)]/50 last:border-0 last:pb-0 relative">
                    <div className={cn(
                      "mt-1 h-2.5 w-2.5 shrink-0 rounded-full shadow-sm ring-4 ring-transparent transition-all group-hover:scale-110",
                      ann.type === 'notification' ? 'bg-[var(--secondary)] group-hover:ring-[var(--secondary)]/20' : 'bg-[var(--warning)] group-hover:ring-[var(--warning)]/20'
                    )} />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--on-surface)] leading-snug group-hover:text-[var(--primary)] transition-colors">{ann.title}</h4>
                      <p className="mt-1.5 text-xs font-medium text-[var(--on-surface-muted)] line-clamp-2">{ann.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          
          {/* Upcoming Assessments Mini */}
          <section className="rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] shadow-sm overflow-hidden relative group hover:border-[var(--success)]/30 transition-colors">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--success)]/5 blur-2xl" />
            <div className="border-b border-[var(--outline)] bg-[var(--surface-raised)]/50 p-5 relative z-10">
              <h2 className="font-heading text-lg font-bold tracking-tight text-[var(--on-surface)] flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--success)]/10 text-[var(--success)]">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                </span>
                Pending Actions
              </h2>
            </div>
            <div className="p-8 text-center relative z-10 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center mb-4 ring-8 ring-[var(--success)]/5">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-[var(--on-surface)] text-lg mb-1">You're all caught up!</h3>
              <p className="text-sm font-medium text-[var(--on-surface-muted)] max-w-[200px]">No pending assessments or assignments.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
