'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/shared/toast";
import { Loader2, Mail, Lock, User, Building, ShieldCheck, UserCircle, CheckCircle, XCircle } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-screen bg-[var(--surface)]">
      {/* Left Side - Image/Aesthetics (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 z-0">
          <img src="/images/course-cover-synoptic.jpg" alt="Atmospheric weather" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-dark)]/90 to-[var(--primary)]/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Logo className="h-16 w-16" />
          <div className="max-w-lg">
            <h2 className="font-heading text-4xl font-bold leading-tight">
              Begin your capacity building journey today.
            </h2>
            <p className="mt-4 text-lg font-medium text-white/80">
              Create an account to enroll in specialized courses, access meteorological resources, and track your progress.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-white/60">
            <span>&copy; {new Date().getFullYear()} Ministry of Earth Sciences</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex w-full items-center justify-center p-4 lg:w-1/2 relative overflow-hidden overflow-y-auto py-12">
        {/* Subtle background glow on right side */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-xl animate-fade-in relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <Logo className="mx-auto mb-4 h-12 w-12 lg:hidden" />
            <h1 className="font-heading text-3xl font-extrabold text-[var(--on-surface)] tracking-tight">Create Account</h1>
            <p className="mt-2 text-[var(--on-surface-muted)] font-medium">Join the AtmoCraft Network</p>
          </div>

          <form action={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-4 sm:flex-row flex-col">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-[var(--on-surface)]">First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)]" />
                  <input
                    type="text"
                    name="firstName"
                    className="w-full rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                    placeholder="First Name"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-[var(--on-surface)]">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)]" />
                  <input
                    type="text"
                    name="lastName"
                    className="w-full rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--on-surface)]">Username</label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)]" />
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                  className="w-full rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-11 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="e.g. forecaster_24"
                  required
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {usernameStatus === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />}
                  {usernameStatus === 'available' && <CheckCircle className="h-5 w-5 text-[var(--success)]" />}
                  {usernameStatus === 'taken' && <XCircle className="h-5 w-5 text-[var(--danger)]" />}
                  {usernameStatus === 'invalid' && <XCircle className="h-5 w-5 text-[var(--warning)]" />}
                </div>
              </div>
              {usernameStatus === 'invalid' && <span className="text-xs font-medium text-[var(--warning)]">3-20 lowercase letters, numbers, or underscores</span>}
              {usernameStatus === 'taken' && <span className="text-xs font-medium text-[var(--danger)]">Username is already taken</span>}
              {usernameStatus === 'available' && <span className="text-xs font-medium text-[var(--success)]">Username is available</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--on-surface)]">Official Email (IMD)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)]" />
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="name@imd.gov.in"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--on-surface)]">Department / Division</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)] pointer-events-none" />
                <select 
                  name="department"
                  className="w-full appearance-none rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
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

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-[var(--on-surface)]">Requested Role</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="group relative flex cursor-pointer flex-col rounded-xl border-2 border-[var(--outline)] bg-[var(--surface-card)] p-4 hover:bg-[var(--surface-raised)] has-[:checked]:border-[var(--primary)] has-[:checked]:bg-[var(--primary)]/5 transition-all outline-none focus-within:ring-4 focus-within:ring-[var(--primary)]/20">
                  <input type="radio" name="role" value="trainee" defaultChecked className="sr-only" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--outline)]/50 group-has-[:checked]:bg-[var(--primary)]/10 text-[var(--on-surface-muted)] group-has-[:checked]:text-[var(--primary)] transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--on-surface)]">Trainee</div>
                      <div className="text-xs font-medium text-[var(--on-surface-muted)]">Enroll in courses</div>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 h-4 w-4 rounded-full border-2 border-[var(--outline)] group-has-[:checked]:border-4 group-has-[:checked]:border-[var(--primary)] transition-all"></div>
                </label>
                
                <label className="group relative flex cursor-pointer flex-col rounded-xl border-2 border-[var(--outline)] bg-[var(--surface-card)] p-4 hover:bg-[var(--surface-raised)] has-[:checked]:border-[var(--secondary)] has-[:checked]:bg-[var(--secondary)]/5 transition-all outline-none focus-within:ring-4 focus-within:ring-[var(--secondary)]/20">
                  <input type="radio" name="role" value="trainer" className="sr-only" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--outline)]/50 group-has-[:checked]:bg-[var(--secondary)]/10 text-[var(--on-surface-muted)] group-has-[:checked]:text-[var(--secondary)] transition-colors">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--on-surface)]">Trainer</div>
                      <div className="text-xs font-medium text-[var(--on-surface-muted)]">Author content</div>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 h-4 w-4 rounded-full border-2 border-[var(--outline)] group-has-[:checked]:border-4 group-has-[:checked]:border-[var(--secondary)] transition-all"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-4 sm:flex-row flex-col">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-[var(--on-surface)]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)]" />
                  <input
                    type="password"
                    name="password"
                    minLength={8}
                    className="w-full rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                    placeholder="Min 8 chars"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-semibold text-[var(--on-surface)]">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--on-surface-muted)]" />
                  <input
                    type="password"
                    name="confirmPassword"
                    minLength={8}
                    className="w-full rounded-xl border border-[var(--outline)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-[var(--on-surface)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || usernameStatus === 'taken' || usernameStatus === 'invalid'}
              isLoading={isLoading}
              className="mt-2 w-full text-base shadow-lg shadow-[var(--primary)]/20"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-[var(--on-surface-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
