import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DepartmentChart } from '@/components/charts/DepartmentChart';
import { NoticeCard } from '@/components/dashboard/NoticeCard';
import { Users, GraduationCap, Building2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '@/api/api';

interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  overallAttendance: number;
  overallPerformance: number;
  grievances: {
    total: number;
    escalated: number;
    resolved: number;
  };
  noticesTotal: number;
  recentNotices: any[];
}

interface DepartmentStat {
  department: string;
  totalStudents: number;
  totalFaculty: number;
  avgAttendance: number;
  avgPerformance: number;
}

export default function PrincipalDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [departments, setDepartments] = useState<DepartmentStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashRes, deptRes] = await Promise.all([
          api.get('/principal/dashboard'),
          api.get('/principal/departments')
        ]);

        setStats(dashRes.data);
        setDepartments(deptRes.data);
      } catch (error) {
        console.error("Error fetching principal dashboard data from API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center min-h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-serif text-2xl font-bold mb-2">
            Institute Dashboard
          </h1>
          <p className="text-primary-foreground/80">
            Overview of all departments and institutional metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <StatCard
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            subtitle="Across all departments"
            icon={<GraduationCap size={24} />}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Total Faculty"
            value={stats.totalFaculty}
            subtitle="Teaching staff"
            icon={<Users size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />
          <StatCard
            title="Departments"
            value={departments.length}
            subtitle="Active departments"
            icon={<Building2 size={24} />}
            iconClassName="bg-success/10 text-success"
          />
          <StatCard
            title="Escalated Grievances"
            value={stats.grievances.escalated}
            subtitle={`${stats.grievances.total} total submitted`}
            icon={<AlertTriangle size={24} />}
            iconClassName="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Charts */}
        {departments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepartmentChart data={departments} type="students" />
            <DepartmentChart data={departments} type="performance" />
          </div>
        )}

        {/* Department Performance Table */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Department Statistics</h3>

          {departments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No active departments to display</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Students</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Faculty</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Attendance</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.department} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium text-foreground">{dept.department}</td>
                      <td className="py-3 px-4 text-center text-foreground">{dept.totalStudents}</td>
                      <td className="py-3 px-4 text-center text-foreground">{dept.totalFaculty}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={dept.avgAttendance >= 85 ? 'text-success' : 'text-warning'}>
                          {dept.avgAttendance}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={dept.avgPerformance >= 75 ? 'text-success' : 'text-warning'}>
                          {dept.avgPerformance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div>
          <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Recent Announcements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.recentNotices && stats.recentNotices.length > 0 ? (
              stats.recentNotices.map((notice) => (
                <NoticeCard key={notice._id || notice.id} notice={notice} />
              ))
            ) : (
              <p className="text-muted-foreground bg-card py-4 text-center border rounded-lg col-span-full">No recent announcements found.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
