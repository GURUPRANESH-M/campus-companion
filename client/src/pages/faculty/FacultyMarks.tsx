import { useState, useEffect, useRef } from "react";
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
  const [facultySubjects, setFacultySubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get("/faculty/profile")
      .then(res => setFacultySubjects(res.data.handlingSubjects || []))
      .catch(console.error);
  }, []);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        let regIndex = 0;
        let scoreIndex = 1;
        let startIndex = 0;

        if (lines.length > 0) {
          const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
          if (headers.some(h => h.includes('reg'))) {
            startIndex = 1;
            regIndex = headers.findIndex(h => h.includes('reg') || h.includes('id'));
            scoreIndex = headers.findIndex(h => h.includes('score') || h.includes('mark') || h.includes('int'));
            if (scoreIndex === -1) scoreIndex = headers.length - 1;
          }
        }

        let matchCount = 0;
        const parsedMap = new Map();

        for (let i = startIndex; i < lines.length; i++) {
          const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.trim().replace(/^"|"$/g, ''));
          if (parts.length > Math.max(regIndex, scoreIndex)) {
            const regNo = parts[regIndex];
            const score = Number(parts[scoreIndex]);
            if (regNo && !isNaN(score)) {
              parsedMap.set(regNo, score);
            }
          }
        }

        setStudents(prev => {
          let updatedMatches = 0;
          const updated = prev.map(s => {
            if (parsedMap.has(s.regNo)) {
              updatedMatches++;
              return { ...s, score: parsedMap.get(s.regNo) };
            }
            return s;
          });
          toast({ title: "Success", description: `Autofilled marks for ${updatedMatches} students from CSV.` });
          return updated;
        });

      } catch (error) {
        toast({ title: "Upload Failed", description: "Could not parse CSV file. Please check format.", variant: "destructive" });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
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
              <label className="text-sm font-medium">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                <SelectContent>
                  {facultySubjects.map((sub: any) => (
                    <SelectItem key={sub.subjectCode} value={sub.subjectCode}>
                      {sub.subjectName} ({sub.subjectCode})
                    </SelectItem>
                  ))}
                  {facultySubjects.length === 0 && (
                    <SelectItem value="none" disabled>
                      No subjects assigned
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
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
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Upload CSV
                  </Button>
                  <Button onClick={handleSubmitMarks} disabled={saving} variant="gradient">
                    {saving ? "Saving..." : "Save All Marks"}
                  </Button>
                </div>
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
