import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roleLabels, UserRole } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  Users,
  BarChart3,
  ClipboardCheck,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Award,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ---------- TYPES ---------- */
interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

/* ---------- NAV CONFIG ---------- */
const roleNavItems: Record<UserRole, NavItem[]> = {
  student: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student' },
    { label: 'Attendance', icon: <Calendar size={20} />, path: '/student/attendance' },
    { label: 'Internal Marks', icon: <Award size={20} />, path: '/student/marks' },
    { label: 'Exam Schedule', icon: <FileText size={20} />, path: '/student/exams' },
    { label: 'Faculty Feedback', icon: <MessageSquare size={20} />, path: '/student/feedback' },
    { label: 'Grievances', icon: <AlertTriangle size={20} />, path: '/student/grievances' },
    { label: 'Notices', icon: <Bell size={20} />, path: '/student/notices' },
  ],
  faculty: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/faculty' },
    { label: 'Internal Marks', icon: <FileText size={20} />, path: '/faculty/marks' },
    { label: 'Feedback Reports', icon: <BarChart3 size={20} />, path: '/faculty/feedback' },
    { label: 'Post Notice', icon: <Bell size={20} />, path: '/faculty/notices' },
  ],
  hod: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/hod' },
    { label: 'Student Performance', icon: <GraduationCap size={20} />, path: '/hod/performance' },
    { label: 'Timetable', icon: <Calendar size={20} />, path: '/hod/timetable' },
    { label: 'Grievances', icon: <AlertTriangle size={20} />, path: '/hod/grievances' },
    { label: 'Faculty', icon: <Users size={20} />, path: '/hod/faculty' },
  ],
  principal: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/principal' },
    { label: 'Announcements', icon: <Bell size={20} />, path: '/principal/announcements' },
    { label: 'Curriculum Subjects', icon: <BookOpen size={20} />, path: '/principal/subjects' },
    { label: 'Grievances', icon: <AlertTriangle size={20} />, path: '/principal/grievances' },
    { label: 'Reports', icon: <BarChart3 size={20} />, path: '/principal/reports' },
  ],
  coe: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/coe' },
    { label: 'Exam Schedule', icon: <Calendar size={20} />, path: '/coe/schedule' },
    { label: 'Results', icon: <Award size={20} />, path: '/coe/results' },
    { label: 'Grievances', icon: <AlertTriangle size={20} />, path: '/coe/grievances' },
  ],
  admin: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { label: 'Manage Users', icon: <Users size={20} />, path: '/admin/users' },
  ],
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const role = user?.role || (localStorage.getItem('role') as UserRole);

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const navItems = roleNavItems[role];

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
                <GraduationCap size={22} />
              </div>
              <span className="font-serif font-bold text-white">Portal</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
                  !sidebarOpen && "justify-center"
                )}
              >
                {item.icon}
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2 text-sidebar-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className={cn("flex-1 transition-all", sidebarOpen ? "ml-64" : "ml-20")}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
