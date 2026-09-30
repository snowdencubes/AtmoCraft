'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/shared/toast";
import { Loader2, Mail, Lock, User, Building, ShieldCheck, UserCircle, CheckCircle, XCircle } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { signup, checkUsername } from "@/app/actions/auth";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  
  const [username, setUsername] = useState("");
  const debouncedUsername = useDebounce(username, 500);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');

  useEffect(() => {
    if (!debouncedUsername) {
      setUsernameStatus('idle');
      return;
    }
    
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(debouncedUsername)) {
      setUsernameStatus('invalid');
      return;
    }
    
    let isMounted = true;
    setUsernameStatus('checking');
    
    checkUsername(debouncedUsername).then(isTaken => {
      if (isMounted) {
        setUsernameStatus(isTaken ? 'taken' : 'available');
      }
    });
    
    return () => { isMounted = false; };
  }, [debouncedUsername]);

  const handleSubmit = async (formData: FormData) => {
    if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
      addToast({ title: "Invalid username", description: "Please fix your username", type: "error" });
      return;
    }
    
    setIsLoading(true);
    const result = await signup(formData);
    
    if (result?.error) {
      addToast({
        title: "Registration failed",
        description: result.error,
        type: "error"
      });
      setIsLoading(false);
    }
    // If successful, the action will redirect, so we don't need to setIsLoading(false)
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4 py-12 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-secondary)]/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/60 dark:bg-gray-900/60 shadow-2xl backdrop-blur-xl animate-slide-up relative z-10">
        <div className="bg-[var(--color-primary)]/90 p-8 text-center text-white backdrop-blur-md border-b border-white/10">
          <Logo className="mx-auto mb-4 h-16 w-16" />
          <h1 className="font-heading text-2xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-white/80 font-medium">Join the AtmoCraft Network</p>
        </div>

        <div className="p-8">
          <form action={handleSubmit} className="flex flex-col gap-5">
            <div className="flex gap-4 sm:flex-row flex-col">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                  <input
                    type="text"
                    name="firstName"
                    className="w-full rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-4 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
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
                    name="lastName"
                    className="w-full rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-4 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Username</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  className="w-full rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-10 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
                  placeholder="e.g. forecaster_24"
                  required
                />
                <div className="absolute right-3 top-3">
                  {usernameStatus === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-[var(--color-secondary)]" />}
                  {usernameStatus === 'available' && <CheckCircle className="h-5 w-5 text-[var(--color-success)]" />}
                  {usernameStatus === 'taken' && <XCircle className="h-5 w-5 text-[var(--color-danger)]" />}
                  {usernameStatus === 'invalid' && <XCircle className="h-5 w-5 text-[var(--color-warning)]" />}
                </div>
              </div>
              {usernameStatus === 'invalid' && <span className="text-xs text-[var(--color-warning)]">3-20 lowercase letters, numbers, or underscores</span>}
              {usernameStatus === 'taken' && <span className="text-xs text-[var(--color-danger)]">Username is already taken</span>}
              {usernameStatus === 'available' && <span className="text-xs text-[var(--color-success)]">Username is available</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Official Email (IMD)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-4 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
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
                  name="department"
                  className="w-full appearance-none rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-4 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
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
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 font-medium has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10 has-[:checked]:text-[var(--color-primary)] dark:has-[:checked]:text-[var(--color-secondary)] transition-all">
                  <input type="radio" name="role" value="trainee" defaultChecked className="sr-only" />
                  Trainee
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 font-medium has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10 has-[:checked]:text-[var(--color-primary)] dark:has-[:checked]:text-[var(--color-secondary)] transition-all">
                  <input type="radio" name="role" value="trainer" className="sr-only" />
                  Trainer
                </label>
              </div>
            </div>

            <div className="flex gap-4 sm:flex-row flex-col">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                  <input
                    type="password"
                    name="password"
                    minLength={8}
                    className="w-full rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-4 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
                    placeholder="Min 8 chars"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-[var(--color-on-surface-muted)]" />
                  <input
                    type="password"
                    name="confirmPassword"
                    minLength={8}
                    className="w-full rounded-xl border border-[var(--color-outline)] bg-white/50 dark:bg-black/20 py-2.5 pl-10 pr-4 outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all backdrop-blur-sm"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || usernameStatus === 'taken' || usernameStatus === 'invalid'}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-3 font-semibold text-white transition-all hover:bg-[var(--color-accent-light)] hover:shadow-lg disabled:opacity-70 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-on-surface-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:underline dark:text-[var(--color-secondary)]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
