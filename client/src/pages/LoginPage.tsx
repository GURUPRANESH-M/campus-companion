import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole, roleLabels } from '@/data/mockData';
import { User, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';
import api from '@/api/api';
import { useToast } from "@/hooks/use-toast";

const roleOptions: { role: UserRole; description: string; icon: string }[] = [
  { role: 'student', description: 'Student', icon: '🎓' },
  { role: 'faculty', description: 'Faculty', icon: '👨‍🏫' },
  { role: 'hod', description: 'HOD', icon: '📊' },
  { role: 'principal', description: 'Principal', icon: '🏛️' },
  { role: 'coe', description: 'COE', icon: '📝' },
  { role: 'admin', description: 'Admin', icon: '⚙️' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      login(res.data.user);
      navigate(`/${res.data.user.role}`);
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden relative">
      {/* Decorative Blob Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      {/* Top Navigation Bar with Logo */}
      <nav className="relative z-10 w-full bg-white border-b border-border px-6 py-4 flex items-center shadow-sm">
        <div className="flex items-center gap-5 max-w-7xl mx-auto w-full">
          <img
            src="/logo.png"
            alt="Dr. N.G.P. Institute of Technology Logo"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
          />
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary tracking-tight">
              Dr. N.G.P. Institute of Technology
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium tracking-wider">
              AUTONOMOUS | COIMBATORE
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-border overflow-hidden backdrop-blur-sm">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold mb-2 text-slate-800">Welcome</h2>
              <p className="text-muted-foreground font-medium">Please sign in to your role account</p>
            </div>

            {/* Role Selection */}
            <div className="mb-8">
              <Label className="mb-3 block text-sm font-semibold text-slate-700">Select Access Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => setSelectedRole(option.role)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${selectedRole === option.role
                        ? 'border-primary bg-primary/5 shadow-sm transform scale-[1.03]'
                        : 'border-transparent bg-slate-50 hover:bg-slate-100'
                      }`}
                  >
                    <span className="text-2xl mb-1.5">{option.icon}</span>
                    <p className={`text-xs font-semibold ${selectedRole === option.role ? 'text-primary' : 'text-slate-600'}`}>
                      {roleLabels[option.role]}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-slate-50 border-transparent focus:border-primary focus:bg-white transition-all ring-0 focus-visible:ring-1"
                    placeholder="Enter your institutional email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-slate-50 border-transparent focus:border-primary focus:bg-white transition-all ring-0 focus-visible:ring-1"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full h-12 text-base font-semibold mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl"
              >
                Sign In
                <ChevronRight size={18} className="ml-2 opacity-80" />
              </Button>
            </form>
          </div>

          {/* Footer Line */}
          <div className="bg-slate-50/80 p-5 text-center border-t border-border">
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              A Unified Platform for Institutional Workflows
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
