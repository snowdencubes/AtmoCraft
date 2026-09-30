"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/components/shared/toast";
import { Loader2, Mail, Lock } from "lucide-react";
import { mockUsers } from "@/lib/mock";
import { Logo } from "@/components/shared/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { authService } = await import("@/lib/services/auth");
      const user = await authService.login(email, password);
      
      setAuth(user);
      
      addToast({
        title: "Login successful",
        description: "Welcome back to AtmoCraft",
        type: "success"
      });
      
      router.push(`/${user.role}/dashboard`);
    } catch (err: any) {
      addToast({
        title: "Login failed",
        description: err.message || "Invalid credentials or pending approval",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-[var(--color-surface-card)] shadow-xl animate-slide-up">
        <div className="bg-[var(--color-primary)] p-8 text-center text-white">
          <Logo className="mx-auto mb-4 h-16 w-16" />
          <h1 className="font-heading text-2xl font-bold">AtmoCraft</h1>
          <p className="mt-2 text-sm text-white/80">Sign in to your account</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border bg-[var(--color-surface)] py-2.5 pl-10 pr-4 outline-none focus-ring"
                  placeholder="name@imd.gov.in"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs font-semibold text-[var(--color-primary)] hover:underline focus-ring rounded">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border bg-[var(--color-surface)] py-2.5 pl-10 pr-4 outline-none focus-ring"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-[var(--color-primary)] py-3 font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)] focus-ring disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--color-on-surface-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[var(--color-primary)] hover:underline focus-ring rounded">
              Register here
            </Link>
          </div>

          <div className="mt-8 rounded-lg border border-dashed border-[var(--color-outline-strong)] bg-[var(--color-surface-raised)] p-4 text-xs">
            <p className="mb-2 font-bold text-[var(--color-on-surface)]">Demo Accounts:</p>
            <ul className="flex flex-col gap-1 text-[var(--color-on-surface-muted)]">
              <li><span className="font-medium text-black dark:text-white">Admin:</span> vikram.mehta@imd.gov.in</li>
              <li><span className="font-medium text-black dark:text-white">Trainer:</span> rajesh.kumar@imd.gov.in</li>
              <li><span className="font-medium text-black dark:text-white">Trainee:</span> priya.sharma@imd.gov.in</li>
              <li>(Password can be anything)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
