import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { Users, BookOpen, GraduationCap, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  const { data: stats, error } = await supabase
    .from('admin_dashboard_stats')
    .select('*')
    .single();

  if (error) {
    console.error("Failed to load dashboard stats:", error);
  }

  const totalUsers = stats?.total_users || 0;
  const totalCourses = stats?.total_courses || 0;
  const totalEnrollments = stats?.total_enrollments || 0;
  const totalCertifications = stats?.total_certifications || 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Platform-wide KPIs and metrics overview."
      />
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Users"
          value={totalUsers}
          change={12}
          trend="up"
          icon={Users}
        />
        <KPICard
          title="Total Courses"
          value={totalCourses}
          change={5}
          trend="up"
          icon={BookOpen}
        />
        <KPICard
          title="Total Enrollments"
          value={totalEnrollments}
          change={2}
          trend="up"
          icon={GraduationCap}
        />
        <KPICard
          title="Certifications Issued"
          value={totalCertifications}
          change={4}
          trend="up"
          icon={Award}
        />
      </div>

      <div className="mt-8 rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm glass">
        <h3 className="mb-4 font-heading text-xl font-semibold">Recent Activity</h3>
        <p className="text-[var(--color-on-surface-muted)]">Detailed charts and activity logs can be placed here in future iterations.</p>
      </div>
    </div>
  );
}
