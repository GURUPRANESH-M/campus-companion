import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DepartmentChart } from '@/components/charts/DepartmentChart';
import { GrievanceCard } from '@/components/dashboard/GrievanceCard';
import { mockDepartmentStats, mockGrievances, mockFeedback } from '@/data/mockData';
import { Users, GraduationCap, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HODDashboard() {
  const { user } = useAuth();
  const deptStats = mockDepartmentStats[0]; // Computer Science

  const performanceData = [
    { name: 'Semester 1', pass: 92, distinction: 25 },
    { name: 'Semester 2', pass: 88, distinction: 22 },
    { name: 'Semester 3', pass: 90, distinction: 28 },
    { name: 'Semester 4', pass: 85, distinction: 20 },
    { name: 'Semester 5', pass: 91, distinction: 30 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-serif text-2xl font-bold mb-2">
            Department Overview
          </h1>
          <p className="text-primary-foreground/80">
            {user?.department} - Academic Year 2024-25
          </p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <StatCard
            title="Total Students"
            value={deptStats.totalStudents}
            subtitle="Enrolled students"
            icon={<GraduationCap size={24} />}
            trend={{ value: 8, isPositive: true }}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Faculty Members"
            value={deptStats.totalFaculty}
            subtitle="Active teaching staff"
            icon={<Users size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />
          <StatCard
            title="Avg Attendance"
            value={`${deptStats.avgAttendance}%`}
            subtitle="Department average"
            icon={<TrendingUp size={24} />}
            trend={{ value: 3, isPositive: true }}
            iconClassName="bg-success/10 text-success"
          />
          <StatCard
            title="Open Grievances"
            value="5"
            subtitle="Requiring attention"
            icon={<AlertTriangle size={24} />}
            iconClassName="bg-warning/10 text-warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Semester Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="pass" name="Pass %" fill="hsl(224, 71%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="distinction" name="Distinction %" fill="hsl(168, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <DepartmentChart data={mockDepartmentStats} type="attendance" />
        </div>

        {/* Faculty Feedback and Grievances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Faculty */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Faculty Performance</h3>
            <div className="space-y-4">
              {mockFeedback.map((feedback, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {feedback.facultyName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{feedback.facultyName}</p>
                      <p className="text-sm text-muted-foreground">{feedback.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{feedback.avgRating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">{feedback.totalResponses} responses</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Grievances */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Department Grievances</h3>
            <div className="space-y-4">
              {mockGrievances.filter(g => g.department === 'Computer Science').slice(0, 2).map((grievance) => (
                <GrievanceCard key={grievance.id} grievance={grievance} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
