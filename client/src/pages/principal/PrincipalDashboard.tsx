import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DepartmentChart } from '@/components/charts/DepartmentChart';
import { NoticeCard } from '@/components/dashboard/NoticeCard';
import { mockDepartmentStats, mockNotices, mockGrievances } from '@/data/mockData';
import { Users, GraduationCap, Building2, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function PrincipalDashboard() {
  const totalStudents = mockDepartmentStats.reduce((acc, curr) => acc + curr.totalStudents, 0);
  const totalFaculty = mockDepartmentStats.reduce((acc, curr) => acc + curr.totalFaculty, 0);
  const avgAttendance = Math.round(
    mockDepartmentStats.reduce((acc, curr) => acc + curr.avgAttendance, 0) / mockDepartmentStats.length
  );
  const escalatedGrievances = mockGrievances.filter(g => g.status === 'escalated').length;

  const attendanceData = mockDepartmentStats.map((dept, index) => ({
    name: dept.department,
    value: dept.avgAttendance,
    color: [
      'hsl(224, 71%, 40%)',
      'hsl(168, 76%, 36%)',
      'hsl(38, 92%, 50%)',
      'hsl(280, 65%, 50%)',
    ][index],
  }));

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
            value={totalStudents.toLocaleString()}
            subtitle="Across all departments"
            icon={<GraduationCap size={24} />}
            trend={{ value: 12, isPositive: true }}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Total Faculty"
            value={totalFaculty}
            subtitle="Teaching staff"
            icon={<Users size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />
          <StatCard
            title="Departments"
            value={mockDepartmentStats.length}
            subtitle="Active departments"
            icon={<Building2 size={24} />}
            iconClassName="bg-success/10 text-success"
          />
          <StatCard
            title="Escalated Issues"
            value={escalatedGrievances}
            subtitle="Requires your attention"
            icon={<AlertTriangle size={24} />}
            iconClassName="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentChart data={mockDepartmentStats} type="students" />
          <DepartmentChart data={mockDepartmentStats} type="performance" />
        </div>

        {/* Department Performance Table */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Department Statistics</h3>
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
                {mockDepartmentStats.map((dept) => (
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
        </div>

        {/* Recent Announcements */}
        <div>
          <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Recent Announcements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockNotices.filter(n => n.priority === 'high').map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
