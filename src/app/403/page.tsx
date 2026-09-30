import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] p-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-danger)]/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-danger)]/20 bg-white/60 dark:bg-gray-900/60 shadow-2xl backdrop-blur-xl animate-slide-up relative z-10 text-center p-8">
        <Logo className="mx-auto mb-6 h-16 w-16" />
        
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-danger)]/20 mb-6 border-4 border-[var(--color-danger)]/30">
          <ShieldAlert className="h-12 w-12 text-[var(--color-danger)]" />
        </div>
        
        <h1 className="font-heading text-4xl font-black mb-2 text-[var(--color-on-surface)]">403</h1>
        <h2 className="font-heading text-xl font-bold mb-4 text-[var(--color-on-surface)]">Access Denied</h2>
        
        <p className="text-[var(--color-on-surface-muted)] mb-8 font-medium">
          You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
        </p>
        
        <Link href="/" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 font-semibold text-white transition-all hover:bg-[var(--color-primary-light)] hover:shadow-lg">
          <ArrowLeft className="h-4 w-4" />
          Return to Safety
        </Link>
      </div>
    </div>
  );
}
