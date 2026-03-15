import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/api";

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS"];
const YEARS = ["1", "2", "3", "4"];

export default function CoESchedule() {
    const { toast } = useToast();
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const defaultForm = {
        subjectCode: "",
        subject: "",
        date: "",
        time: "",
        duration: "3 hours",
        venue: "",
        department: "",
        year: "",
        semester: "1"
    };

    const [formData, setFormData] = useState(defaultForm);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const res = await api.get('/exams');
            setSchedules(res.data);
        } catch (error) {
            console.error("Failed to fetch exam schedules", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);

            if (!formData.department || !formData.year) {
                toast({ title: "Validation Error", description: "Department and Year are required", variant: "destructive" });
                setSaving(false);
                return;
            }

            if (editingId) {
                await api.put(`/exams/${editingId}`, {
                    ...formData,
                    year: Number(formData.year),
                    semester: Number(formData.semester)
                });
                toast({ title: "Success", description: "Exam schedule successfully updated!" });
            } else {
                await api.post('/exams', {
                    ...formData,
                    year: Number(formData.year),
                    semester: Number(formData.semester)
                });
                toast({ title: "Success", description: "Exam schedule successfully created!" });
            }

            setIsDialogOpen(false);
            setEditingId(null);
            fetchSchedules();
            setFormData(defaultForm);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to save schedule", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (exam: any) => {
        setFormData({
            subjectCode: exam.subjectCode,
            subject: exam.subject,
            date: new Date(exam.date).toISOString().split('T')[0], // format for date input
            time: exam.time,
            duration: exam.duration,
            venue: exam.venue,
            department: exam.department,
            year: exam.year?.toString(),
            semester: exam.semester?.toString() || "1"
        });
        setEditingId(exam._id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this schedule?")) return;
        try {
            await api.delete(`/exams/${id}`);
            toast({ title: "Success", description: "Schedule deleted successfully" });
            fetchSchedules();
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to delete schedule", variant: "destructive" });
        }
    };

    const openCreateDialog = () => {
        setFormData(defaultForm);
        setEditingId(null);
        setIsDialogOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-foreground">Exam Schedule</h1>
                        <p className="text-muted-foreground">Manage upcoming examination timetables</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateDialog}>Upload New Schedule</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Edit Exam Schedule" : "Add Exam Schedule"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject Code</label>
                                        <Input name="subjectCode" value={formData.subjectCode} onChange={handleInputChange} placeholder="e.g. CS101" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject Name</label>
                                        <Input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="e.g. Data Structures" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date</label>
                                        <Input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Time</label>
                                        <Input name="time" value={formData.time} onChange={handleInputChange} placeholder="e.g. 09:00 AM" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department</label>
                                        <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
                                            <SelectContent>
                                                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Year</label>
                                        <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                            <SelectContent>
                                                {YEARS.map(y => <SelectItem key={y} value={y}>Year {y}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Duration</label>
                                        <Input name="duration" value={formData.duration} onChange={handleInputChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Venue</label>
                                        <Input name="venue" value={formData.venue} onChange={handleInputChange} placeholder="e.g. Exam Hall A" required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={saving}>
                                    {saving ? "Creating..." : "Save Schedule"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-full min-h-[400px]">
                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Subject Code</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Venue</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedules.length > 0 ? (
                                    schedules.map((exam) => (
                                        <TableRow key={exam._id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">{exam.subjectCode}</TableCell>
                                            <TableCell>{exam.subject}</TableCell>
                                            <TableCell>{exam.department}</TableCell>
                                            <TableCell>Yr {exam.year}</TableCell>
                                            <TableCell>
                                                {new Date(exam.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    timeZone: 'UTC'
                                                })}
                                            </TableCell>
                                            <TableCell>{exam.time}</TableCell>
                                            <TableCell>{exam.duration}</TableCell>
                                            <TableCell>{exam.venue}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`bg-${exam.status === 'Completed' ? 'muted' : 'success'}/10 text-${exam.status === 'Completed' ? 'muted-foreground' : 'success'} border-${exam.status === 'Completed' ? 'border' : 'success'}/20`}>
                                                    {exam.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(exam)}>
                                                    <Edit size={16} className="text-primary" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(exam._id)}>
                                                    <Trash2 size={16} className="text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                            No exam schedules found. Click "Upload New Schedule" to create one.
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
