import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockUsers, mockNotices, mockGrievances, roleLabels, UserRole } from '@/data/mockData';
import { Users, Bell, MessageSquare, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const roleBadgeColors: Record<UserRole, string> = {
  student: 'bg-primary/10 text-primary border-primary/20',
  faculty: 'bg-accent/10 text-accent border-accent/20',
  hod: 'bg-warning/10 text-warning border-warning/20',
  principal: 'bg-destructive/10 text-destructive border-destructive/20',
  coe: 'bg-success/10 text-success border-success/20',
  admin: 'bg-primary/10 text-primary border-primary/20',
};

export default function AdminDashboard() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();

  const handleAddUser = () => {
    setIsAddUserOpen(false);
    toast({
      title: "User Added",
      description: "New user has been created successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-serif text-2xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-primary-foreground/80">
            Manage users, roles, notices, and system settings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <StatCard
            title="Total Users"
            value={mockUsers.length}
            subtitle="Registered users"
            icon={<Users size={24} />}
            trend={{ value: 15, isPositive: true }}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Active Notices"
            value={mockNotices.length}
            subtitle="Published announcements"
            icon={<Bell size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />
          <StatCard
            title="Open Complaints"
            value={mockGrievances.filter(g => g.status !== 'resolved').length}
            subtitle="Pending resolution"
            icon={<MessageSquare size={24} />}
            iconClassName="bg-warning/10 text-warning"
          />
          <StatCard
            title="System Status"
            value="Online"
            subtitle="All services running"
            icon={<Settings size={24} />}
            iconClassName="bg-success/10 text-success"
          />
        </div>

        {/* User Management */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-semibold text-lg text-foreground">User Management</h3>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient" size="sm">
                  <Plus size={16} />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif">Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabels).map(([role, label]) => (
                          <SelectItem key={role} value={role}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="ec">Electronics</SelectItem>
                        <SelectItem value="me">Mechanical</SelectItem>
                        <SelectItem value="ce">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddUser} variant="gradient" className="w-full">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleBadgeColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto py-6 flex-col gap-3">
            <Bell size={28} className="text-primary" />
            <span className="font-medium">Post Global Notice</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-3">
            <MessageSquare size={28} className="text-accent" />
            <span className="font-medium">View All Complaints</span>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col gap-3">
            <Settings size={28} className="text-warning" />
            <span className="font-medium">System Settings</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
