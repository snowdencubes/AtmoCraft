import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { logout } from "@/app/actions/auth";

export default function PendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-warning)]/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/60 dark:bg-gray-900/60 shadow-2xl backdrop-blur-xl animate-slide-up relative z-10 text-center p-8">
        <Logo className="mx-auto mb-6 h-20 w-20" />
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-warning)]/20 mb-6">
          <Clock className="h-8 w-8 text-[var(--color-warning)]" />
        </div>
        
        <h1 className="font-heading text-3xl font-bold mb-4">Account Pending</h1>
        
        <p className="text-[var(--color-on-surface-muted)] mb-8">
          Your account has been successfully created and is currently awaiting approval from an administrator. 
          You will be able to access the dashboard once your request is verified.
        </p>
        
        <form action={logout}>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-outline)] py-3 font-semibold transition-all hover:bg-[var(--color-surface-raised)]">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
