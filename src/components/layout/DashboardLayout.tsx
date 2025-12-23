import { ReactNode } from 'react';
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
  BookOpen,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  student: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student' },
    { label: 'Attendance', icon: <Calendar size={20} />, path: '/student/attendance' },
    { label: 'Internal Marks', icon: <Award size={20} />, path: '/student/marks' },
    { label: 'Faculty Feedback', icon: <MessageSquare size={20} />, path: '/student/feedback' },
    { label: 'Grievances', icon: <AlertTriangle size={20} />, path: '/student/grievances' },
    { label: 'Notices', icon: <Bell size={20} />, path: '/student/notices' },
  ],
  faculty: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/faculty' },
    { label: 'Mark Attendance', icon: <ClipboardCheck size={20} />, path: '/faculty/attendance' },
    { label: 'Internal Marks', icon: <FileText size={20} />, path: '/faculty/marks' },
    { label: 'Feedback Reports', icon: <BarChart3 size={20} />, path: '/faculty/feedback' },
    { label: 'Post Notice', icon: <Bell size={20} />, path: '/faculty/notices' },
  ],
  hod: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/hod' },
    { label: 'Student Performance', icon: <GraduationCap size={20} />, path: '/hod/performance' },
    { label: 'Grievances', icon: <AlertTriangle size={20} />, path: '/hod/grievances' },
    { label: 'Faculty', icon: <Users size={20} />, path: '/hod/faculty' },
  ],
  principal: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/principal' },
    { label: 'Announcements', icon: <Bell size={20} />, path: '/principal/announcements' },
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
    { label: 'Notices', icon: <Bell size={20} />, path: '/admin/notices' },
    { label: 'Complaints', icon: <MessageSquare size={20} />, path: '/admin/complaints' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ],
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return null;
  }

  const navItems = roleNavItems[user.role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <GraduationCap className="text-primary-foreground" size={24} />
              </div>
              <span className="font-serif font-bold text-lg text-sidebar-foreground">CMS</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* User Info */}
        <div className={cn(
          "px-4 py-4 border-b border-sidebar-border",
          !sidebarOpen && "flex justify-center"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/60">{roleLabels[user.role]}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  !sidebarOpen && "justify-center px-2"
                )}
              >
                {item.icon}
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-sidebar-foreground/80 hover:bg-destructive/20 hover:text-destructive",
              !sidebarOpen && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            {user.department && (
              <p className="text-sm text-muted-foreground">{user.department}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
