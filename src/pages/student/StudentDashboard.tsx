import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { NoticeCard } from '@/components/dashboard/NoticeCard';
import { GrievanceCard } from '@/components/dashboard/GrievanceCard';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { 
  mockAttendance, 
  mockMarks, 
  mockNotices, 
  mockGrievances,
  mockExamSchedule 
} from '@/data/mockData';
import { Calendar, Award, BookOpen, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const avgAttendance = Math.round(
    mockAttendance.reduce((acc, curr) => acc + curr.percentage, 0) / mockAttendance.length
  );
  const totalMarks = mockMarks.reduce((acc, curr) => acc + curr.total, 0);
  const maxMarks = mockMarks.reduce((acc, curr) => acc + curr.maxMarks, 0);
  const pendingGrievances = mockGrievances.filter(g => g.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-serif text-2xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-primary-foreground/80">
            Here's an overview of your academic progress and updates.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <StatCard
            title="Overall Attendance"
            value={`${avgAttendance}%`}
            subtitle="Across all subjects"
            icon={<Calendar size={24} />}
            trend={{ value: 2.5, isPositive: true }}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Internal Marks"
            value={`${totalMarks}/${maxMarks}`}
            subtitle={`${Math.round((totalMarks / maxMarks) * 100)}% average`}
            icon={<Award size={24} />}
            iconClassName="bg-success/10 text-success"
          />
          <StatCard
            title="Subjects"
            value={mockAttendance.length}
            subtitle="This semester"
            icon={<BookOpen size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />
          <StatCard
            title="Pending Grievances"
            value={pendingGrievances}
            subtitle="Awaiting response"
            icon={<AlertTriangle size={24} />}
            iconClassName="bg-warning/10 text-warning"
          />
        </div>

        {/* Charts and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceChart data={mockAttendance} />

          {/* Upcoming Exams */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Upcoming Exams</h3>
            <div className="space-y-3">
              {mockExamSchedule.slice(0, 4).map((exam) => (
                <div 
                  key={exam.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{exam.subject}</p>
                    <p className="text-sm text-muted-foreground">{exam.subjectCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-muted-foreground">{exam.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notices and Grievances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Recent Notices</h3>
            <div className="space-y-4">
              {mockNotices.slice(0, 2).map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Your Grievances</h3>
            <div className="space-y-4">
              {mockGrievances.slice(0, 2).map((grievance) => (
                <GrievanceCard key={grievance.id} grievance={grievance} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
