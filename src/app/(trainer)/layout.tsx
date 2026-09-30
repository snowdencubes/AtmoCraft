import { DashboardLayout } from "@/components/shared/dashboard-layout";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout requiredRole="trainer">{children}</DashboardLayout>;
}
