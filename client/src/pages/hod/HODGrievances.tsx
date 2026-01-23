import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Grievance = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  student: {
    name: string;
    email: string;
  };
};

export default function HODGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrievances = () => {
    api
      .get("/hod/grievances")
      .then((res) => setGrievances(res.data))
      .catch(() => alert("Failed to load grievances"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/hod/grievances/${id}`, { status });
      fetchGrievances();
    } catch {
      alert("Failed to update status");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-success border-success";
      case "in-progress":
        return "text-warning border-warning";
      default:
        return "text-destructive border-destructive";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading grievances...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold">
            Department Grievances
          </h1>
          <p className="text-muted-foreground">
            Review and resolve student grievances
          </p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Student</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {grievances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No grievances found
                  </TableCell>
                </TableRow>
              )}

              {grievances.map((g) => (
                <TableRow key={g._id}>
                  <TableCell>
                    <p className="font-medium">{g.student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {g.student.email}
                    </p>
                  </TableCell>
                  <TableCell>{g.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColor(g.status)}
                    >
                      {g.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(g.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      onValueChange={(value) =>
                        updateStatus(g._id, value)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">
                          In Progress
                        </SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
