"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Presentation, Shield, ArrowRight, BookOpen, Award } from "lucide-react";
import { Announcement, CertificationRecord, Course } from "@/lib/types";
import { getAnnouncements, getCertifications, getCourses } from "@/lib/services";
import { SkeletonCard, SkeletonLine } from "@/components/shared/skeleton";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [certifications, setCertifications] = useState<CertificationRecord[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [annData, certData, courseData] = await Promise.all([
        getAnnouncements(),
        getCertifications(),
        getCourses(),
      ]);
      setAnnouncements(annData.slice(0, 4));
      setCertifications(certData.slice(0, 3));
      setCourses(courseData.slice(0, 3));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-surface)]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-primary-light)]/20 bg-[var(--color-primary)] text-white shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <div>
              <h1 className="font-heading text-xl font-bold leading-none tracking-tight">AtmoCraft</h1>
              <p className="text-[10px] font-medium text-white/70">Ministry of Earth Sciences</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm font-medium hover:text-[var(--color-secondary)] sm:block">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-light)] hover:shadow-lg focus-ring"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          {/* Subtle background pattern (SVG) */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative mx-auto max-w-4xl text-center animate-slide-up">
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
              Official Digital Capacity Building & LMS Portal
            </div>
            
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Empowering IMD Professionals through <span className="text-[var(--color-secondary)]">Digital Learning</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
              Master weather forecasting, radar meteorology, satellite data analytics, and climate research with our comprehensive capacity building platform.
            </p>
            
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--color-accent-light)] hover:shadow-[0_0_20px_rgba(232,148,58,0.4)] focus-ring"
              >
                Start Learning <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-ring"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="relative mx-auto mt-20 max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8 animate-fade-in">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <p className="font-heading text-3xl font-bold text-white sm:text-4xl">12,500+</p>
                <p className="mt-1 text-sm font-medium text-white/70">Personnel Trained</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-3xl font-bold text-[var(--color-secondary)] sm:text-4xl">85+</p>
                <p className="mt-1 text-sm font-medium text-white/70">Specialized Courses</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-3xl font-bold text-[var(--color-accent)] sm:text-4xl">98.4%</p>
                <p className="mt-1 text-sm font-medium text-white/70">Pass Rate</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-3xl font-bold text-white sm:text-4xl">iGOT</p>
                <p className="mt-1 text-sm font-medium text-white/70">Karmayogi Synced</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (Role Cards) */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-[var(--color-primary)]">Designed for Every Meteorological Role</h2>
            <p className="mt-4 text-[var(--color-on-surface-muted)]">Tailored learning journeys to meet your specific career goals within IMD.</p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border bg-[var(--color-surface-card)] p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Trainee</h3>
              <p className="mt-4 text-[var(--color-on-surface-muted)]">
                Enroll in specialized courses, take comprehensive MCQ assessments, participate in radar simulators, and earn verifiable digital certificates.
              </p>
            </div>
            
            <div className="group rounded-2xl border bg-[var(--color-surface-card)] p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] transition-colors group-hover:bg-[var(--color-secondary)] group-hover:text-white">
                <Presentation className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Trainer</h3>
              <p className="mt-4 text-[var(--color-on-surface-muted)]">
                Author engaging courses, upload diverse study materials to your library, craft interactive questionnaires, and monitor trainee performance.
              </p>
            </div>
            
            <div className="group rounded-2xl border bg-[var(--color-surface-card)] p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors group-hover:bg-[var(--color-accent)] group-hover:text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Admin</h3>
              <p className="mt-4 text-[var(--color-on-surface-muted)]">
                Manage user approvals and roles, oversee platform-wide analytics, publish critical circulars, and generate MoES capacity reports.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-[var(--color-surface-raised)] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Announcements */}
              <div>
                <h2 className="mb-6 flex items-center gap-2 font-heading text-2xl font-bold">
                  <span className="h-4 w-1 rounded-full bg-[var(--color-primary)]"></span> Latest Circulars
                </h2>
                <div className="flex flex-col gap-4">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => <SkeletonLine key={i} className="h-24 w-full" />)
                  ) : (
                    announcements.map((ann) => (
                      <div key={ann.id} className="rounded-xl border bg-[var(--color-surface-card)] p-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-semibold",
                            ann.type === 'notification' && "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
                            ann.type === 'announcement' && "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
                            ann.type === 'achievement' && "bg-[var(--color-success)]/10 text-[var(--color-success)]",
                            ann.type === 'new-content' && "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
                          )}>
                            {ann.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-[var(--color-on-surface-muted)]">
                            {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <h4 className="mt-3 font-semibold">{ann.title}</h4>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h2 className="mb-6 flex items-center gap-2 font-heading text-2xl font-bold">
                  <span className="h-4 w-1 rounded-full bg-[var(--color-accent)]"></span> Recent Certifications
                </h2>
                <div className="flex flex-col gap-4">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => <SkeletonLine key={i} className="h-20 w-full" />)
                  ) : (
                    certifications.map((cert) => (
                      <div key={cert.id} className="flex items-center gap-4 rounded-xl border bg-[var(--color-surface-card)] p-4 shadow-sm">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold">{cert.userName}</p>
                          <p className="text-sm text-[var(--color-on-surface-muted)]">Earned: {cert.courseName}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Courses */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-primary)]">Newly Added Content</h2>
              <p className="mt-2 text-[var(--color-on-surface-muted)]">Explore the latest training modules curated by IMD experts.</p>
            </div>
            <Link href="/courses" className="hidden text-sm font-semibold text-[var(--color-secondary)] hover:underline sm:block">
              View All Courses &rarr;
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              courses.map((course) => (
                <div key={course.id} className="group flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-surface-card)] shadow-sm transition-all hover:shadow-xl">
                  <div className="relative h-48 w-full bg-[var(--color-primary-light)]/20 p-6">
                    <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[var(--color-primary)] backdrop-blur">
                      {course.level}
                    </div>
                    <BookOpen className="h-12 w-12 text-[var(--color-primary)]/40" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)]">{course.subject}</div>
                    <h3 className="font-heading text-xl font-bold line-clamp-2">{course.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-on-surface-muted)]">By {course.trainerName}</p>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--color-outline)]">
                      <span className="text-sm font-medium text-[var(--color-on-surface-muted)]">{course.duration}</span>
                      <Link href={`/login`} className="text-sm font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-light)]">
                        Explore &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="bg-[var(--color-primary-dark)] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <span className="font-heading text-lg font-bold">AtmoCraft</span>
              </div>
              <p className="mt-4 text-sm text-white/70">
                A digital learning and capacity building platform exclusively for the personnel of the India Meteorological Department.
              </p>
            </div>
            <div className="md:justify-self-center">
              <h4 className="font-bold">Quick Links</h4>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-white/70">
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-white">Register</Link></li>
                <li><a href="#" className="hover:text-white">IMD Main Portal</a></li>
                <li><a href="#" className="hover:text-white">Ministry of Earth Sciences</a></li>
              </ul>
            </div>
            <div className="md:justify-self-end">
              <h4 className="font-bold">Contact Support</h4>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-white/70">
                <li>Helpdesk: support-cc@imd.gov.in</li>
                <li>Phone: 011-24611068</li>
                <li>Working Hours: 09:00 - 17:30 IST</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} India Meteorological Department, Ministry of Earth Sciences, Government of India. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
