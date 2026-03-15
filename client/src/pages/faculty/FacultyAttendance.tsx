import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

export default function FacultyAttendance() {

  const { timetableId } = useParams();
  const { toast } = useToast();

  const [students, setStudents] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/attendance/period/${timetableId}`);
      setStudents(res.data.students);
      setTimetable(res.data.timetable);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    }
  };

  const toggle = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async () => {
    try {

      const records = students.map(student => ({
        studentId: student._id,
        status: attendance[student._id] ? "present" : "absent",
      }));

      await api.post("/attendance/period", {
        timetableId,
        records,
      });

      toast({
        title: "Attendance Saved",
      });

    } catch {
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    }
  };

  if (!timetable) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <h1 className="text-2xl font-bold">
          {timetable.subject} — Period {timetable.period}
        </h1>

        <div className="space-y-3">
          {students.map(student => (
            <div key={student._id} className="flex justify-between border p-3 rounded">
              <span>{student.name}</span>
              <Checkbox
                checked={attendance[student._id] || false}
                onCheckedChange={() => toggle(student._id)}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit}>
          Save Attendance
        </Button>

      </div>
    </DashboardLayout>
  );
}