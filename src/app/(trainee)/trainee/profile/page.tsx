"use client";

import { PageHeader } from "@/components/shared/page-header";
import { UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function TraineeProfile() {
  const { currentUser } = useAuthStore();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="My Profile" 
        breadcrumbs={[{ label: "Dashboard", href: "/trainee/dashboard" }, { label: "Profile" }]}
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-3xl font-bold text-white">
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
        
        <div className="col-span-1 lg:col-span-2 rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm">
          <h3 className="mb-6 font-heading text-lg font-bold">Digital Capacity Passport</h3>
          
          <div className="rounded-xl border border-dashed p-8 text-center text-[var(--color-on-surface-muted)]">
            Detailed profile information, skills matrix, and competencies will be displayed here.
          </div>
        </div>
      </div>
    </div>
  );
}
