import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bell } from "lucide-react";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

export default function PrincipalAnnouncements() {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("high");
  const [targetRole, setTargetRole] = useState("all");
  const [loading, setLoading] = useState(false);
  
  const [notices, setNotices] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchNotices = async () => {
    try {
      setFetching(true);
      const res = await api.get("/notices");
      setNotices(res.data);
    } catch (error) {
      console.error("Failed to fetch notices", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await api.post("/notices", {
        title,
        content,
        priority,
        targetRole,
      });

      toast({
        title: "Announcement Posted",
        description: "Announcement has been published successfully",
      });

      setTitle("");
      setContent("");
      setPriority("high");
      setTargetRole("all");
      fetchNotices();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to post announcement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Post college-wide announcements and notices.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Form */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-semibold">New Announcement</h2>
            
            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
              <Input
                placeholder="Announcement Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                placeholder="Detailed announcement content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={targetRole} onValueChange={setTargetRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Target Audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSubmit}
                variant="gradient"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Announcement"}
              </Button>
            </div>
          </div>

          {/* Previous Announcements */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Recent Announcements</h2>
            
            <div className="space-y-4">
              {fetching ? (
                 <div className="flex justify-center p-8">
                   <Loader2 className="animate-spin h-8 w-8 text-primary" />
                 </div>
              ) : notices.length === 0 ? (
                <div className="bg-card border rounded-xl p-8 flex flex-col items-center justify-center text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No announcements posted yet.</p>
                </div>
              ) : (
                notices.map((notice) => (
                  <Card key={notice._id}>
                    <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-lg font-bold">{notice.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          Posted by {notice.postedBy?.name || "Unknown"} • {new Date(notice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={
                          notice.priority === 'high' ? 'bg-destructive/10 text-destructive border-transparent' : 
                          notice.priority === 'low' ? 'bg-success/10 text-success border-transparent' : 
                          'bg-warning/10 text-warning border-transparent'
                        }>
                          {notice.priority}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {notice.targetRole}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{notice.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
