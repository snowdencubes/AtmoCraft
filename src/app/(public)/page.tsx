"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Presentation, Shield, ArrowRight, BookOpen, Award } from "lucide-react";
import { Announcement, CertificationRecord, Course } from "@/lib/types";
import { getAnnouncements, getCertifications, getCourses } from "@/lib/services";
import { SkeletonCard, SkeletonLine } from "@/components/shared/skeleton";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

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
    <>
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[var(--primary-dark)] pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pb-40">
          {/* Hero Banner Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-banner.jpg"
              alt="AtmoCraft Hero Banner"
              fill
              priority
              className="object-cover"
            />
            {/* Breathtaking left-to-right dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)]/95 via-[var(--surface)]/80 to-[var(--surface)]/20 dark:from-[#020617]/95 dark:via-[#020617]/80 dark:to-transparent" />
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl animate-slide-up">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1.5 text-sm font-semibold text-[var(--primary-dark)] dark:text-white shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-[var(--success)] animate-pulse"></span>
                Official Digital Capacity Building & LMS Portal
              </div>
              
              <h1 className="font-heading text-5xl font-extrabold tracking-tight text-[var(--on-surface)] sm:text-6xl lg:text-7xl text-balance">
                Empowering IMD Professionals through <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-sm">Digital Learning</span>
              </h1>
              
              <p className="mt-6 max-w-2xl text-lg text-[var(--on-surface-muted)] sm:text-xl font-medium text-balance">
                Master weather forecasting, radar meteorology, satellite data analytics, and climate research with our comprehensive capacity building platform.
              </p>
              
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(2,132,199,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  Start Learning <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--outline-strong)] bg-[var(--surface)]/50 px-8 py-4 text-base font-bold text-[var(--on-surface)] backdrop-blur-sm transition-colors hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  Sign In to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Glass Stats Bar */}
        <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
          <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 sm:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-slide-up" style={{ animationDelay: "150ms" }}>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-transparent md:divide-[var(--outline)]">
              <div className="text-center px-4 flex flex-col items-center">
                <div className="mb-2 rounded-full bg-[var(--primary)]/10 p-2.5 text-[var(--primary)]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <p className="font-heading text-3xl font-bold text-[var(--on-surface)] sm:text-4xl">12.5k+</p>
                <p className="mt-1 text-sm font-semibold text-[var(--on-surface-muted)]">Personnel Trained</p>
              </div>
              <div className="text-center px-4 flex flex-col items-center">
                <div className="mb-2 rounded-full bg-[var(--secondary)]/10 p-2.5 text-[var(--primary)] dark:text-[var(--primary-light)]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <p className="font-heading text-3xl font-bold text-[var(--on-surface)] sm:text-4xl">85+</p>
                <p className="mt-1 text-sm font-semibold text-[var(--on-surface-muted)]">Specialized Courses</p>
              </div>
              <div className="text-center px-4 flex flex-col items-center">
                <div className="mb-2 rounded-full bg-[var(--accent)]/10 p-2.5 text-[var(--accent)]">
                  <Award className="h-6 w-6" />
                </div>
                <p className="font-heading text-3xl font-bold text-[var(--on-surface)] sm:text-4xl">98.4%</p>
                <p className="mt-1 text-sm font-semibold text-[var(--on-surface-muted)]">Pass Rate</p>
              </div>
              <div className="text-center px-4 flex flex-col items-center">
                <div className="mb-2 rounded-full bg-[var(--success)]/10 p-2.5 text-[var(--success)]">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="font-heading text-3xl font-bold text-[var(--on-surface)] sm:text-4xl">iGOT</p>
                <p className="mt-1 text-sm font-semibold text-[var(--on-surface-muted)]">Karmayogi Synced</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works (Role Cards) */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--on-surface)] tracking-tight">Designed for Every Meteorological Role</h2>
            <p className="mt-4 text-lg text-[var(--on-surface-muted)]">Tailored learning journeys to meet your specific career goals within IMD.</p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[var(--primary)]/30">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[var(--on-surface)]">Trainee</h3>
              <p className="mt-4 text-[var(--on-surface-muted)] leading-relaxed font-medium">
                Enroll in specialized courses, take comprehensive MCQ assessments, participate in radar simulators, and earn verifiable digital certificates.
              </p>
            </div>
            
            <div className="group rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[var(--secondary)]/50">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--secondary)] text-[var(--secondary-foreground)] transition-transform group-hover:scale-110">
                <Presentation className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[var(--on-surface)]">Trainer</h3>
              <p className="mt-4 text-[var(--on-surface-muted)] leading-relaxed font-medium">
                Author engaging courses, upload diverse study materials to your library, craft interactive questionnaires, and monitor trainee performance.
              </p>
            </div>
            
            <div className="group rounded-3xl border border-[var(--outline)] bg-[var(--surface-card)] p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[var(--accent)]/50">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[var(--on-surface)]">Admin</h3>
              <p className="mt-4 text-[var(--on-surface-muted)] leading-relaxed font-medium">
                Manage user approvals and roles, oversee platform-wide analytics, publish critical circulars, and generate MoES capacity reports.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] py-24 sm:py-32">
          {/* Organic Wave Divider Top */}
          <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-full h-[60px] sm:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[var(--surface)]"></path>
            </svg>
          </div>
          
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 mt-12">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl text-balance">
              Ready to Advance Your Meteorological Career?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 font-medium text-balance">
              Join thousands of IMD professionals already upgrading their skills on AtmoCraft. Your journey towards meteorological excellence starts here.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-[var(--primary-dark)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
              >
                Create Your Account <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#020617] py-16 text-white border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <span className="font-heading text-xl font-bold tracking-tight">AtmoCraft</span>
              </div>
              <p className="mt-4 text-sm font-medium text-white/60 leading-relaxed max-w-sm">
                A digital learning and capacity building platform exclusively for the personnel of the India Meteorological Department.
              </p>
            </div>
            <div>
              <h4 className="font-bold tracking-wide uppercase text-xs text-white/80">Quick Links</h4>
              <ul className="mt-6 flex flex-col gap-3 text-sm font-medium text-white/60">
                <li><Link href="/login" className="hover:text-[var(--primary-light)] transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-[var(--primary-light)] transition-colors">Register</Link></li>
                <li><a href="#" className="hover:text-[var(--primary-light)] transition-colors">IMD Main Portal</a></li>
                <li><a href="#" className="hover:text-[var(--primary-light)] transition-colors">Ministry of Earth Sciences</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold tracking-wide uppercase text-xs text-white/80">Contact Support</h4>
              <ul className="mt-6 flex flex-col gap-3 text-sm font-medium text-white/60">
                <li>Helpdesk: support-cc@imd.gov.in</li>
                <li>Phone: 011-24611068</li>
                <li>Working Hours: 09:00 - 17:30 IST</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 text-sm font-medium text-white/40">
            <p>&copy; {new Date().getFullYear()} India Meteorological Department, MoES. All Rights Reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
