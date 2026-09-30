'use client'

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/shared/toast";
import { Loader2, UserCircle, Lock } from "lucide-react";
import { Logo } from "@/components/shared/logo";
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
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-secondary)]/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/60 dark:bg-gray-900/60 shadow-2xl backdrop-blur-xl animate-slide-up relative z-10">
        <div className="bg-[var(--color-primary)]/90 p-8 text-center text-white backdrop-blur-md border-b border-white/10">
          <Logo className="mx-auto mb-4 h-16 w-16" />
          <h1 className="font-heading text-2xl font-bold tracking-tight">AtmoCraft</h1>
          <p className="mt-2 text-sm text-white/80 font-medium">Sign in to your account</p>
        </div>

        <div className="p-8">
          <form action={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email or Username</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="text"
                  name="identifier"
                  className="w-full rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-4 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
                  placeholder="Email or Username"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-xs font-semibold text-[var(--color-primary)] hover:underline dark:text-[var(--color-secondary)]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="password"
                  name="password"
                  className="w-full rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-4 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-3 font-semibold text-white transition-all hover:bg-[var(--color-accent-light)] hover:shadow-lg disabled:opacity-70 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-on-surface-muted)]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-[var(--color-primary)] hover:underline dark:text-[var(--color-secondary)]">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
