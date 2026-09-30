import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { requireAuth } from "@/lib/auth-guard";

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(['trainer']);
  return <DashboardLayout requiredRole="trainer">{children}</DashboardLayout>;
}
