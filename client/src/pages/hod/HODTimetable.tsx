import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/api/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = [1, 2, 3, 4, 5, 6, 7];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const sections = ["A", "B", "C"];
const departments = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS"];

export default function HODTimetable() {
  const { toast } = useToast();

  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);

  const [grid, setGrid] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [conflictCell, setConflictCell] = useState<{ day: string, period: number } | null>(null);

  useEffect(() => {
    fetchFaculty();
  }, []);

  // When a faculty is selected, fetch their existing timetable to pre-fill the grid
  useEffect(() => {
    if (selectedFaculty) {
      loadFacultyTimetable(selectedFaculty);
      setConflictCell(null);
    } else {
      setGrid({});
      setConflictCell(null);
    }
  }, [selectedFaculty]);

  const activeFacultyDetails = facultyList.find(f => f._id === selectedFaculty);
  const activeFacultySubjects = activeFacultyDetails?.handlingSubjects || [];

  const fetchFaculty = async () => {
    try {
      const res = await api.get("/hod/faculty");
      setFacultyList(res.data);
    } catch {
      console.error("Error loading faculty");
    }
  };

  const loadFacultyTimetable = async (facultyId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/hod/timetable/faculty?facultyId=${facultyId}`);
      const newGrid: any = {};
      
      res.data.forEach((entry: any) => {
        if (!newGrid[entry.day]) newGrid[entry.day] = {};
        newGrid[entry.day][entry.period] = {
          subject: entry.subject || "",
          semester: entry.semester?.toString() || "",
          section: entry.section || "",
          department: entry.department || ""
        };
      });
      setGrid(newGrid);
    } catch {
      toast({ title: "Error", description: "Could not load teacher's timetable", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (day: string, period: number, field: string, value: string) => {
    if (field === "subject" && value === "clear") {
      setGrid((prev: any) => ({
        ...prev,
        [day]: {
          ...(prev[day] || {}),
          [period]: {
            subject: "",
            semester: "",
            section: "",
            department: ""
          }
        }
      }));
      setConflictCell(null);
      return;
    }

    setGrid((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: {
          ...prev[day]?.[period],
          [field]: value
        }
      }
    }));
    setConflictCell(null); // Clear conflict visual on edit
  };

  const handleSubmit = async () => {
    if (!selectedFaculty) {
      toast({ title: "Validation Error", description: "Please select a teacher first", variant: "destructive" });
      return;
    }
    
    setConflictCell(null);

    try {
      const weekSchedule = days.map(day => ({
        day,
        periods: periods.map(period => ({
          period,
          subject: grid[day]?.[period]?.subject || "",
          semester: grid[day]?.[period]?.semester || "",
          section: grid[day]?.[period]?.section || "",
          department: grid[day]?.[period]?.department || ""
        }))
      }));

      await api.post("/hod/timetable/faculty", {
        facultyId: selectedFaculty,
        weekSchedule
      });

      toast({
        title: "Timetable Saved",
        description: "Teacher's timetable saved successfully"
      });
    } catch (error: any) {
      if (error.response?.data?.conflict) {
        const { day, period } = error.response.data.conflict;
        setConflictCell({ day, period: Number(period) });
      }

      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save timetable",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Teacher Timetable</h1>

        <div className="flex gap-4 items-center bg-card p-4 rounded-xl shadow-sm border">
          <label className="font-semibold text-sm">Select Teacher:</label>
          <div className="w-[300px]">
            <Select onValueChange={setSelectedFaculty} value={selectedFaculty}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a faculty member..." />
              </SelectTrigger>
              <SelectContent>
                {facultyList.map(f => (
                  <SelectItem key={f._id} value={f._id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedFaculty && (
          <div className="bg-card/60 backdrop-blur-sm border rounded-xl shadow-lg p-4 overflow-auto">
            {loading ? (
              <p className="text-muted-foreground p-4">Loading timetable...</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-muted/50 rounded-tl-lg">Day / Period</th>
                    {periods.map(p => (
                      <th key={p} className="border p-2 bg-muted/50">P{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day} className="hover:bg-primary/5 transition-colors">
                      <td className="border p-4 font-semibold text-center">{day}</td>
                      {periods.map(period => {
                        const isConflict = conflictCell?.day === day && conflictCell?.period === period;
                        return (
                        <td key={period} className="border p-2">
                          <Card className={`p-2 space-y-2 border-primary/20 hover:shadow-md transition ${isConflict ? 'bg-destructive/10 border-destructive ring-2 ring-destructive ring-offset-1' : 'bg-background/50'}`}>
                            <Select
                              value={grid[day]?.[period]?.subject || ""}
                              onValueChange={(val) => handleChange(day, period, "subject", val)}
                            >
                              <SelectTrigger className="h-8 text-xs px-2">
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {activeFacultySubjects.map((sub: any) => (
                                  <SelectItem key={sub.subjectCode} value={sub.subjectCode}>
                                    {sub.subjectName} ({sub.subjectCode})
                                  </SelectItem>
                                ))}
                                {activeFacultySubjects.length > 0 && (
                                  <SelectItem value="clear" className="text-destructive focus:bg-destructive/10 cursor-pointer font-bold justify-center mt-1 border-t border-border">
                                    -- Clear Slot --
                                  </SelectItem>
                                )}
                                {activeFacultySubjects.length === 0 && (
                                  <SelectItem value="none" disabled>
                                    No subjects assigned
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <div className="flex gap-1 justify-between">
                              <Select
                                value={grid[day]?.[period]?.department || ""}
                                onValueChange={(val) => handleChange(day, period, "department", val)}
                              >
                                <SelectTrigger className="h-8 text-xs w-[32%] px-1">
                                  <SelectValue placeholder="Dept" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Select
                                value={grid[day]?.[period]?.semester || ""}
                                onValueChange={(val) => handleChange(day, period, "semester", val)}
                              >
                                <SelectTrigger className="h-8 text-xs w-[32%] px-1">
                                  <SelectValue placeholder="Sem" />
                                </SelectTrigger>
                                <SelectContent>
                                  {semesters.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Select
                                value={grid[day]?.[period]?.section || ""}
                                onValueChange={(val) => handleChange(day, period, "section", val)}
                              >
                                <SelectTrigger className="h-8 text-xs w-[32%] px-1">
                                  <SelectValue placeholder="Sec" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          </Card>
                        </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit} className="hover:scale-105 transition-transform" disabled={loading}>
                Save Timetable
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}