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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Grievance = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  student: {
    name: string;
    email: string;
    department?: string;
  };
};

export default function PrincipalGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await api.get("/grievances");
      setGrievances(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/grievances/${id}`, { status });
      fetchGrievances();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-success border-success";
      case "in_progress":
        return "text-warning border-warning";
      case "escalated":
        return "text-destructive border-transparent bg-destructive/10";
      default:
        return "text-destructive border-destructive";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading escalated grievances...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold">
            Escalated Grievances
          </h1>
          <p className="text-muted-foreground">
            Review and resolve grievances escalated by Department HODs
          </p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Student</TableHead>
                <TableHead>Grievance Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grievances.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No escalated grievances found!
                  </TableCell>
                </TableRow>
              )}

              {grievances.map((g) => (
                <TableRow key={g._id}>
                  <TableCell>
                    <p className="font-medium">{g.student?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {g.student?.email}
                    </p>
                    {g.student?.department && <p className="text-[10px] text-muted-foreground font-semibold mt-1 uppercase tracking-wider">{g.student?.department}</p>}
                  </TableCell>

                  <TableCell 
                    className="max-w-[300px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                       setSelectedGrievance(g);
                       setIsDialogOpen(true);
                    }}
                  >
                    <p className="font-semibold text-foreground mb-1 hover:underline">{g.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {g.description}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className={statusColor(g.status)}>
                      {g.status === "escalated" ? "Escalated" : g.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(g.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <Select
                      defaultValue={g.status}
                      onValueChange={(value) => updateStatus(g._id, value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="escalated" disabled>Escalated</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedGrievance?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="outline" className={statusColor(selectedGrievance?.status || "")}>
                 {selectedGrievance?.status}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Submitted by: <span className="font-semibold text-foreground">{selectedGrievance?.student?.name}</span>
              </p>
            </div>
            <div className="bg-muted/30 p-4 rounded-md text-foreground leading-relaxed whitespace-pre-wrap">
              {selectedGrievance?.description}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
