import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/api/api";

type Feedback = {
  _id: string;
  student: { name: string };
  subject: string;
  rating: number;
  comment?: string;
};

export default function FacultyFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/feedback/faculty")
      .then((res) => setFeedbacks(res.data))
      .catch(() => alert("Failed to load feedback"))
      .finally(() => setLoading(false));
  }, []);

  const grouped = feedbacks.reduce((acc: any, fb) => {
    if (!acc[fb.subject]) acc[fb.subject] = [];
    acc[fb.subject].push(fb);
    return acc;
  }, {});

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading feedback...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-bold">Feedback Reports</h1>

        {Object.keys(grouped).length === 0 && (
          <p className="text-muted-foreground">No feedback received yet</p>
        )}

        {Object.entries(grouped).map(([subject, list]: any) => {
          const avg =
            list.reduce((sum: number, f: any) => sum + f.rating, 0) /
            list.length;

          return (
            <div
              key={subject}
              className="bg-card border rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-2">{subject}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Average Rating: <strong>{avg.toFixed(1)} / 5</strong>
              </p>

              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Student</th>
                    <th className="text-left py-2">Rating</th>
                    <th className="text-left py-2">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((fb: Feedback) => (
                    <tr key={fb._id} className="border-b last:border-0">
                      <td className="py-2">{fb.student?.name}</td>
                      <td className="py-2">{fb.rating} / 5</td>
                      <td className="py-2">
                        {fb.comment || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
