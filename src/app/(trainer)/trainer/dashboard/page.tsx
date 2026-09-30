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
    <div className="flex flex-col gap-6">
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

      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-xl font-heading font-semibold">Your Courses</h3>
        
        {courses.length === 0 ? (
          <div className="rounded-2xl border bg-[var(--color-surface-card)] p-8">
            <EmptyState 
              icon={<BookOpen className="h-16 w-16" />}
              title="No courses yet"
              description="You haven't created any courses. Go to Course Management to create one."
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <div key={course.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[var(--color-surface-card)] shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video w-full bg-[var(--color-surface-raised)] relative">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      <BookOpen className="h-10 w-10 opacity-50" />
                    </div>
                  )}
                  <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {course.level}
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 p-5">
                  <h4 className="mb-2 font-heading text-lg font-bold line-clamp-1">{course.title}</h4>
                  <p className="mb-4 text-sm text-[var(--color-on-surface-muted)] line-clamp-2 flex-1">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-[var(--color-on-surface-muted)]">
                      <Users className="h-4 w-4" />
                      <span>{enrollments.filter(e => e.courseId === course.id).length} enrolled</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--color-on-surface-muted)]">
                      <Star className="h-4 w-4 text-[var(--color-warning)]" />
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
