import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole, roleLabels } from '@/data/mockData';
import { GraduationCap, User, Lock, ChevronRight } from 'lucide-react';

const roleOptions: { role: UserRole; description: string; icon: string }[] = [
  { role: 'student', description: 'Access attendance, marks, and submit feedback', icon: '🎓' },
  { role: 'faculty', description: 'Mark attendance and upload internal marks', icon: '👨‍🏫' },
  { role: 'hod', description: 'Manage department and review performance', icon: '📊' },
  { role: 'principal', description: 'Institute-wide dashboard and announcements', icon: '🏛️' },
  { role: 'coe', description: 'Manage examinations and results', icon: '📝' },
  { role: 'admin', description: 'Full system administration access', icon: '⚙️' },
];

const roleRoutes: Record<UserRole, string> = {
  student: '/student',
  faculty: '/faculty',
  hod: '/hod',
  principal: '/principal',
  coe: '/coe',
  admin: '/admin',
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      login(selectedRole);
      navigate(roleRoutes[selectedRole]);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap size={36} />
            </div>
            <h1 className="font-serif text-4xl font-bold">CMS</h1>
          </div>
          <h2 className="font-serif text-5xl font-bold leading-tight mb-6">
            College Management<br />System
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-md">
            A comprehensive platform for managing academic operations, student records, and institutional workflows.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            {[
              { label: 'Students', value: '2,500+' },
              { label: 'Faculty', value: '120+' },
              { label: 'Departments', value: '8' },
              { label: 'Courses', value: '45+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="text-primary-foreground" size={28} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground">College Management System</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Select your role and sign in to continue</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-foreground mb-3 block">Select Role</Label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => (
                <button
                  key={option.role}
                  onClick={() => setSelectedRole(option.role)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedRole === option.role
                      ? 'border-primary bg-primary/5 shadow-soft'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{option.icon}</span>
                  <p className="font-medium text-foreground text-sm">{roleLabels[option.role]}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={!selectedRole}
            >
              Sign In
              <ChevronRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Demo Mode: Select any role to explore the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
