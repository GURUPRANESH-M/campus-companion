import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import api from "@/api/api";
import {
  Users,
  UserCheck,
  ClipboardCheck,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

export default function HODDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/hod/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold">
          HOD Dashboard
        </h1>

        <div className="dashboard-grid">
          <StatCard
            title="Students"
            value={stats.totalStudents}
            icon={<Users size={24} />}
          />
          <StatCard
            title="Faculty"
            value={stats.totalFaculty}
            icon={<UserCheck size={24} />}
          />
          <StatCard
            title="Avg Attendance"
            value={`${stats.avgAttendance}%`}
            icon={<ClipboardCheck size={24} />}
          />
          <StatCard
            title="Avg Marks"
            value={`${stats.avgMarks}%`}
            icon={<BarChart3 size={24} />}
          />
          <StatCard
            title="Pending Grievances"
            value={stats.pendingGrievances}
            icon={<AlertTriangle size={24} />}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
