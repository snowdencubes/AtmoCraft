"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/shared/toast";
import { Loader2, Mail, Lock, User, Building } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    role: "trainee",
    password: ""
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { authService } = await import("@/lib/services/auth");
      await authService.signup(formData);
      
      addToast({
        title: "Registration successful",
        description: "Your account is pending admin approval.",
        type: "success"
      });
      router.push("/login");
    } catch (err: any) {
      addToast({
        title: "Registration failed",
        description: err.message || "An unexpected error occurred",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-[var(--color-surface-card)] shadow-xl animate-slide-up">
        <div className="bg-[var(--color-primary)] p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 font-bold backdrop-blur-sm">
            <span className="text-2xl text-[var(--color-secondary)]">CC</span>
          </div>
          <h1 className="font-heading text-2xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-white/80">Join AtmoCraft today</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-lg border bg-[var(--color-surface)] py-2.5 pl-10 pr-4 outline-none focus-ring"
                    placeholder="First Name"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-lg border bg-[var(--color-surface)] py-2.5 pl-10 pr-4 outline-none focus-ring"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Official Email (IMD)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border bg-[var(--color-surface)] py-2.5 pl-10 pr-4 outline-none focus-ring"
                  placeholder="name@imd.gov.in"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Department / Division</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <select 
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full appearance-none rounded-lg border bg-[var(--color-surface)] py-2.5 pl-10 pr-4 outline-none focus-ring"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="forecasting">Weather Forecasting</option>
                  <option value="radar">Radar Operations</option>
                  <option value="satellite">Satellite Meteorology</option>
                  <option value="climate">Climate Research</option>
                  <option value="agromet">Agromet Services</option>
                  <option value="aviation">Aviation Meteorology</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Requested Role</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-[var(--color-surface)] py-2.5 font-medium has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-light)]/10 has-[:checked]:text-[var(--color-primary)]">
                  <input 
                    type="radio" 
                    name="role" 
                    value="trainee"
                    checked={formData.role === "trainee"}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="sr-only" 
                  />
                  Trainee
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-[var(--color-surface)] py-2.5 font-medium has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-light)]/10 has-[:checked]:text-[var(--color-primary)]">
                  <input 
                    type="radio" 
                    name="role" 
                    value="trainer"
                    checked={formData.role === "trainer"}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="sr-only" 
                  />
                  Trainer
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Registration"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--color-on-surface-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline focus-ring rounded">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
