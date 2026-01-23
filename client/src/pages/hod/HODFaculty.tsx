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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Faculty = {
  _id: string;
  name: string;
  email: string;
  department?: string;
};

export default function HODFaculty() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/hod/faculty")
      .then((res) => setFacultyList(res.data))
      .catch(() => alert("Failed to load faculty list"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading faculty...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold">
            Faculty Management
          </h1>
          <p className="text-muted-foreground">
            View and monitor faculty in your department
          </p>
        </div>

        {/* Faculty Table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {facultyList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No faculty found
                  </TableCell>
                </TableRow>
              )}

              {facultyList.map((faculty) => (
                <TableRow key={faculty._id}>
                  <TableCell className="font-medium">
                    {faculty.name}
                  </TableCell>
                  <TableCell>{faculty.email}</TableCell>
                  <TableCell>{faculty.department || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-success border-success"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
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
