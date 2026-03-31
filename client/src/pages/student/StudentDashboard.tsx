import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Calendar, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loadingAtt, setLoadingAtt] = useState(true);
  
  const [curriculumSubjects, setCurriculumSubjects] = useState(0);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    api
      .get("/attendance/my")
      .then((res) => {
        const records = res.data;
        const map: Record<string, any> = {};

        records.forEach((r: any) => {
          if (!map[r.subject]) {
            map[r.subject] = {
              totalClasses: 0,
              attended: 0,
            };
          }
          map[r.subject].totalClasses += 1;
          if (r.status === "present") {
            map[r.subject].attended += 1;
          }
        });

        const finalData = Object.values(map).map((s: any) => ({
          ...s,
          percentage: Math.round((s.attended / s.totalClasses) * 100),
        }));

        setAttendance(finalData);
      })
      .catch((err) => console.error("Failed to load attendance", err))
      .finally(() => setLoadingAtt(false));
  }, []);

  /* ---------- CALCULATE ATTENDANCE ---------- */
  const avgAttendance =
    attendance.length > 0
      ? Math.round(
          attendance.reduce((acc, curr) => acc + curr.percentage, 0) /
            attendance.length
        )
      : 0;

  const totalSubjects = 18;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-serif text-2xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>

          <p className="text-primary-foreground/80">
            Track your academic attendance overview.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="dashboard-grid">

          {/* Attendance */}
          <StatCard
            title="Overall Attendance"
            value={loadingAtt ? "..." : `${avgAttendance}%`}
            subtitle="Across all subjects"
            icon={<Calendar size={24} />}
            iconClassName="bg-primary/10 text-primary"
          />

          {/* Subjects */}
          <StatCard
            title="Total Subjects"
            value={totalSubjects}
            subtitle="Curriculum"
            icon={<BookOpen size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />

        </div>

      </div>
    </DashboardLayout>
  );
}