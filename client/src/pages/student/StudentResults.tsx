import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/api/api";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, GraduationCap, Trophy } from "lucide-react";

type Result = {
  _id: string;
  subjectCode: string;
  subject: string;
  semester: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  passStatus: string;
  published: boolean;
};

export default function StudentResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/results/my");
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading semester results...</p>
      </DashboardLayout>
    );
  }

  // Group by semester natively without lodash
  const groupedResults = results.reduce((acc: Record<number, Result[]>, curr: Result) => {
    if (!acc[curr.semester]) {
      acc[curr.semester] = [];
    }
    acc[curr.semester].push(curr);
    return acc;
  }, {});

  const semesters = Object.keys(groupedResults).sort((a, b) => Number(b) - Number(a));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-xl text-primary">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">End Semester Results</h1>
            <p className="text-muted-foreground text-sm">Official results published by Controller of Examinations</p>
          </div>
        </div>

        {semesters.length === 0 ? (
          <div className="bg-card p-8 rounded-xl border border-dashed text-center flex flex-col items-center justify-center gap-3">
            <Trophy className="text-muted-foreground opacity-50 h-10 w-10" />
            <p className="text-muted-foreground font-medium">No official results published yet.</p>
          </div>
        ) : (
          semesters.map((sem) => {
            const semResults = groupedResults[Number(sem)];
            
            // Calculate semester stats
            const totalSubjects = semResults.length;
            const passedSubjects = semResults.filter(r => r.passStatus.toLowerCase() === 'pass').length;
            const fgpaCredits = semResults.reduce((acc, curr) => {
                // Rough GPA estimate based on Grades O, A+, A, B+, B
                let pts = 0;
                switch(curr.grade) {
                    case 'O': pts = 10; break;
                    case 'A+': pts = 9; break;
                    case 'A': pts = 8; break;
                    case 'B+': pts = 7; break;
                    case 'B': pts = 6; break;
                    case 'C': pts = 5; break;
                    default: pts = 0;
                }
                return acc + pts;
            }, 0);
            
            const gpa = totalSubjects > 0 ? (fgpaCredits / totalSubjects).toFixed(2) : "0.00";

            return (
              <div key={`sem-${sem}`} className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="p-5 bg-muted/40 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-muted-foreground" />
                    <h2 className="text-lg font-bold text-foreground">Semester {sem}</h2>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <Badge variant={passedSubjects === totalSubjects ? "default" : "destructive"}>
                        {passedSubjects}/{totalSubjects} Passed
                    </Badge>
                    <div className="bg-background px-3 py-1 rounded-md border text-sm font-semibold text-primary">
                        GPA: {gpa}
                    </div>
                  </div>
                </div>

                <div className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow>
                        <TableHead className="w-[120px]">Code</TableHead>
                        <TableHead>Subject Name</TableHead>
                        <TableHead className="text-center">Internal</TableHead>
                        <TableHead className="text-center">External</TableHead>
                        <TableHead className="text-center font-bold">Total</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semResults.map((result) => (
                        <TableRow key={result._id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium text-muted-foreground">
                            {result.subjectCode}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {result.subject}
                          </TableCell>
                          <TableCell className="text-center">
                            {result.internalMarks}/50
                          </TableCell>
                          <TableCell className="text-center">
                            {result.externalMarks}/50
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {result.totalMarks}/100
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                              {result.grade}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                result.passStatus.toLowerCase() === "pass"
                                  ? "bg-success/10 text-success border-success/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                              }
                            >
                              {result.passStatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
