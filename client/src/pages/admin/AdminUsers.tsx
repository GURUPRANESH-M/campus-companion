import { useState, useEffect } from "react";
import axios from "axios";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { roleLabels, UserRole } from "@/data/mockData";
import { Plus, Edit, Trash2 } from "lucide-react";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";

/* ROLE COLORS */
const roleBadgeColors: Record<UserRole, string> = {
  student: "bg-primary/10 text-primary border-primary/20",
  faculty: "bg-accent/10 text-accent border-accent/20",
  hod: "bg-warning/10 text-warning border-warning/20",
  principal: "bg-destructive/10 text-destructive border-destructive/20",
  coe: "bg-success/10 text-success border-success/20",
  admin: "bg-primary/10 text-primary border-primary/20",
};

const departments = [
  "CSE",
  "IT",
  "EEE",
  "ECE",
  "MECH",
  "CIVIL",
];

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
    year: "",
    section: "",
  });

  const [selectedUser, setSelectedUser] = useState<any>(null);

  /* ===============================
     FETCH USERS
  ============================== */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users", error);
    }
  };

  /* ===============================
     CREATE USER
  ============================== */
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/admin/users",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Success",
        description: "User created successfully",
      });

      setIsAddOpen(false);

      fetchUsers();

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        department: "",
        year: "",
        section: "",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to create user",
        variant: "destructive",
      });
    }
  };

  /* ===============================
     DELETE USER
  ============================== */
  const handleDeleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.filter((u) => u._id !== id)
      );

      toast({
        title: "Deleted",
        description: "User deleted successfully",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  /* ===============================
     UPDATE USER
  ============================== */
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        selectedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id
            ? selectedUser
            : u
        )
      );

      setIsEditOpen(false);

      toast({
        title: "Updated",
        description: "User updated successfully",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to update user",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b flex justify-between">
          <h3 className="font-semibold text-lg">
            Manage Users
          </h3>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} /> Add User
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">

                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                />

                {/* ROLE */}
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(
                      ([role, label]) => (
                        <SelectItem key={role} value={role}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                {/* DEPARTMENT (Hidden for Principal/Admin/COE) */}
                {formData.role !== "principal" &&
                  formData.role !== "admin" &&
                  formData.role !== "coe" && (
                    <Select
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          department: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                {/* STUDENT EXTRA FIELDS */}
                {formData.role === "student" && (
                  <>
                    <Input
                      placeholder="Year"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: e.target.value,
                        })
                      }
                    />

                    <Input
                      placeholder="Section"
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          section: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                <Button onClick={handleAddUser} className="w-full">
                  Create
                </Button>

              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
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
                <TableCell>{user.department}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditOpen(true);
                    }}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      window.confirm("Delete this user?") &&
                      handleDeleteUser(user._id)
                    }
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-4">

              <Input
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    name: e.target.value,
                  })
                }
              />

              <Input
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    email: e.target.value,
                  })
                }
              />

              <Select
                value={selectedUser.role}
                onValueChange={(value) =>
                  setSelectedUser({
                    ...selectedUser,
                    role: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(
                    ([role, label]) => (
                      <SelectItem key={role} value={role}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Select
                value={selectedUser.department}
                onValueChange={(value) =>
                  setSelectedUser({
                    ...selectedUser,
                    department: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleUpdateUser} className="w-full">
                Update
              </Button>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}