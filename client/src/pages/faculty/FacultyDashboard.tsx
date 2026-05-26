import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/api";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function FacultyDashboard() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const [scheduleRes, profileRes] = await Promise.all([
        api.get("/faculty/today"),
        api.get("/faculty/profile")
      ]);
      setSchedule(scheduleRes.data);
      setProfile(profileRes.data);
    } catch (error) {
      console.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const periods = [1,2,3,4,5,6,7];

  const getPeriodData = (period: number) => {
    return schedule.find(p => p.period === period);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Profile */}
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <h1 className="text-2xl font-bold">
            {profile?.name || user?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Department: <span className="font-medium text-foreground">{profile?.department || user?.department || "N/A"}</span>
          </p>
        </div>

        {/* Weekly Timetable */}
        <Button
          className="mt-4 w-full md:w-auto"
          onClick={() => navigate('/faculty/timetable')}
        >
          My Weekly Timetable
        </Button>

        {/* Today Schedule */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Today's Schedule
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {periods.map(period => {

                const data = getPeriodData(period);

                return (
                  <Card
                    key={period}
                    className={`p-4 cursor-pointer transition ${
                      data
                        ? "border-primary bg-primary/5"
                        : "bg-muted/40"
                    }`}
                    onClick={() => {
                      if (data) {
                        navigate(`/faculty/attendance/${data._id}`);
                      }
                    }}
                  >
                    <p className="font-semibold">
                      Period {period}
                    </p>

                    {data ? (
                      <>
                        <p className="mt-2">
                          {data.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {data.department} - {data.year}{data.section}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground mt-2">
                        Free Hour
                      </p>
                    )}

                  </Card>
                );
              })}

            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}