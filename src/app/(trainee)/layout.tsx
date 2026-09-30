import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { requireAuth } from "@/lib/auth-guard";

export default async function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(['trainee']);
  return <DashboardLayout requiredRole="trainee">{children}</DashboardLayout>;
}
