import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GrievanceCard } from '@/components/dashboard/GrievanceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockGrievances, Grievance } from '@/data/mockData';
import { Plus, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categories = ['Academic', 'Infrastructure', 'Examination', 'Hostel', 'Library', 'Other'];

export default function StudentGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>(mockGrievances);
  const [isOpen, setIsOpen] = useState(false);
  const [newGrievance, setNewGrievance] = useState({
    title: '',
    description: '',
    category: '',
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newGrievance.title || !newGrievance.description || !newGrievance.category) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    const grievance: Grievance = {
      id: `GRV${String(grievances.length + 1).padStart(3, '0')}`,
      title: newGrievance.title,
      description: newGrievance.description,
      category: newGrievance.category,
      status: 'pending',
      submittedBy: 'Rahul Sharma',
      submittedDate: new Date().toISOString().split('T')[0],
      department: 'Computer Science',
    };

    setGrievances([grievance, ...grievances]);
    setNewGrievance({ title: '', description: '', category: '' });
    setIsOpen(false);
    toast({
      title: "Grievance Submitted",
      description: "Your grievance has been submitted successfully.",
    });
  };

  const pendingCount = grievances.filter(g => g.status === 'pending').length;
  const inProgressCount = grievances.filter(g => g.status === 'in-progress').length;
  const resolvedCount = grievances.filter(g => g.status === 'resolved').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Grievances</h1>
            <p className="text-muted-foreground">Submit and track your complaints</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus size={18} />
                New Grievance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif">Submit New Grievance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Brief title of your grievance"
                    value={newGrievance.title}
                    onChange={(e) => setNewGrievance({ ...newGrievance, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={newGrievance.category} 
                    onValueChange={(value) => setNewGrievance({ ...newGrievance, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your grievance in detail..."
                    value={newGrievance.description}
                    onChange={(e) => setNewGrievance({ ...newGrievance, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmit} variant="gradient" className="w-full">
                  <Send size={18} />
                  Submit Grievance
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-warning/10 rounded-xl p-5 border border-warning/20">
            <p className="text-sm font-medium text-warning mb-1">Pending</p>
            <p className="text-2xl font-bold text-warning">{pendingCount}</p>
          </div>
          <div className="bg-primary/10 rounded-xl p-5 border border-primary/20">
            <p className="text-sm font-medium text-primary mb-1">In Progress</p>
            <p className="text-2xl font-bold text-primary">{inProgressCount}</p>
          </div>
          <div className="bg-success/10 rounded-xl p-5 border border-success/20">
            <p className="text-sm font-medium text-success mb-1">Resolved</p>
            <p className="text-2xl font-bold text-success">{resolvedCount}</p>
          </div>
        </div>

        {/* Grievances List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grievances.map((grievance) => (
            <GrievanceCard key={grievance.id} grievance={grievance} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
