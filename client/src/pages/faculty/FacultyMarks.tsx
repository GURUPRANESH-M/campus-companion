import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/api";

export default function FacultyMarks() {
  const [subject, setSubject] = useState("");
  const [studentId, setStudentId] = useState("");
  const [examType, setExamType] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !studentId || !examType || !score || !maxScore) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/internal-marks",
        {
          student: studentId,   // MongoDB student _id
          subject,
          examType,
          score: Number(score),
          maxScore: Number(maxScore),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Marks saved successfully");

      setSubject("");
      setStudentId("");
      setExamType("");
      setScore("");
      setMaxScore("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save marks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-xl">
        <h1 className="font-serif text-2xl font-bold">
          Enter Internal Marks
        </h1>

        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DBMS">DBMS</SelectItem>
            <SelectItem value="DS">Data Structures</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Student MongoDB ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <Select value={examType} onValueChange={setExamType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CAT1">CAT 1</SelectItem>
            <SelectItem value="CAT2">CAT 2</SelectItem>
            <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Max Score"
          value={maxScore}
          onChange={(e) => setMaxScore(e.target.value)}
        />

        <Button onClick={handleSubmit} variant="gradient" disabled={loading}>
          {loading ? "Saving..." : "Submit Marks"}
        </Button>
      </div>
    </DashboardLayout>
  );
}
