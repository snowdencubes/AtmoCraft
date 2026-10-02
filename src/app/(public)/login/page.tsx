'use client'

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/shared/toast";
import { Loader2, UserCircle, Lock } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const result = await login(formData);
    
    if (result?.error) {
      addToast({
        title: "Login failed",
        description: result.error,
        type: "error"
      });
      setIsLoading(false);
    }
    // Success will redirect automatically
  };

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      {/* Left Side - Image/Aesthetics (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-banner.jpg" alt="Atmospheric weather" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-dark)]/90 to-[var(--primary)]/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Logo className="h-16 w-16" />
          <div className="max-w-lg">
            <h2 className="font-heading text-4xl font-bold leading-tight">
              Advance your career in meteorology with India's premier digital learning platform.
            </h2>
            <p className="mt-4 text-lg font-medium text-white/80">
              Join thousands of IMD professionals already upgrading their skills on AtmoCraft.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-white/60">
            <span>&copy; {new Date().getFullYear()} Ministry of Earth Sciences</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex w-full items-center justify-center p-4 lg:w-1/2 relative overflow-hidden">
        {/* Subtle background glow on right side */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <Logo className="mx-auto mb-4 h-12 w-12 lg:hidden" />
            <h1 className="font-heading text-3xl font-extrabold text-[var(--on-surface)] tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-[var(--on-surface-muted)] font-medium">Sign in to access your dashboard</p>
          </div>

          <form action={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--on-surface)]">Email or Username</label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)]" />
                <input
                  type="text"
                  name="identifier"
                  className="w-full rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="name@imd.gov.in"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--on-surface)]">Password</label>
                <Link href="#" className="text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)]" />
                <input
                  type="password"
                  name="password"
                  className="w-full rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="mt-2 w-full text-base shadow-lg shadow-[var(--primary)]/20"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-[var(--on-surface-muted)]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
