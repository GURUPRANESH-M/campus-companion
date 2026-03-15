import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar } from "lucide-react";
import api from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentExams() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const res = await api.get('/exams');
        setSchedules(res.data);
      } catch (error) {
        console.error("Failed to fetch exam schedules", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground flex justify-between items-center">
            <div>
                <h1 className="font-serif text-2xl font-bold mb-2">My Exam Timetable</h1>
                <p className="text-primary-foreground/80">
                    Official examination schedule for your enrolled courses
                </p>
            </div>
            <Calendar size={48} className="opacity-20" />
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[400px]">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Subject Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.length > 0 ? (
                  schedules.map((exam) => (
                    <TableRow key={exam._id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        {new Date(exam.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric',
                          timeZone: 'UTC'
                        })}
                      </TableCell>
                      <TableCell className="font-medium text-primary">{exam.time}</TableCell>
                      <TableCell>{exam.subjectCode}</TableCell>
                      <TableCell>{exam.subject}</TableCell>
                      <TableCell>{exam.duration}</TableCell>
                      <TableCell>{exam.venue}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`bg-${exam.status === 'Completed' ? 'muted' : 'success'}/10 text-${exam.status === 'Completed' ? 'muted-foreground' : 'success'} border-${exam.status === 'Completed' ? 'border' : 'success'}/20`}>
                          {exam.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground space-y-2">
                        <Calendar className="mx-auto h-8 w-8 opacity-20" />
                        <p>No exams currently scheduled for your department and year.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
