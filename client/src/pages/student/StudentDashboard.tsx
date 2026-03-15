import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Calendar, BookOpen } from "lucide-react";
import { mockAttendance } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();

  /* ---------- CALCULATE ATTENDANCE ---------- */
  const avgAttendance =
    mockAttendance.length > 0
      ? Math.round(
          mockAttendance.reduce(
            (acc, curr) => acc + curr.percentage,
            0
          ) / mockAttendance.length
        )
      : 0;

  const totalSubjects = mockAttendance.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-serif text-2xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>

          <p className="text-primary-foreground/80">
            Track your academic attendance overview.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="dashboard-grid">

          {/* Attendance */}
          <StatCard
            title="Overall Attendance"
            value={`${avgAttendance}%`}
            subtitle="Across all subjects"
            icon={<Calendar size={24} />}
            iconClassName="bg-primary/10 text-primary"
          />

          {/* Subjects */}
          <StatCard
            title="Total Subjects"
            value={totalSubjects}
            subtitle="Current semester"
            icon={<BookOpen size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />

        </div>

      </div>
    </DashboardLayout>
  );
}