import { useState } from "react";
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
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

export default function FacultyNotices() {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("medium");
  const [targetRole, setTargetRole] = useState("student");
  const [loading, setLoading] = useState(false);

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
        title: "Notice Posted",
        description: "Notice has been published successfully",
      });

      setTitle("");
      setContent("");
      setPriority("medium");
      setTargetRole("student");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to post notice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="font-serif text-2xl font-bold">Post Notice</h1>

        <Input
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Notice content"
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
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="faculty">Faculty</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSubmit}
          variant="gradient"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Notice"}
        </Button>
      </div>
    </DashboardLayout>
  );
}
