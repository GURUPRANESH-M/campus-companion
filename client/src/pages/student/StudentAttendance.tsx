import { useEffect, useState } from "react";
import api from "@/api/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type AttendanceRecord = {
  subject: string;
  status: "present" | "absent";
};

type SubjectAttendance = {
  subjectCode: string;
  subject: string;
  totalClasses: number;
  attended: number;
  percentage: number;
};

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState<SubjectAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/attendance/my")
      .then((res) => {
        const records: AttendanceRecord[] = res.data;

        // Group by subject
        const map: Record<string, SubjectAttendance> = {};

        records.forEach((r) => {
          if (!map[r.subject]) {
            map[r.subject] = {
              subjectCode: r.subject.toUpperCase(),
              subject: r.subject,
              totalClasses: 0,
              attended: 0,
              percentage: 0,
            };
          }

          map[r.subject].totalClasses += 1;
          if (r.status === "present") {
            map[r.subject].attended += 1;
          }
        });

        // Calculate percentage
        const finalData = Object.values(map).map((s) => ({
          ...s,
          percentage: Math.round(
            (s.attended / s.totalClasses) * 100
          ),
        }));

        setAttendance(finalData);
      })
      .catch(() => alert("Failed to load attendance"))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-warning";
    return "text-destructive";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading attendance...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Attendance Report
          </h1>
          <p className="text-muted-foreground">
            View your subject-wise attendance details
          </p>
        </div>

        <AttendanceChart data={attendance} />

        {/* Detailed Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-serif font-semibold text-lg text-foreground">
              Detailed Breakdown
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">
                  Total Classes
                </TableHead>
                <TableHead className="text-center">
                  Attended
                </TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">
                  Percentage
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {attendance.map((record) => (
                <TableRow
                  key={record.subject}
                  className="hover:bg-muted/30"
                >
                  <TableCell className="font-medium">
                    {record.subject}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.totalClasses}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.attended}
                  </TableCell>
                  <TableCell className="w-48">
                    <Progress
                      value={record.percentage}
                      className="h-2"
                    />
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-semibold",
                      getStatusColor(record.percentage)
                    )}
                  >
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
            <p className="text-sm font-medium text-success mb-1">
              Excellent (≥90%)
            </p>
            <p className="text-2xl font-bold text-success">
              {attendance.filter((r) => r.percentage >= 90).length} subjects
            </p>
          </div>

          <div className="bg-warning/10 rounded-xl p-5 border border-warning/20">
            <p className="text-sm font-medium text-warning mb-1">
              Good (75–89%)
            </p>
            <p className="text-2xl font-bold text-warning">
              {
                attendance.filter(
                  (r) => r.percentage >= 75 && r.percentage < 90
                ).length
              }{" "}
              subjects
            </p>
          </div>

          <div className="bg-destructive/10 rounded-xl p-5 border border-destructive/20">
            <p className="text-sm font-medium text-destructive mb-1">
              Below Requirement (&lt;75%)
            </p>
            <p className="text-2xl font-bold text-destructive">
              {attendance.filter((r) => r.percentage < 75).length} subjects
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
