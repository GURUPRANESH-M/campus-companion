import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { GrievanceCard } from '@/components/dashboard/GrievanceCard';
import { mockExamSchedule, mockGrievances } from '@/data/mockData';
import { Calendar, FileText, Award, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CoEDashboard() {
  const examGrievances = mockGrievances.filter(g => g.category === 'Examination');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-serif text-2xl font-bold mb-2">
            Examination Control
          </h1>
          <p className="text-primary-foreground/80">
            Manage exam schedules, results, and examination-related grievances
          </p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <StatCard
            title="Upcoming Exams"
            value={mockExamSchedule.length}
            subtitle="End semester exams"
            icon={<Calendar size={24} />}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Results Pending"
            value="3"
            subtitle="Awaiting publication"
            icon={<FileText size={24} />}
            iconClassName="bg-warning/10 text-warning"
          />
          <StatCard
            title="Published Results"
            value="12"
            subtitle="This semester"
            icon={<Award size={24} />}
            iconClassName="bg-success/10 text-success"
          />
          <StatCard
            title="Exam Grievances"
            value={examGrievances.length}
            subtitle="Open complaints"
            icon={<AlertTriangle size={24} />}
            iconClassName="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Exam Schedule */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-semibold text-lg text-foreground">Exam Schedule - December 2024</h3>
            <Button variant="gradient" size="sm">
              Upload Schedule
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockExamSchedule.map((exam) => (
                <TableRow key={exam.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{exam.subjectCode}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>
                    {new Date(exam.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>{exam.venue}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Scheduled
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Quick Actions and Grievances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Calendar size={24} />
                <span>Schedule Exam</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText size={24} />
                <span>Upload Results</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Award size={24} />
                <span>Generate Ranks</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <AlertTriangle size={24} />
                <span>Revaluation</span>
              </Button>
            </div>
          </div>

          {/* Exam Grievances */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Examination Grievances</h3>
            <div className="space-y-4">
              {examGrievances.length > 0 ? (
                examGrievances.map((grievance) => (
                  <GrievanceCard key={grievance.id} grievance={grievance} />
                ))
              ) : (
                <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground">
                  No examination grievances at the moment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
