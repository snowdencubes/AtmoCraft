"use client";

import { PageHeader } from "@/components/shared/page-header";

import { useAuthStore } from "@/store/auth-store";
import { ProfileForm } from "./components/profile-form";
import { useState } from "react";

export default function TraineeProfile() {
  const { currentUser } = useAuthStore();
  const [completionPercent, setCompletionPercent] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="My Profile" 
        breadcrumbs={[{ label: "Dashboard", href: "/trainee/dashboard" }, { label: "Profile" }]}
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center bg-[var(--color-primary-light)] text-3xl font-bold text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)] hover:scale-105 transition-transform duration-300">
                {currentUser?.name.charAt(0) || "U"}
              </div>
              <h2 className="font-heading text-xl font-bold">{currentUser?.name}</h2>
              <p className="text-sm text-[var(--color-on-surface-muted)] capitalize">{currentUser?.role}</p>
              
              <div className="mt-6 w-full rounded-lg bg-[var(--color-surface-raised)] p-4 text-left">
                <div className="text-xs font-semibold uppercase text-[var(--color-on-surface-muted)]">Department</div>
                <div className="mt-1 font-medium">{currentUser?.department}</div>
                
                <div className="mt-4 text-xs font-semibold uppercase text-[var(--color-on-surface-muted)]">Email</div>
                <div className="mt-1 font-medium">{currentUser?.email}</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
            <h3 className="mb-4 font-heading text-lg font-bold">Profile Completion</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{completionPercent}% Complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div 
                className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-in-out" 
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="mt-4 text-xs text-[var(--color-on-surface-muted)]">
              Complete your profile to unlock full features and personalized recommendations.
            </p>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-2 rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
          <h3 className="mb-6 font-heading text-xl font-bold">Digital Capacity Passport</h3>
          <ProfileForm onProgressUpdate={setCompletionPercent} />
        </div>
      </div>
    </div>
  );
}
