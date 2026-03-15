import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { GrievanceCard } from '@/components/dashboard/GrievanceCard';
import { Calendar, FileText, Award, AlertTriangle, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/api/api';

interface CoEStats {
  upcomingExams: number;
  resultsPending: number;
  resultsPublished: number;
  examGrievances: number;
  recentSchedules: any[];
}

export default function CoEDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<CoEStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [grievances, setGrievances] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using our previously existing COE specific routes as requested
        const [dashRes, grievRes] = await Promise.all([
          api.get('/coe/dashboard'),
          api.get('/exam-grievances')
        ]);
        setStats(dashRes.data);
        setGrievances(grievRes.data.slice(0, 3)); // show top 3 on dashboard
      } catch (error) {
        console.error("Failed to fetch COE dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[500px]">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
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
            value={stats.upcomingExams}
            subtitle="Scheduled exams"
            icon={<Calendar size={24} />}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Results Pending"
            value={stats.resultsPending}
            subtitle="Awaiting publication"
            icon={<FileText size={24} />}
            iconClassName="bg-warning/10 text-warning"
          />
          <StatCard
            title="Published Results"
            value={stats.resultsPublished}
            subtitle="Total published"
            icon={<Award size={24} />}
            iconClassName="bg-success/10 text-success"
          />
          <StatCard
            title="Exam Grievances"
            value={stats.examGrievances}
            subtitle="Open complaints"
            icon={<AlertTriangle size={24} />}
            iconClassName="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Exam Schedule */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-semibold text-lg text-foreground">Recent Exam Schedules</h3>
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
              {stats.recentSchedules && stats.recentSchedules.length > 0 ? (
                stats.recentSchedules.map((exam: any) => (
                  <TableRow key={exam._id} className="hover:bg-muted/30">
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
                        {exam.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No recent schedules
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Quick Actions and Grievances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/coe/schedule')}>
                <Calendar size={24} />
                <span>Schedule Exam</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/coe/results')}>
                <FileText size={24} />
                <span>Upload Results</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/coe/results')}>
                <Award size={24} />
                <span>Publish Results</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/coe/grievances')}>
                <AlertTriangle size={24} />
                <span>Manage Grievances</span>
              </Button>
            </div>
          </div>

          {/* Exam Grievances */}
          <div>
            <h3 className="font-serif font-semibold text-lg text-foreground mb-4">Recent Grievances</h3>
            <div className="space-y-4">
              {grievances.length > 0 ? (
                grievances.map((grievance) => (
                  <GrievanceCard key={grievance._id} grievance={grievance} />
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
