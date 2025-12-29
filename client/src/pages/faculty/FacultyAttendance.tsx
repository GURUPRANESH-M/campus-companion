import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

/* TEMP STUDENTS (replace with backend later) */
const students = [
  { _id: "694d7f7737267b1cff1fc650", name: "Arun Kumar", regNo: "CS001" },
  { _id: "694d7f7737267b1cff1fc651", name: "Divya S", regNo: "CS002" },
  { _id: "694d7f7737267b1cff1fc652", name: "Rahul R", regNo: "CS003" },
];

export default function FacultyAttendance() {
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  /* ---------- TOGGLE PRESENT / ABSENT ---------- */
  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  /* ---------- SUBMIT ATTENDANCE ---------- */
  const handleSubmit = async () => {
    try {
      if (!subject || !section) {
        toast({
          title: "Missing Fields",
          description: "Please select subject and section",
          variant: "destructive",
        });
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      for (const student of students) {
        await api.post("/attendance", {
          studentId: student._id, // ✅ MUST MATCH BACKEND
          subject,
          date: today,
          status: attendance[student._id] ? "present" : "absent",
        });
      }

      toast({
        title: "Attendance Saved",
        description: "Attendance marked successfully",
      });

      setAttendance({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold">Mark Attendance</h1>
          <p className="text-muted-foreground">
            Select class and mark student attendance
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 max-w-xl">
          <Select onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DBMS">DBMS</SelectItem>
              <SelectItem value="DS">Data Structures</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSection}>
            <SelectTrigger>
              <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CS-A">CS-A</SelectItem>
              <SelectItem value="CS-B">CS-B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attendance Table */}
        {subject && section && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Reg No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student._id}>
                    <TableCell>{student.regNo}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={attendance[student._id] || false}
                        onCheckedChange={() =>
                          toggleAttendance(student._id)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 flex justify-end">
              <Button onClick={handleSubmit} variant="gradient">
                Submit Attendance
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
