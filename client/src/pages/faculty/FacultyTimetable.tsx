import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/api/api";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function FacultyTimetable() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/faculty/weekly");
        setSchedule(res.data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load timetable",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [1, 2, 3, 4, 5, 6, 7];

  const getCell = (day: string, period: number) => {
    return schedule.find((s) => s.day === day && s.period === period);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Weekly Timetable</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-auto border rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Day / Period</th>
                  {periods.map((p) => (
                    <th key={p} className="border p-2">P{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day}>
                    <td className="border p-2 font-semibold">{day}</td>
                    {periods.map((period) => {
                      const cell = getCell(day, period);
                      return (
                        <td key={period} className="border p-2">
                          {cell ? (
                            <Card className="p-2 bg-primary/5 border-primary">
                              <p className="font-semibold">{cell.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {cell.department} - {cell.year}{cell.section}
                              </p>
                              <p className="mt-1 text-xs">Teacher: {cell.faculty?.name || "—"}</p>
                            </Card>
                          ) : (
                            <p className="text-muted-foreground">Free</p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
