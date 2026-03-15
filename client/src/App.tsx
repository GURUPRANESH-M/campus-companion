import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import AdminUsers from "@/pages/admin/AdminUsers";
import HODTimetable from "./pages/hod/HODTimetable";


/* ================= STUDENT PAGES ================= */
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentMarks from "./pages/student/StudentMarks";
import StudentExams from "./pages/student/StudentExams";
import StudentFeedback from "./pages/student/StudentFeedback";
import StudentGrievances from "./pages/student/StudentGrievances";
import StudentNotices from "./pages/student/StudentNotices";

/* ================= FACULTY PAGES ================= */
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import FacultyMarks from "./pages/faculty/FacultyMarks";
import FacultyNotices from "./pages/faculty/FacultyNotices";
import FacultyFeedback from "./pages/faculty/FacultyFeedback";
import FacultyTimetable from "./pages/faculty/FacultyTimetable";
import HODStudentPerformance from "./pages/hod/HODStudentPerformance";


/* ================= OTHER ROLES ================= */
import HODDashboard from "./pages/hod/HODDashboard";
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import PrincipalAnnouncements from "./pages/principal/PrincipalAnnouncements";
import PrincipalSubjects from "./pages/principal/PrincipalSubjects";
import PrincipalGrievances from "./pages/principal/PrincipalGrievances";
import PrincipalReports from "./pages/principal/PrincipalReports";
import CoEDashboard from "./pages/coe/CoEDashboard";
import CoESchedule from "./pages/coe/CoESchedule";
import CoEResults from "./pages/coe/CoEResults";
import CoEGrievances from "./pages/coe/CoEGrievances";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HODFaculty from "./pages/hod/HODFaculty";
import HODGrievances from "./pages/hod/HODGrievances";



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

      <Route
        path="/faculty/notices"
        element={
          <ProtectedRoute allowedRoles={["faculty", "admin"]}>
            <FacultyNotices />
          </ProtectedRoute>
        }
      />

      <Route path="/hod/timetable" element={<HODTimetable />} />

      <Route
        path="/faculty/feedback"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyFeedback />
          </ProtectedRoute>
        }
      />


      <Route
        path="/hod/performance"
        element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <HODStudentPerformance />
          </ProtectedRoute>
        }
      />


      <Route
        path="/hod/faculty"
        element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <HODFaculty />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/grievances"
        element={
          <ProtectedRoute allowedRoles={["hod"]}>
            <HODGrievances />
          </ProtectedRoute>
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
        path="/student/exams"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentExams />
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
        path="/faculty/timetable"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyTimetable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/attendance/:timetableId"
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
      <Route
        path="/principal/subjects"
        element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <PrincipalSubjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/announcements"
        element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <PrincipalAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/grievances"
        element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <PrincipalGrievances />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/reports"
        element={
          <ProtectedRoute allowedRoles={["principal"]}>
            <PrincipalReports />
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
      <Route
        path="/coe/schedule"
        element={
          <ProtectedRoute allowedRoles={["coe"]}>
            <CoESchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coe/results"
        element={
          <ProtectedRoute allowedRoles={["coe"]}>
            <CoEResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coe/grievances"
        element={
          <ProtectedRoute allowedRoles={["coe"]}>
            <CoEGrievances />
          </ProtectedRoute>
        }
      />

      <Route path="/hod/timetable" element={<HODTimetable />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />

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
