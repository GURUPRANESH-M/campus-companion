import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

export default function FacultyAttendance() {

  const { timetableId } = useParams();
  const { toast } = useToast();

  const [students, setStudents] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.regNo && s.regNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleAll = (checked: boolean) => {
    const newAttendance = { ...attendance };
    filteredStudents.forEach(s => {
      newAttendance[s._id] = checked;
    });
    setAttendance(newAttendance);
  };

  const isAllChecked = filteredStudents.length > 0 && filteredStudents.every(s => attendance[s._id]);

  const exportToCSV = () => {
    if (!timetable) return;
    
    const headers = ["Register No", "Name", "Department", "Year", "Section", "Subject", "Date", "Status"];
    const dateAssigned = new Date().toLocaleDateString();
    
    const rows = students.map(s => {
      // Use full class context from timetable state
      return [
        s.regNo || "N/A",
        `"${s.name}"`,
        timetable.department,
        timetable.year,
        timetable.section,
        `"${timetable.subject}"`,
        dateAssigned,
        attendance[s._id] ? "Present" : "Absent"
      ].join(",");
    });
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${timetable.subject}_Attendance_${dateAssigned.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        description: "Downloading Excel sheet...",
      });
      
      exportToCSV();

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

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or register number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex items-center gap-2 shrink-0 bg-muted/50 px-4 py-2 rounded-lg border">
            <Checkbox 
              id="select-all" 
              checked={isAllChecked}
              onCheckedChange={(checked) => toggleAll(checked as boolean)}
            />
            <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
              Mark Everyone Present
            </label>
          </div>
        </div>

        <div className="space-y-3">
          {filteredStudents.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No students found matching your search.</p>
          )}
          {filteredStudents.map(student => (
            <div key={student._id} className="flex justify-between items-center bg-card border p-3 rounded-lg shadow-sm hover:border-primary/50 transition-colors">
              <div className="flex flex-col">
                <span className="font-semibold text-primary">{student.regNo || "N/A"}</span>
                <span className="text-sm text-muted-foreground">{student.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${attendance[student._id] ? "text-success" : "text-destructive"}`}>
                  {attendance[student._id] ? "Present" : "Absent"}
                </span>
                <Checkbox
                  checked={attendance[student._id] || false}
                  onCheckedChange={() => toggle(student._id)}
                  className="h-5 w-5"
                />
              </div>
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