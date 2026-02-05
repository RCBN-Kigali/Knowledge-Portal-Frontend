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

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import BrowseCourses from './pages/student/BrowseCourses'
import MyEnrollments from './pages/student/MyEnrollments'
import CourseDetail from './pages/student/CourseDetail'
import LearningInterface from './pages/student/LearningInterface'
import Progress from './pages/student/Progress'
import Announcements from './pages/student/Announcements'

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
              {/* Dashboard - All authenticated users */}
              <Route path="/dashboard" element={
                <RoleGuard roles={['school_student']}>
                  <StudentDashboard />
                </RoleGuard>
              } />

              {/* Student Routes */}
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
                  <Announcements />
                </RoleGuard>
              } />

              {/* Teacher Routes - Placeholder */}
              <Route path="/teacher/*" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <div className="p-8 text-center text-gray-500">Teacher Dashboard - Coming Soon</div>
                </RoleGuard>
              } />

              {/* Admin Routes - Placeholder */}
              <Route path="/admin/*" element={
                <RoleGuard roles={['school_admin']} requireSchoolId>
                  <div className="p-8 text-center text-gray-500">School Admin - Coming Soon</div>
                </RoleGuard>
              } />

              {/* Super Admin Routes - Placeholder */}
              <Route path="/superadmin/*" element={
                <RoleGuard roles={['super_admin']}>
                  <div className="p-8 text-center text-gray-500">Super Admin - Coming Soon</div>
                </RoleGuard>
              } />

              {/* Profile & Settings */}
              <Route path="/profile" element={<div className="p-8 text-center text-gray-500">Profile - Coming Soon</div>} />
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
