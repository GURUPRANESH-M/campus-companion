import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

/* ================= STUDENT PAGES ================= */
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentMarks from "./pages/student/StudentMarks";
import StudentFeedback from "./pages/student/StudentFeedback";
import StudentGrievances from "./pages/student/StudentGrievances";
import StudentNotices from "./pages/student/StudentNotices";

/* ================= FACULTY PAGES ================= */
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import FacultyMarks from "./pages/faculty/FacultyMarks";

/* ================= OTHER ROLES ================= */
import HODDashboard from "./pages/hod/HODDashboard";
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import CoEDashboard from "./pages/coe/CoEDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const role = user?.role || localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ================= LOGIN ================= */}
      <Route
        path="/"
        element={
          localStorage.getItem("token") && user ? (
            <Navigate to={`/${user.role}`} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* ================= STUDENT ================= */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/marks"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentMarks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/feedback"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentFeedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/grievances"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentGrievances />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notices"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentNotices />
          </ProtectedRoute>
        }
      />

      {/* ================= FACULTY ================= */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/attendance"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyAttendance />
          </ProtectedRoute>
        }
      />

      {/* ✅ THIS WAS MISSING */}
      <Route
        path="/faculty/marks"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyMarks />
          </ProtectedRoute>
        }
      />

      {/* ================= HOD ================= */}
      <Route
        path="/hod"
        element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <HODDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= PRINCIPAL ================= */}
      <Route
        path="/principal"
        element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= COE ================= */}
      <Route
        path="/coe"
        element={
          <ProtectedRoute allowedRoles={["coe"]}>
            <CoEDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
