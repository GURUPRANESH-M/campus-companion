import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GrievanceCard } from "@/components/dashboard/GrievanceCard";
import { Loader2 } from "lucide-react";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

export default function CoEGrievances() {
  const { toast } = useToast();
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await api.get('/exam-grievances');
      setGrievances(res.data);
    } catch (error) {
      console.error("Failed to fetch exam grievances", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, remarks: string) => {
    try {
      await api.put(`/exam-grievances/${id}/resolve`, { remarks });
      toast({ title: "Success", description: "Examination Grievance marked as resolved." });
      setGrievances(prev => prev.map(g => g._id === id ? { ...g, status: 'resolved', remarks } : g));
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to resolve grievance", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">Examination Grievances</h1>
          <p className="text-muted-foreground">Review and resolve exam-related complaints (Revaluation, Marks)</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grievances.length > 0 ? (
              grievances.map((grievance: any) => (
                <GrievanceCard 
                  key={grievance._id} 
                  grievance={{
                    id: grievance._id,
                    studentName: grievance.student?.name || "Unknown",
                    title: grievance.title,
                    description: grievance.description,
                    status: grievance.status,
                    date: new Date(grievance.createdAt).toLocaleDateString(),
                    category: grievance.category,
                    department: grievance.department
                  }} 
                  onUpdateStatus={(_newStatus: string, remarks?: string) => {
                    handleResolve(grievance._id, remarks || "");
                  }}
                />
              ))
            ) : (
              <div className="col-span-full bg-card rounded-xl border p-12 text-center text-muted-foreground shadow-sm">
                No active examination grievances found at this time.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
