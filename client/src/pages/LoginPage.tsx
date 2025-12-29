import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole, roleLabels } from '@/data/mockData';
import { GraduationCap, User, Lock, ChevronRight } from 'lucide-react';
import api from '@/api/api';

const roleOptions: { role: UserRole; description: string; icon: string }[] = [
  { role: 'student', description: 'Access attendance, marks, and submit feedback', icon: '🎓' },
  { role: 'faculty', description: 'Mark attendance and upload internal marks', icon: '👨‍🏫' },
  { role: 'hod', description: 'Manage department and review performance', icon: '📊' },
  { role: 'principal', description: 'Institute-wide dashboard and announcements', icon: '🏛️' },
  { role: 'coe', description: 'Manage examinations and results', icon: '📝' },
  { role: 'admin', description: 'Full system administration access', icon: '⚙️' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("LOGIN CLICKED", email, password);
  
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
  
      console.log("LOGIN RESPONSE", res.data);
  
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
  
      console.log("REDIRECTING TO", `/${res.data.user.role}`);
  
      navigate(`/${res.data.user.role}`);
    } catch (err: any) {
      console.error("LOGIN ERROR", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <GraduationCap size={36} />
            </div>
            <h1 className="font-serif text-4xl font-bold">CMS</h1>
          </div>
          <h2 className="font-serif text-5xl font-bold mb-6">
            College Management<br />System
          </h2>
          <p className="text-xl opacity-80 max-w-md">
            A unified platform for managing academics and institutional workflows.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          {/* Role Selection (UI only) */}
          <div className="mb-6">
            <Label className="mb-3 block">Select Role</Label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => setSelectedRole(option.role)}
                  className={`p-4 rounded-xl border-2 text-left ${
                    selectedRole === option.role
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl block">{option.icon}</span>
                  <p className="text-sm font-medium">{roleLabels[option.role]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
            >
              Sign In
              <ChevronRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Backend decides access based on your account role
          </p>
        </div>
      </div>
    </div>
  );
}
