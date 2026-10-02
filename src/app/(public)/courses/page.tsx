"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SkeletonCard } from "@/components/shared/skeleton";
import { BookOpen, Clock, Users, Star, Filter, Search } from "lucide-react";
import { Course } from "@/lib/types";
import { courseService } from "@/lib/services/courseService";
import { cn } from "@/lib/utils";

export default function PublicCoursesPage() {
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
    <main className="min-h-screen bg-[var(--background)] pt-24 pb-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Page Header */}
        <section className="space-y-4 text-center sm:text-left mt-4 mb-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-[var(--on-surface)]">
            Course Catalog
          </h1>
          <p className="text-lg text-[var(--on-surface-muted)] max-w-2xl font-medium sm:mx-0 mx-auto">
            Explore and discover specialized IMD training modules. Sign in to enroll and track your progress.
          </p>
        </section>

        <div className="flex flex-col gap-5">
          {/* Top Controls: Search & Main Subject Pills */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[var(--surface-card)] p-4 rounded-3xl border border-[var(--outline)] shadow-sm">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar flex-1">
              {uniqueSubjects.slice(0, 5).map(f => (
                <button 
                  key={f}
                  onClick={() => setSubjectFilter(f)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-bold capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] whitespace-nowrap",
                    subjectFilter === f 
                      ? "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-md shadow-[var(--primary)]/20" 
                      : "bg-[var(--surface-raised)] hover:bg-[var(--outline)]/50 text-[var(--on-surface-muted)] hover:text-[var(--on-surface)]"
                  )}
                >
                  {f === 'all' ? 'All Subjects' : f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-80 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--on-surface-muted)]" />
              <input 
                type="text" 
                placeholder="Search courses, skills, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[var(--outline)] bg-[var(--surface)] py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 text-[var(--on-surface)] placeholder:text-[var(--on-surface-muted)]/70"
              />
            </div>
          </div>

          {/* Secondary Filters: Level & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center px-4 py-3 bg-[var(--surface-card)] rounded-2xl border border-[var(--outline)]/50">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[var(--on-surface-muted)]" />
              <span className="text-sm font-bold text-[var(--on-surface-muted)] uppercase tracking-wider">Refine</span>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full sm:w-auto items-center">
              <select 
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="appearance-none bg-[var(--surface-raised)] border border-[var(--outline)]/50 rounded-xl font-medium text-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--on-surface)] transition-all cursor-pointer hover:border-[var(--primary)]/50"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1em' }}
              >
                <option value="all">All Levels</option>
                {uniqueLevels.filter(l => l !== 'all').map(l => (
                  <option key={l} value={l} className="capitalize">{l}</option>
                ))}
              </select>

              <div className="flex-1 sm:hidden"></div>

              <div className="flex items-center gap-3 ml-auto sm:ml-6">
                <span className="text-sm font-bold text-[var(--on-surface-muted)] uppercase tracking-wider whitespace-nowrap">Sort</span>
                <select 
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="appearance-none bg-[var(--surface-raised)] border border-[var(--outline)]/50 rounded-xl font-medium text-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--on-surface)] transition-all cursor-pointer hover:border-[var(--primary)]/50"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem center', backgroundSize: '1em' }}
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredAndSortedCourses.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--surface-card)] border border-[var(--outline)] mb-4">
                <Search className="h-12 w-12 text-[var(--on-surface-muted)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--on-surface)] mb-2">No courses found</h3>
              <p className="text-[var(--on-surface-muted)] text-lg">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSubjectFilter('all'); setLevelFilter('all'); }}
                className="mt-6 rounded-xl bg-[var(--primary)] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredAndSortedCourses.map(course => (
              <div key={course.id} className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--primary)]/40 hover:-translate-y-2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative h-56 w-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-4 flex items-center justify-center overflow-hidden">
                  {course.imageUrl ? (
                    <Image 
                      src={course.imageUrl} 
                      alt={course.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 mix-blend-overlay"
                    />
                  ) : (
                    <BookOpen className="h-20 w-20 text-white/20 z-10 relative transition-transform duration-500 group-hover:scale-110 group-hover:text-white/40" />
                  )}
                  <div className="absolute left-4 top-4 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md capitalize z-10 border border-white/20 shadow-lg flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {course.level}
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col p-6 z-10">
                  <span className="mb-2 text-xs font-extrabold uppercase tracking-widest text-[var(--secondary)]">{course.subject}</span>
                  <h3 className="font-heading text-xl font-bold leading-tight line-clamp-2 text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">{course.title}</h3>
                  <p className="mt-3 text-sm font-medium text-[var(--on-surface-muted)]">By {course.trainerName}</p>
                  
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--on-surface-muted)]">
                    <div className="flex items-center gap-1.5 bg-[var(--surface-raised)] px-2.5 py-1.5 rounded-md"><Clock className="h-4 w-4 text-[var(--primary)]" /> {course.duration}</div>
                    <div className="flex items-center gap-1.5 bg-[var(--surface-raised)] px-2.5 py-1.5 rounded-md"><Users className="h-4 w-4 text-[var(--secondary)]" /> {course.enrolled}</div>
                    <div className="flex items-center gap-1.5 bg-[var(--surface-raised)] px-2.5 py-1.5 rounded-md"><Star className="h-4 w-4 text-[var(--warning)]" /> {course.rating.toFixed(1)}</div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-[var(--outline)]/50">
                    <Link href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--surface-raised)] py-3.5 text-sm font-bold transition-all hover:bg-[var(--primary)] hover:text-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] text-[var(--on-surface)] group/btn">
                      Sign in to Enroll
                      <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
