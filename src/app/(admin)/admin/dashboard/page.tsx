import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { Users, BookOpen, GraduationCap, Activity } from "lucide-react";
import { usersRepo, coursesRepo, enrollmentsRepo } from "@/lib/db/repos";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const users = await usersRepo.findAll();
  const courses = await coursesRepo.findAll();
  const enrollments = await enrollmentsRepo.findAll();

  const activeUsers = users.filter(u => u.status === "active").length;
  const activeCourses = courses.length;
  const completedEnrollments = enrollments.filter(e => e.progress === 100).length;
  
  const completionRate = enrollments.length > 0 
    ? Math.round((completedEnrollments / enrollments.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Platform-wide KPIs and metrics overview."
      />
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Users"
          value={users.length}
          change={12}
          trend="up"
          icon={Users}
        />
        <KPICard
          title="Active Users"
          value={activeUsers}
          change={5}
          trend="up"
          icon={Activity}
        />
        <KPICard
          title="Active Courses"
          value={activeCourses}
          change={2}
          trend="up"
          icon={BookOpen}
        />
        <KPICard
          title="Avg. Completion Rate"
          value={completionRate}
          change={4}
          trend="up"
          icon={GraduationCap}
        />
      </div>

      <div className="mt-8 rounded-2xl border bg-[var(--color-surface-card)] p-6 shadow-sm glass">
        <h3 className="mb-4 font-heading text-xl font-semibold">Recent Activity</h3>
        <p className="text-[var(--color-on-surface-muted)]">Detailed charts and activity logs can be placed here in future iterations.</p>
      </div>
    </div>
  );
}
