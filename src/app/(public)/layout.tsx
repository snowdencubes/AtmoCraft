import { PublicHeader } from "@/components/shared/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] selection:bg-[var(--primary)]/30 scroll-pt-24 lg:scroll-pt-32">
      <PublicHeader />
      <div className="pt-24 lg:pt-32">
        {children}
      </div>
    </div>
  );
}
