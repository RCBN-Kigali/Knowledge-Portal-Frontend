import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'

// Route Guards
import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleGuard from './routes/RoleGuard'

// Public Pages
import Landing from './pages/public/Landing'
import PublicCatalog from './pages/public/PublicCatalog'
import PublicCoursePreview from './pages/public/PublicCoursePreview'
import About from './pages/public/About'

// Auth Pages
import Login from './pages/auth/Login'

// Dashboard Redirect
import DashboardRedirect from './pages/DashboardRedirect'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import BrowseCourses from './pages/student/BrowseCourses'
import MyEnrollments from './pages/student/MyEnrollments'
import CourseDetail from './pages/student/CourseDetail'
import LearningInterface from './pages/student/LearningInterface'
import Progress from './pages/student/Progress'
import StudentAnnouncements from './pages/student/Announcements'

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import MyCourses from './pages/teacher/MyCourses'
import CourseBuilder from './pages/teacher/CourseBuilder'
import StudentManagement from './pages/teacher/StudentManagement'
import Submissions from './pages/teacher/Submissions'
import CourseAnalytics from './pages/teacher/CourseAnalytics'

// School Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import CourseApprovals from './pages/admin/CourseApprovals'
import CourseReview from './pages/admin/CourseReview'
import AdminAnnouncements from './pages/admin/Announcements'
import AdminAnalytics from './pages/admin/Analytics'

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import SchoolsOverview from './pages/superadmin/SchoolsOverview'
import SchoolDetail from './pages/superadmin/SchoolDetail'
import IndependentTeachers from './pages/superadmin/IndependentTeachers'

// Chat
import Chat from './pages/chat/Chat'

// Profile
import Profile from './pages/profile/Profile'

// Error Pages
import NotFound from './pages/errors/NotFound'
import Forbidden from './pages/errors/Forbidden'
import ServerError from './pages/errors/ServerError'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/courses" element={<PublicCatalog />} />
              <Route path="/courses/:id" element={<PublicCoursePreview />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/* Auth Routes with AuthLayout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            </Route>

            {/* Protected Routes with AppLayout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Dashboard - redirects based on role */}
              <Route path="/dashboard" element={<DashboardRedirect />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <RoleGuard roles={['school_student']}>
                  <StudentDashboard />
                </RoleGuard>
              } />
              <Route path="/student/courses" element={
                <RoleGuard roles={['school_student']}>
                  <BrowseCourses />
                </RoleGuard>
              } />
              <Route path="/student/courses/:id" element={
                <RoleGuard roles={['school_student']}>
                  <CourseDetail />
                </RoleGuard>
              } />
              <Route path="/student/enrollments" element={
                <RoleGuard roles={['school_student']}>
                  <MyEnrollments />
                </RoleGuard>
              } />
              <Route path="/student/learn/:enrollmentId" element={
                <RoleGuard roles={['school_student']}>
                  <LearningInterface />
                </RoleGuard>
              } />
              <Route path="/student/progress" element={
                <RoleGuard roles={['school_student']}>
                  <Progress />
                </RoleGuard>
              } />
              <Route path="/student/announcements" element={
                <RoleGuard roles={['school_student']}>
                  <StudentAnnouncements />
                </RoleGuard>
              } />
              <Route path="/student/chat" element={
                <RoleGuard roles={['school_student']}>
                  <Chat />
                </RoleGuard>
              } />

              {/* Teacher Routes */}
              <Route path="/teacher/dashboard" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <TeacherDashboard />
                </RoleGuard>
              } />
              <Route path="/teacher/courses" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <MyCourses />
                </RoleGuard>
              } />
              <Route path="/teacher/courses/new" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <CourseBuilder />
                </RoleGuard>
              } />
              <Route path="/teacher/courses/:courseId/edit" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <CourseBuilder />
                </RoleGuard>
              } />
              <Route path="/teacher/courses/:courseId/analytics" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <CourseAnalytics />
                </RoleGuard>
              } />
              <Route path="/teacher/students" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <StudentManagement />
                </RoleGuard>
              } />
              <Route path="/teacher/submissions" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <Submissions />
                </RoleGuard>
              } />
              <Route path="/teacher/chat" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <Chat />
                </RoleGuard>
              } />

              {/* School Admin Routes */}
              <Route path="/admin/dashboard" element={
                <RoleGuard roles={['school_admin']} requireSchoolId>
                  <AdminDashboard />
                </RoleGuard>
              } />
              <Route path="/admin/users" element={
                <RoleGuard roles={['school_admin']} requireSchoolId>
                  <UserManagement />
                </RoleGuard>
              } />
              <Route path="/admin/approvals" element={
                <RoleGuard roles={['school_admin']} requireSchoolId>
                  <CourseApprovals />
                </RoleGuard>
              } />
              <Route path="/admin/approvals/:courseId" element={
                <RoleGuard roles={['school_admin']} requireSchoolId>
                  <CourseReview />
                </RoleGuard>
              } />
              <Route path="/admin/announcements" element={
                <RoleGuard roles={['school_admin']} requireSchoolId>
                  <AdminAnnouncements />
                </RoleGuard>
              } />
              <Route path="/admin/analytics" element={
                <RoleGuard roles={['school_admin']} requireSchoolId>
                  <AdminAnalytics />
                </RoleGuard>
              } />

              {/* Super Admin Routes */}
              <Route path="/superadmin/dashboard" element={
                <RoleGuard roles={['super_admin']}>
                  <SuperAdminDashboard />
                </RoleGuard>
              } />
              <Route path="/superadmin/schools" element={
                <RoleGuard roles={['super_admin']}>
                  <SchoolsOverview />
                </RoleGuard>
              } />
              <Route path="/superadmin/schools/:schoolId" element={
                <RoleGuard roles={['super_admin']}>
                  <SchoolDetail />
                </RoleGuard>
              } />
              <Route path="/superadmin/users" element={
                <RoleGuard roles={['super_admin']}>
                  <UserManagement />
                </RoleGuard>
              } />
              <Route path="/superadmin/teachers" element={
                <RoleGuard roles={['super_admin']}>
                  <IndependentTeachers />
                </RoleGuard>
              } />
              <Route path="/superadmin/approvals" element={
                <RoleGuard roles={['super_admin']}>
                  <CourseApprovals />
                </RoleGuard>
              } />
              <Route path="/superadmin/approvals/:courseId" element={
                <RoleGuard roles={['super_admin']}>
                  <CourseReview />
                </RoleGuard>
              } />
              <Route path="/superadmin/announcements" element={
                <RoleGuard roles={['super_admin']}>
                  <AdminAnnouncements />
                </RoleGuard>
              } />
              <Route path="/superadmin/analytics" element={
                <RoleGuard roles={['super_admin']}>
                  <AdminAnalytics />
                </RoleGuard>
              } />

              {/* Profile & Settings */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<div className="p-8 text-center text-gray-500">Settings - Coming Soon</div>} />
            </Route>

            {/* Error Routes */}
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
