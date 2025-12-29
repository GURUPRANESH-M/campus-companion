import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NoticeCard } from "@/components/dashboard/NoticeCard";
import api from "@/api/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Notice = {
  _id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
  postedBy?: string;
};

export default function StudentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/notices")
      .then((res) => setNotices(res.data))
      .catch(() => alert("Failed to load notices"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading notices...</p>
      </DashboardLayout>
    );
  }

  /* ---------- SAFE FILTERS ---------- */
  const allNotices = notices;
  const highPriority = notices.filter((n) => n.priority === "high");
  const mediumPriority = notices.filter((n) => n.priority === "medium");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Notices & Announcements
          </h1>
          <p className="text-muted-foreground">
            Stay updated with the latest information
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              All ({allNotices.length})
            </TabsTrigger>
            <TabsTrigger value="high">
              Important ({highPriority.length})
            </TabsTrigger>
            <TabsTrigger value="medium">
              Updates ({mediumPriority.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allNotices.map((notice, index) => (
                <div
                  key={notice._id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <NoticeCard notice={notice} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highPriority.map((notice) => (
                <NoticeCard key={notice._id} notice={notice} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="medium" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediumPriority.map((notice) => (
                <NoticeCard key={notice._id} notice={notice} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
