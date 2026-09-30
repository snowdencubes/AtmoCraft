"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { SkeletonCard } from "@/components/shared/skeleton";
import { BookOpen, Clock, Users, Star, Filter, Search, ChevronDown } from "lucide-react";
import { Course } from "@/lib/types";
import { courseService } from "@/lib/services/courseService";
import { cn } from "@/lib/utils";

export default function TraineeCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"title" | "rating" | "enrolled">("title");

  useEffect(() => {
    async function load() {
      try {
        const data = await courseService.getCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    let result = courses;

    // Search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        c.trainerName.toLowerCase().includes(q)
      );
    }

    // Subject Filter
    if (subjectFilter !== "all") {
      result = result.filter(c => c.subject.toLowerCase() === subjectFilter.toLowerCase());
    }

    // Level Filter
    if (levelFilter !== "all") {
      result = result.filter(c => c.level.toLowerCase() === levelFilter.toLowerCase());
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "enrolled") return (b.enrolled || 0) - (a.enrolled || 0);
      return 0;
    });

    return result;
  }, [courses, searchQuery, subjectFilter, levelFilter, sortBy]);

  const uniqueSubjects = useMemo(() => ["all", ...Array.from(new Set(courses.map(c => c.subject.toLowerCase())))], [courses]);
  const uniqueLevels = useMemo(() => ["all", ...Array.from(new Set(courses.map(c => c.level.toLowerCase())))], [courses]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Course Catalog" 
        subtitle="Explore and enroll in specialized IMD training modules."
        breadcrumbs={[{ label: "Dashboard", href: "/trainee/dashboard" }, { label: "Courses" }]}
      />

      <div className="flex flex-col gap-4">
        {/* Top Controls: Search & Main Subject Pills */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {uniqueSubjects.slice(0, 5).map(f => (
              <button 
                key={f}
                onClick={() => setSubjectFilter(f)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors focus-ring whitespace-nowrap",
                  subjectFilter === f 
                    ? "bg-[var(--color-primary)] text-white" 
                    : "bg-[var(--color-surface-raised)] hover:bg-[var(--color-outline)] text-[var(--color-on-surface)]"
                )}
              >
                {f === 'all' ? 'All Subjects' : f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-on-surface-muted)]" />
            <input 
              type="text" 
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-[var(--color-surface-card)] py-2 pl-9 pr-4 text-sm outline-none focus-ring text-[var(--color-on-surface)]"
            />
          </div>
        </div>

        {/* Secondary Filters: Level & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3 bg-[var(--color-surface-raised)] rounded-lg border">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[var(--color-on-surface-muted)]" />
            <span className="text-sm font-medium text-[var(--color-on-surface)]">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-[var(--color-surface-card)] border rounded-md text-sm px-3 py-1.5 focus-ring text-[var(--color-on-surface)]"
            >
              <option value="all">All Levels</option>
              {uniqueLevels.filter(l => l !== 'all').map(l => (
                <option key={l} value={l} className="capitalize">{l}</option>
              ))}
            </select>

            <div className="flex-1 sm:hidden"></div>

            <div className="flex items-center gap-2 ml-auto sm:ml-4">
              <span className="text-sm font-medium text-[var(--color-on-surface)] whitespace-nowrap">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[var(--color-surface-card)] border rounded-md text-sm px-3 py-1.5 focus-ring text-[var(--color-on-surface)]"
              >
                <option value="title">A-Z</option>
                <option value="rating">Top Rated</option>
                <option value="enrolled">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredAndSortedCourses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--color-on-surface-muted)]">
            <p>No courses found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSubjectFilter('all'); setLevelFilter('all'); }}
              className="mt-4 text-[var(--color-primary)] hover:underline text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredAndSortedCourses.map(course => (
            <div key={course.id} className="group flex flex-col overflow-hidden rounded-xl border bg-[var(--color-surface-card)] shadow-sm transition-all hover:shadow-md">
              <div className="relative h-40 w-full bg-[var(--color-primary)] p-4 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white/20" />
                <div className="absolute right-3 top-3 rounded bg-white/20 px-2 py-0.5 text-xs font-bold text-white backdrop-blur capitalize">
                  {course.level}
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-4">
                <span className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)]">{course.subject}</span>
                <h3 className="font-heading font-bold leading-tight line-clamp-2 text-[var(--color-on-surface)]">{course.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-on-surface-muted)]">By {course.trainerName}</p>
                
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--color-on-surface-muted)]">
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</div>
                  <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.enrolled}</div>
                  <div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> {course.rating}</div>
                </div>
                
                <div className="mt-auto pt-4">
                  <Link href={`/trainee/courses/${course.id}`} className="block w-full rounded-lg bg-[var(--color-surface-raised)] py-2 text-sm font-semibold text-center transition-colors hover:bg-[var(--color-primary)] hover:text-white focus-ring text-[var(--color-on-surface)]">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
