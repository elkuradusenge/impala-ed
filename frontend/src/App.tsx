import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/use-auth.hook';
import Layout from './components/layout/Layout';
import RouteGuard from './components/RouteGuard';

// Public Pages
import LandingPage from './pages/public/landing.page';
import LoginPage from './pages/public/login.page';
import RegisterPage from './pages/public/register.page';
import ForgotPasswordPage from './pages/public/forgot-password.page';
import PublicCoursesPage from './pages/public/courses.page';

// Student Pages
import StudentDashboardPage from './pages/student/dashboard.page';
import CourseDetailsPage from './pages/student/course-details.page';
import LearningPage from './pages/student/learning.page';
import AssignmentPage from './pages/student/assignment.page';
import ProgressPage from './pages/student/progress.page';

// Mentor Pages
import MentorDashboardPage from './pages/mentor/dashboard.page';
import CourseManagementPage from './pages/mentor/course-management.page';
import ModuleManagementPage from './pages/mentor/module-management.page';
import LessonManagementPage from './pages/mentor/lesson-management.page';
import PDFUploadPage from './pages/mentor/pdf-upload.page';
import AssignmentManagementPage from './pages/mentor/assignment-management.page';
import StudentProgressPage from './pages/mentor/student-progress.page';

// Admin Pages
import AdminDashboardPage from './pages/admin/dashboard.page';
import UserManagementPage from './pages/admin/user-management.page';
import AdminCourseManagementPage from './pages/admin/course-management.page';
import ReportsPage from './pages/admin/reports.page';
import SettingsPage from './pages/admin/settings.page';

// Shared Pages
import MessagesPage from './pages/messages.page';
import ProfilePage from './pages/profile.page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * DashboardRedirect - reads the authenticated user's role from AuthContext
 * and redirects to the appropriate role-based dashboard.
 */
const DashboardRedirect: React.FC = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const routes: Record<string, string> = {
    student: '/student/dashboard',
    mentor: '/mentor/dashboard',
    admin: '/admin/dashboard',
  };
  return <Navigate to={routes[role || 'student'] || '/'} replace />;
};

const AppRoutes: React.FC = () => (
  <Layout>
    <Routes>
      {/* Public / Guest Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <RouteGuard allowedRoles={['student']}>
            <StudentDashboardPage />
          </RouteGuard>
        }
      />
      {/* Public course catalogue - no auth needed */}
      <Route path="/courses" element={<PublicCoursesPage />} />
      <Route path="/courses/:id" element={<CourseDetailsPage />} />
      <Route
        path="/learning/:courseId"
        element={
          <RouteGuard allowedRoles={['student']}>
            <LearningPage />
          </RouteGuard>
        }
      />
      <Route
        path="/assignments/:courseId"
        element={
          <RouteGuard allowedRoles={['student']}>
            <AssignmentPage />
          </RouteGuard>
        }
      />
      <Route
        path="/progress"
        element={
          <RouteGuard allowedRoles={['student']}>
            <ProgressPage />
          </RouteGuard>
        }
      />

      {/* Mentor Routes */}
      <Route
        path="/mentor/dashboard"
        element={
          <RouteGuard allowedRoles={['mentor', 'admin']}>
            <MentorDashboardPage />
          </RouteGuard>
        }
      />
      <Route
        path="/mentor/courses"
        element={
          <RouteGuard allowedRoles={['mentor', 'admin']}>
            <CourseManagementPage />
          </RouteGuard>
        }
      />
      <Route
        path="/mentor/courses/:courseId/modules"
        element={
          <RouteGuard allowedRoles={['mentor', 'admin']}>
            <ModuleManagementPage />
          </RouteGuard>
        }
      />
      <Route
        path="/mentor/modules/:moduleId/lessons"
        element={
          <RouteGuard allowedRoles={['mentor', 'admin']}>
            <LessonManagementPage />
          </RouteGuard>
        }
      />
      <Route
        path="/mentor/pdf"
        element={
          <RouteGuard allowedRoles={['mentor', 'admin']}>
            <PDFUploadPage />
          </RouteGuard>
        }
      />
      <Route
        path="/mentor/assignments"
        element={
          <RouteGuard allowedRoles={['mentor', 'admin']}>
            <AssignmentManagementPage />
          </RouteGuard>
        }
      />
      <Route
        path="/mentor/progress"
        element={
          <RouteGuard allowedRoles={['mentor', 'admin']}>
            <StudentProgressPage />
          </RouteGuard>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <AdminDashboardPage />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <UserManagementPage />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <AdminCourseManagementPage />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <ReportsPage />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <SettingsPage />
          </RouteGuard>
        }
      />

      {/* Shared (any authenticated user) */}
      <Route
        path="/messages"
        element={
          <RouteGuard>
            <MessagesPage />
          </RouteGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <RouteGuard>
            <ProfilePage />
          </RouteGuard>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Layout>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
