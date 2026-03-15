import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS"];
const YEARS = ["1", "2", "3", "4"];
const SECTIONS = ["A", "B", "C"];
const EXAM_TYPES = ["CAT1", "CAT2", "ASSIGNMENT"];

interface StudentMark {
  _id: string;
  name: string;
  regNo: string;
  score: string | number;
}

export default function FacultyMarks() {
  const { toast } = useToast();
  
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [maxScore, setMaxScore] = useState("100");

  const [students, setStudents] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFetchStudents = async () => {
    if (!department || !year || !section || !subject || !examType) {
      toast({ title: "Validation Error", description: "Please fill all class details first", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/internal-marks/students", {
        params: { department, year, section, subject, examType }
      });
      setStudents(res.data);
      if (res.data.length === 0) {
        toast({ title: "Alert", description: "No students found for this class" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to fetch student list", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (id: string, newScore: string) => {
    setStudents(prev => prev.map(s => s._id === id ? { ...s, score: newScore } : s));
  };

  const handleSubmitMarks = async () => {
    try {
      setSaving(true);

      const validMarks = students.filter(s => s.score !== "" && s.score !== null);
      
      if (validMarks.length === 0) {
        toast({ title: "Validation Error", description: "No marks entered", variant: "destructive" });
        return;
      }

      const payload = {
        subject,
        examType,
        maxScore: Number(maxScore),
        marks: validMarks.map(m => ({
          studentId: m._id,
          score: Number(m.score)
        }))
      };

      await api.post("/internal-marks/bulk", payload);

      toast({ title: "Success", description: "Internal Marks saved successfully!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to save marks", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold">Class Internal Marks</h1>
          <p className="text-muted-foreground">Select a class to enter grades in a spreadsheet format</p>
        </div>

        {/* Filters Card */}
        <Card className="p-6 bg-card border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue placeholder="Dept" /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger><SelectValue placeholder="Section" /></SelectTrigger>
                <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Exam Type</label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger><SelectValue placeholder="Exam" /></SelectTrigger>
                <SelectContent>{EXAM_TYPES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Code</label>
              <Input placeholder="e.g. CS101" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>

            <Button onClick={handleFetchStudents} className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Get Class List"}
            </Button>
          </div>
        </Card>

        {/* Excel-like Table */}
        {students.length > 0 && (
          <Card className="border rounded-xl shadow-sm overflow-hidden bg-card">
            <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
              <div>
                <h3 className="font-semibold font-serif">Data Entry Sheet</h3>
                <p className="text-sm text-muted-foreground">Type scores directly into the input fields</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium whitespace-nowrap">Max Score:</label>
                  <Input 
                    type="number" 
                    value={maxScore} 
                    onChange={e => setMaxScore(e.target.value)} 
                    className="w-20 h-9" 
                  />
                </div>
                <Button onClick={handleSubmitMarks} disabled={saving} variant="gradient">
                  {saving ? "Saving..." : "Save All Marks"}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[60vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-[100px]">S.No</TableHead>
                    <TableHead>Register No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-[200px] text-center">Score Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student._id} className="hover:bg-muted/10 transition-colors">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium text-primary">{student.regNo}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={student.score}
                          onChange={(e) => handleScoreChange(student._id, e.target.value)}
                          placeholder={`/ ${maxScore}`}
                          className="text-center font-semibold bg-background border-primary/20 focus-visible:ring-primary focus:border-primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
