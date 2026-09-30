import { DashboardLayout } from "@/components/shared/dashboard-layout";

export default function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout requiredRole="trainee">{children}</DashboardLayout>;
}
