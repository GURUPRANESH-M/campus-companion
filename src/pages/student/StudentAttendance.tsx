import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { mockAttendance } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function StudentAttendance() {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Attendance Report</h1>
          <p className="text-muted-foreground">View your subject-wise attendance details</p>
        </div>

        <AttendanceChart data={mockAttendance} />

        {/* Detailed Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-serif font-semibold text-lg text-foreground">Detailed Breakdown</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Total Classes</TableHead>
                <TableHead className="text-center">Attended</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendance.map((record) => (
                <TableRow key={record.subjectCode} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{record.subjectCode}</TableCell>
                  <TableCell>{record.subject}</TableCell>
                  <TableCell className="text-center">{record.totalClasses}</TableCell>
                  <TableCell className="text-center">{record.attended}</TableCell>
                  <TableCell className="w-48">
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={record.percentage} 
                        className="h-2 flex-1"
                      />
                    </div>
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getStatusColor(record.percentage))}>
                    {record.percentage}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-success/10 rounded-xl p-5 border border-success/20">
            <p className="text-sm font-medium text-success mb-1">Excellent (≥90%)</p>
            <p className="text-2xl font-bold text-success">
              {mockAttendance.filter(r => r.percentage >= 90).length} subjects
            </p>
          </div>
          <div className="bg-warning/10 rounded-xl p-5 border border-warning/20">
            <p className="text-sm font-medium text-warning mb-1">Good (75-89%)</p>
            <p className="text-2xl font-bold text-warning">
              {mockAttendance.filter(r => r.percentage >= 75 && r.percentage < 90).length} subjects
            </p>
          </div>
          <div className="bg-destructive/10 rounded-xl p-5 border border-destructive/20">
            <p className="text-sm font-medium text-destructive mb-1">Below Requirement (&lt;75%)</p>
            <p className="text-2xl font-bold text-destructive">
              {mockAttendance.filter(r => r.percentage < 75).length} subjects
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
