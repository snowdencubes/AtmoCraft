"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header 
        className={`fixed left-0 right-0 top-0 z-50 flex justify-center px-4 transition-all duration-300 ${
          scrolled ? "pt-2 sm:pt-4" : "pt-4 sm:pt-6"
        }`}
      >
        <div 
          className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-[var(--glass-border)] px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] motion-reduce:backdrop-blur-none motion-reduce:bg-[var(--surface-card)] ${
            scrolled ? "bg-[var(--glass-bg)] backdrop-blur-xl" : "bg-[var(--glass-bg)]/60 backdrop-blur-md"
          }`}
        >
          {/* Logo Area */}
          <Link href="/" className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 notranslate translate='no'">
            <Logo className="h-10 w-10 sm:h-14 sm:w-14 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col justify-center">
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent flex items-center gap-1">
                AtmoCraft
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-slow"></span>
              </h1>
              <p className="hidden text-[11px] sm:text-xs font-semibold text-[var(--on-surface-muted)] sm:block tracking-wide whitespace-nowrap">
                Ministry of Earth Sciences
              </p>
              <p className="sm:hidden text-[10px] font-bold text-[var(--on-surface-muted)] tracking-wider">
                MoES
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 mx-4 flex-wrap">
            <Link href="/" className="px-3 py-2 text-sm font-semibold text-[var(--on-surface)] hover:text-[var(--primary)] rounded-lg hover:bg-[var(--surface-raised)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Home
            </Link>
            <Link href="/courses" className="px-3 py-2 text-sm font-semibold text-[var(--on-surface)] hover:text-[var(--primary)] rounded-lg hover:bg-[var(--surface-raised)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Courses
            </Link>
            <Link href="/resources" className="px-3 py-2 text-sm font-semibold text-[var(--on-surface)] hover:text-[var(--primary)] rounded-lg hover:bg-[var(--surface-raised)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Resources
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 flex-wrap">
            <LanguageSwitcher />
            <Button variant="ghost" asChild className="hidden lg:inline-flex">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="primary" asChild className="rounded-full shadow-lg shadow-[var(--primary-light)]/20">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden flex-wrap">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md text-[var(--on-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Glass Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-4 top-4 left-4 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-2xl backdrop-blur-2xl bg-white/90 dark:bg-black/90 animate-slide-up flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-bold">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-2 bg-[var(--surface-raised)] text-[var(--on-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link href="/" className="rounded-xl p-3 text-base font-semibold text-[var(--on-surface)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Home
              </Link>
              <Link href="/courses" className="rounded-xl p-3 text-base font-semibold text-[var(--on-surface)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Courses
              </Link>
              <Link href="/resources" className="rounded-xl p-3 text-base font-semibold text-[var(--on-surface)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Resources
              </Link>
            </nav>
            
            <div className="flex flex-col gap-3 mt-4 border-t border-[var(--outline)] pt-6">
              <Button variant="outline" asChild className="w-full justify-center min-h-[48px]">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="primary" asChild className="w-full justify-center min-h-[48px]">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
