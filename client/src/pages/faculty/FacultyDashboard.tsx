import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { FeedbackChart } from '@/components/charts/FeedbackChart';
import { mockFeedback, mockAttendance, mockNotices } from '@/data/mockData';
import { Users, BookOpen, BarChart3, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function FacultyDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-accent rounded-2xl p-6 text-accent-foreground">
          <h1 className="font-serif text-2xl font-bold mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-accent-foreground/80">
            Manage your classes, mark attendance, and view feedback.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <StatCard
            title="Total Students"
            value="1"
            subtitle="Across 3 sections"
            icon={<Users size={24} />}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Classes Today"
            value="4"
            subtitle="2 completed, 2 pending"
            icon={<BookOpen size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />
          <StatCard
            title="Avg Feedback"
            value="5.0"
            subtitle="Out of 5.0"
            icon={<BarChart3 size={24} />}
            iconClassName="bg-success/10 text-success"
          />
          <StatCard
            title="Pending Notices"
            value="2"
            subtitle="To be posted"
            icon={<Bell size={24} />}
            iconClassName="bg-warning/10 text-warning"
          />
        </div>

        {/* Quick Actions and Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Today's Schedule</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Time</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>09:00 AM</TableCell>
                  <TableCell>Data Structures</TableCell>
                  <TableCell>CS-A</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Mark Attendance</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>11:00 AM</TableCell>
                  <TableCell>Data Structures</TableCell>
                  <TableCell>CS-B</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Mark Attendance</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>02:00 PM</TableCell>
                  <TableCell>Algorithms Lab</TableCell>
                  <TableCell>CS-A</TableCell>
                  <TableCell>
                    <Button size="sm" variant="success">Completed</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Feedback Overview */}
          <FeedbackChart data={mockFeedback[0]} />
        </div>

        {/* Recent Notices */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-semibold text-lg text-foreground">Recent Notices</h3>
            <Button variant="outline" size="sm">Post Notice</Button>
          </div>
          <div className="space-y-3">
            {mockNotices.slice(0, 3).map((notice) => (
              <div key={notice.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{notice.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{notice.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
