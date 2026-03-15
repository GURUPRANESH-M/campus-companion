import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

export default function CoEResults() {
  const { toast } = useToast();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/results');
      setResults(res.data);
    } catch (error) {
      console.error("Failed to fetch results", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAll = async () => {
    try {
      setPublishing(true);
      await api.post('/results/publish');
      toast({ title: "Success", description: "All pending results published successfully" });
      fetchResults(); // Refresh list to update badge statuses
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to publish", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        // Simple heuristic: if line 0 contains "reg" skip it as a header
        let startIndex = 0;
        if (lines.length > 0 && lines[0].toLowerCase().includes('reg')) {
          startIndex = 1;
        }

        const payload = [];
        for (let i = startIndex; i < lines.length; i++) {
          const parts = lines[i].split(',');
          if (parts.length >= 3) {
            payload.push({
              regNo: parts[0].trim(),
              subjectCode: parts[1].trim(),
              externalMarks: Number(parts[2].trim())
            });
          }
        }

        if (payload.length === 0) {
          toast({ title: "Validation Error", description: "Could not find valid data. Format should be: regNo, subjectCode, externalMarks", variant: "destructive" });
          return;
        }

        await api.post('/results/upload', payload);
        toast({ title: "Success", description: "Results uploaded and processed successfully!" });
        fetchResults();
      } catch (error: any) {
        toast({ title: "Upload Failed", description: error.response?.data?.message || "Failed to process CSV file (Check your RegNos)", variant: "destructive" });
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-foreground">Examination Results</h1>
            <p className="text-muted-foreground">Upload and manage student grades and marks</p>
          </div>
          <div className="flex gap-3">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Results CSV"}
            </Button>
            <Button variant="gradient" disabled={publishing} onClick={handlePublishAll}>
              {publishing ? "Publishing..." : "Publish Pending Results"}
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[400px]">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="px-6 py-4">Register No</TableHead>
                  <TableHead className="px-6 py-4">Student Name</TableHead>
                  <TableHead className="px-6 py-4">Subject Code</TableHead>
                  <TableHead className="px-6 py-4 border-l">Int. Marks</TableHead>
                  <TableHead className="px-6 py-4">Ext. Marks</TableHead>
                  <TableHead className="px-6 py-4 border-r">Total</TableHead>
                  <TableHead className="px-6 py-4">Grade</TableHead>
                  <TableHead className="px-6 py-4 text-center">Status</TableHead>
                  <TableHead className="px-6 py-4 text-right">Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length > 0 ? (
                  results.map((res: any) => (
                    <TableRow key={res._id} className="hover:bg-muted/30">
                      <TableCell className="px-6 font-medium text-primary">
                        {res.student?.regNo || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 font-medium">
                        {res.student?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="px-6 text-muted-foreground">
                        {res.subjectCode}
                      </TableCell>
                      <TableCell className="px-6 border-l text-center">
                        {res.internalMarks}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        {res.externalMarks}
                      </TableCell>
                      <TableCell className="px-6 border-r text-center font-semibold text-foreground">
                        {res.totalMarks}
                      </TableCell>
                      <TableCell className="px-6 text-center font-bold">
                        {res.grade}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${res.passStatus === 'Pass'
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                          }`}>
                          {res.passStatus}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        {res.published ? (
                          <Badge variant="outline" className="bg-success/5 text-success border-success/20">Yes</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-warning/5 text-warning border-warning/20">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground space-y-3">
                      <p>No results records found.</p>
                      <p className="text-sm">Upload a results CSV to populate this table.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
