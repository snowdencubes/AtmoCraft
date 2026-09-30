import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { requireAuth } from "@/lib/auth-guard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(['admin']);
  return <DashboardLayout requiredRole="admin">{children}</DashboardLayout>;
}
