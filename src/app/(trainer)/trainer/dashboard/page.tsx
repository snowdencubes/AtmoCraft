"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { KPICard } from "@/components/shared/kpi-card";
import { LayoutDashboard, BookOpen, Users, Star, BarChart3, Clock, MoreVertical } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { coursesRepo, enrollmentsRepo } from "@/lib/db/repos";
import { Course, Enrollment } from "@/lib/types";

export default function TrainerDashboard() {
  const { currentUser } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      const allCourses = await coursesRepo.findAll();
      const myCourses = allCourses.filter(c => c.trainerId === currentUser.id);
      
      const allEnrollments = await enrollmentsRepo.findAll();
      const myCourseIds = new Set(myCourses.map(c => c.id));
      const myEnrollments = allEnrollments.filter(e => myCourseIds.has(e.courseId));
      
      setCourses(myCourses);
      setEnrollments(myEnrollments);
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;
  
  // Aggregate stats
  const activeEnrollments = enrollments.filter(e => !e.completedAt).length;
  const completedEnrollments = enrollments.filter(e => e.completedAt).length;
  
  // Average rating across courses
  const avgRating = totalCourses > 0 
    ? courses.reduce((acc, c) => acc + (c.rating || 0), 0) / totalCourses
    : 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title={`Welcome back, ${currentUser?.name.split(' ')[0]}`}
      />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Total Courses" 
          value={totalCourses} 
          change={12} 
          trend="up" 
          icon={BookOpen} 
        />
        <KPICard 
          title="Total Enrollments" 
          value={totalEnrollments} 
          change={8} 
          trend="up" 
          icon={Users} 
        />
        <KPICard 
          title="Active Students" 
          value={activeEnrollments} 
          change={5} 
          trend="up" 
          icon={BarChart3} 
        />
        <KPICard 
          title="Average Rating" 
          value={avgRating} 
          change={0} 
          trend="neutral" 
          icon={Star} 
        />
      </div>

      <div className="flex flex-col gap-6 mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-heading font-bold text-[var(--on-surface)] flex items-center gap-2 tracking-tight">
            <span className="h-6 w-2 rounded-full bg-[var(--primary)]"></span>
            Your Courses
          </h3>
        </div>
        
        {courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--outline)] bg-[var(--surface-raised)] p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-4">
              <BookOpen className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-[var(--on-surface)] mb-2">No Courses Created</h3>
            <p className="text-sm text-[var(--on-surface-muted)] mb-6 max-w-sm mx-auto">
              You haven't created any courses yet. Share your expertise with the IMD network.
            </p>
            <button className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
              Create First Course
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <div key={course.id} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--primary)]/40 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="aspect-video w-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] relative overflow-hidden">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 mix-blend-overlay" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <BookOpen className="h-16 w-16 text-white/20" />
                    </div>
                  )}
                  <div className="absolute left-4 top-4 rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-md capitalize z-10 border border-white/20 shadow-lg flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {course.level}
                  </div>
                  <button className="absolute right-4 top-4 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex flex-col flex-1 p-6 z-10">
                  <h4 className="mb-2 font-heading text-lg font-bold line-clamp-1 text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">{course.title}</h4>
                  <p className="mb-6 text-sm font-medium text-[var(--on-surface-muted)] line-clamp-2 flex-1">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm font-semibold border-t border-[var(--outline)]/50 pt-5 mt-auto">
                    <div className="flex items-center gap-2 text-[var(--on-surface-muted)] bg-[var(--surface-raised)] px-3 py-1.5 rounded-lg">
                      <Users className="h-4 w-4 text-[var(--secondary)]" />
                      <span>{enrollments.filter(e => e.courseId === course.id).length} Enrolled</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--on-surface-muted)] bg-[var(--surface-raised)] px-3 py-1.5 rounded-lg">
                      <Star className="h-4 w-4 text-[var(--warning)]" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
