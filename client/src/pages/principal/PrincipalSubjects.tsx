import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/api/api";

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MANAGEMENT", "COE", "AIDS"];
const YEARS = ["1", "2", "3", "4"];
const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function PrincipalSubjects() {
    const { toast } = useToast();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Filters
    const [filterDept, setFilterDept] = useState("ALL");
    const [filterYear, setFilterYear] = useState("ALL");
    const [filterSem, setFilterSem] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const defaultForm = {
        subjectCode: "",
        subjectName: "",
        department: "CSE",
        year: "1",
        semester: "1",
        credits: "3"
    };

    const [formData, setFormData] = useState(defaultForm);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const res = await api.get('/subjects');
            setSubjects(res.data);
        } catch (error) {
            console.error("Failed to fetch subjects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);

            const payload = {
                ...formData,
                year: Number(formData.year),
                semester: Number(formData.semester),
                credits: Number(formData.credits)
            };

            if (editingId) {
                await api.put(`/subjects/${editingId}`, payload);
                toast({ title: "Success", description: "Subject successfully updated!" });
            } else {
                await api.post('/subjects', payload);
                toast({ title: "Success", description: "Subject successfully created!" });
            }

            setIsDialogOpen(false);
            setEditingId(null);
            fetchSubjects();
            setFormData(defaultForm);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to save subject", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (sub: any) => {
        setFormData({
            subjectCode: sub.subjectCode,
            subjectName: sub.subjectName,
            department: sub.department,
            year: sub.year?.toString(),
            semester: sub.semester?.toString(),
            credits: sub.credits?.toString()
        });
        setEditingId(sub._id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subject?")) return;
        try {
            await api.delete(`/subjects/${id}`);
            toast({ title: "Success", description: "Subject deleted successfully" });
            fetchSubjects();
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to delete subject", variant: "destructive" });
        }
    };

    const openCreateDialog = () => {
        setFormData(defaultForm);
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const filteredSubjects = subjects.filter((s) => {
        if (filterDept !== "ALL" && s.department !== filterDept) return false;
        if (filterYear !== "ALL" && s.year?.toString() !== filterYear) return false;
        if (filterSem !== "ALL" && s.semester?.toString() !== filterSem) return false;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return s.subjectCode.toLowerCase().includes(q) || s.subjectName.toLowerCase().includes(q);
        }
        return true;
    });

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-foreground">Manage Curriculum Subjects</h1>
                        <p className="text-muted-foreground">Add, update, and organize institutional subjects</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateDialog} variant="gradient">
                                <Plus size={16} className="mr-2" />
                                Add New Subject
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject Code</label>
                                    <Input name="subjectCode" value={formData.subjectCode} onChange={handleInputChange} placeholder="e.g. CS101" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject Name</label>
                                    <Input name="subjectName" value={formData.subjectName} onChange={handleInputChange} placeholder="e.g. Data Structures" required />
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
                                        <label className="text-sm font-medium">Semester</label>
                                        <Select value={formData.semester} onValueChange={(v) => setFormData({ ...formData, semester: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                                            <SelectContent>
                                                {SEMESTERS.map(s => <SelectItem key={s} value={s}>Sem {s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Credits</label>
                                        <Input name="credits" type="number" min="1" max="10" value={formData.credits} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-4" disabled={saving}>
                                    {saving ? "Saving..." : "Save Subject"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b flex flex-col sm:flex-row gap-3 bg-muted/20">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                placeholder="Search subject code or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2">
                            <Select value={filterDept} onValueChange={setFilterDept}>
                                <SelectTrigger className="w-[120px] bg-white"><SelectValue placeholder="Dept" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Depts</SelectItem>
                                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select value={filterYear} onValueChange={setFilterYear}>
                                <SelectTrigger className="w-[110px] bg-white"><SelectValue placeholder="Year" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Years</SelectItem>
                                    {YEARS.map(y => <SelectItem key={y} value={y}>Year {y}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select value={filterSem} onValueChange={setFilterSem}>
                                <SelectTrigger className="w-[110px] bg-white"><SelectValue placeholder="Sem" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Sems</SelectItem>
                                    {SEMESTERS.map(s => <SelectItem key={s} value={s}>Sem {s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-[400px]">
                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Subject Code</TableHead>
                                    <TableHead>Subject Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSubjects.length > 0 ? (
                                    filteredSubjects.map((sub) => (
                                        <TableRow key={sub._id} className="hover:bg-muted/30">
                                            <TableCell className="font-semibold text-primary">{sub.subjectCode}</TableCell>
                                            <TableCell className="font-medium">{sub.subjectName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-muted/50">{sub.department}</Badge>
                                            </TableCell>
                                            <TableCell>Year {sub.year}</TableCell>
                                            <TableCell>Sem {sub.semester}</TableCell>
                                            <TableCell>{sub.credits}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(sub)}>
                                                    <Edit size={16} className="text-primary" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(sub._id)}>
                                                    <Trash2 size={16} className="text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            No subjects found matching your filters.
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
