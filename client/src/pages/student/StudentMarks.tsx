import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function StudentMarks() {
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await api.get("/internal-marks/me");
        setMarks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading marks...</p>
      </DashboardLayout>
    );
  }

  // ===== Group by Subject =====
  const groupedMarks = marks.reduce((acc: any, mark: any) => {
    if (!acc[mark.subject]) {
      acc[mark.subject] = [];
    }
    acc[mark.subject].push(mark);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="font-serif text-2xl font-bold">Internal Marks</h1>

        {Object.keys(groupedMarks).length === 0 && (
          <p className="text-muted-foreground">No marks available</p>
        )}

        {Object.entries(groupedMarks).map(([subject, records]: any) => {
          const chartData = records.map((r: any) => ({
            exam: r.examType,
            score: r.score,
            max: r.maxScore,
          }));

          return (
            <div
              key={subject}
              className="bg-card border rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">{subject}</h2>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="score"
                      fill="hsl(224, 71%, 40%)"
                      name="Score"
                    />
                    <Bar
                      dataKey="max"
                      fill="hsl(38, 92%, 50%)"
                      name="Max Marks"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
