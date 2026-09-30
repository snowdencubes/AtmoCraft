"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { SkeletonCard } from "@/components/shared/skeleton";
import { BookOpen, Clock, Users, Star, Filter, Search } from "lucide-react";
import { Course } from "@/lib/types";
import { getCourses } from "@/lib/services";
import { cn } from "@/lib/utils";

export default function TraineeCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const data = await getCourses();
      setCourses(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Course Catalog" 
        subtitle="Explore and enroll in specialized IMD training modules."
        breadcrumbs={[{ label: "Dashboard", href: "/trainee/dashboard" }, { label: "Courses" }]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'nwp', 'radar', 'climate'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors focus-ring whitespace-nowrap",
                filter === f 
                  ? "bg-[var(--color-primary)] text-white" 
                  : "bg-[var(--color-surface-raised)] hover:bg-[var(--color-outline)]"
              )}
            >
              {f === 'all' ? 'All Subjects' : f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-on-surface-muted)]" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full rounded-lg border bg-[var(--color-surface-card)] py-2 pl-9 pr-4 text-sm outline-none focus-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          courses.map(course => (
            <div key={course.id} className="group flex flex-col overflow-hidden rounded-xl border bg-[var(--color-surface-card)] shadow-sm transition-all hover:shadow-md">
              <div className="relative h-40 w-full bg-[var(--color-primary)] p-4 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white/20" />
                <div className="absolute right-3 top-3 rounded bg-white/20 px-2 py-0.5 text-xs font-bold text-white backdrop-blur">
                  {course.level}
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-4">
                <span className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)]">{course.subject}</span>
                <h3 className="font-heading font-bold leading-tight line-clamp-2">{course.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-on-surface-muted)]">By {course.trainerName}</p>
                
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--color-on-surface-muted)]">
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</div>
                  <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.enrolled}</div>
                  <div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> {course.rating}</div>
                </div>
                
                <div className="mt-auto pt-4">
                  <button className="w-full rounded-lg bg-[var(--color-surface-raised)] py-2 text-sm font-semibold transition-colors hover:bg-[var(--color-primary)] hover:text-white focus-ring">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
