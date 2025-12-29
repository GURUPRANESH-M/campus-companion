import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  mockUsers,
  mockNotices,
  mockGrievances,
  roleLabels,
  UserRole,
} from "@/data/mockData";
import {
  Users,
  Bell,
  MessageSquare,
  Settings,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

/* ---------- SAFE ROLE COLORS ---------- */
const roleBadgeColors: Record<UserRole, string> = {
  student: "bg-primary/10 text-primary border-primary/20",
  faculty: "bg-accent/10 text-accent border-accent/20",
  hod: "bg-warning/10 text-warning border-warning/20",
  principal: "bg-destructive/10 text-destructive border-destructive/20",
  coe: "bg-success/10 text-success border-success/20",
  admin: "bg-primary/10 text-primary border-primary/20",
};

export default function AdminDashboard() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();

  /* ---------- HARD SAFETY GUARDS ---------- */
  const users = Array.isArray(mockUsers) ? mockUsers : [];
  const notices = Array.isArray(mockNotices) ? mockNotices : [];
  const grievances = Array.isArray(mockGrievances) ? mockGrievances : [];

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
        {/* Welcome */}
        <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-serif text-2xl font-bold">
            Admin Dashboard
          </h1>
          <p className="opacity-80">
            Manage users, roles, notices, and system settings
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-grid">
          <StatCard
            title="Total Users"
            value={users.length}
            subtitle="Registered users"
            icon={<Users size={24} />}
            iconClassName="bg-primary/10 text-primary"
          />
          <StatCard
            title="Active Notices"
            value={notices.length}
            subtitle="Published announcements"
            icon={<Bell size={24} />}
            iconClassName="bg-accent/10 text-accent"
          />
          <StatCard
            title="Open Complaints"
            value={grievances.filter(
              (g: any) => g?.status !== "resolved"
            ).length}
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
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between">
            <h3 className="font-serif font-semibold text-lg">
              User Management
            </h3>

            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient" size="sm">
                  <Plus size={16} />
                  Add User
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <Label>Full Name</Label>
                  <Input />

                  <Label>Email</Label>
                  <Input type="email" />

                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([role, label]) => (
                        <SelectItem key={role} value={role}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={handleAddUser} className="w-full">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={roleBadgeColors[user.role]}
                    >
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost">
                      <Edit size={14} />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 size={14} />
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
