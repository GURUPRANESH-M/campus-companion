import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function HODStudentPerformance() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    api.get("/hod/students-performance").then((res) => {
      setStudents(res.data);
    });
  }, []);

  const statusColor = (status: string) => {
    if (status === "Critical") return "destructive";
    if (status === "Warning") return "warning";
    return "success";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold">
          Student Performance
        </h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Attendance %</TableHead>
              <TableHead>Marks %</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.regNo}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.attendance}%</TableCell>
                <TableCell>{s.marks}%</TableCell>
                <TableCell>
                  <Badge variant={statusColor(s.status)}>
                    {s.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
