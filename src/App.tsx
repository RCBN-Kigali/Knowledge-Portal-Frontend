import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import About from './pages/public/About'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Dashboard
import Dashboard from './pages/dashboard/Dashboard'

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
              <Route path="/about" element={<About />} />
            </Route>

            {/* Auth Routes with AuthLayout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            </Route>

            {/* Protected Routes with AppLayout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Dashboard - All authenticated users */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Student Routes */}
              <Route path="/student/*" element={
                <RoleGuard roles={['school_student', 'public_student']}>
                  <Routes>
                    <Route path="public-courses" element={<div>Browse Public Courses</div>} />
                    <Route path="enrolled-courses" element={<div>My Enrolled Courses</div>} />
                    <Route path="progress" element={<div>My Progress</div>} />
                    <Route path="certificates" element={<div>My Certificates</div>} />
                  </Routes>
                </RoleGuard>
              } />

              {/* School Student Routes */}
              <Route path="/school-student/*" element={
                <RoleGuard roles={['school_student']} requireSchoolId>
                  <Routes>
                    <Route path="school-courses" element={<div>School Courses</div>} />
                    <Route path="classmates" element={<div>My Classmates</div>} />
                  </Routes>
                </RoleGuard>
              } />

              {/* Teacher Routes */}
              <Route path="/teacher/*" element={
                <RoleGuard roles={['school_teacher', 'independent_teacher']}>
                  <Routes>
                    <Route path="courses" element={<div>My Courses</div>} />
                    <Route path="courses/new" element={<div>Create Course</div>} />
                    <Route path="courses/:id/edit" element={<div>Edit Course</div>} />
                    <Route path="students" element={<div>My Students</div>} />
                    <Route path="analytics" element={<div>Teaching Analytics</div>} />
                  </Routes>
                </RoleGuard>
              } />

              {/* School Teacher Routes */}
              <Route path="/school-teacher/*" element={
                <RoleGuard roles={['school_teacher']} requireSchoolId>
                  <Routes>
                    <Route path="classes" element={<div>My Classes</div>} />
                    <Route path="assignments" element={<div>Assignments</div>} />
                  </Routes>
                </RoleGuard>
              } />

              {/* School Admin Routes */}
              <Route path="/admin/*" element={
                <RoleGuard roles={['school_admin']} requireSchoolId>
                  <Routes>
                    <Route path="overview" element={<div>School Overview</div>} />
                    <Route path="teachers" element={<div>Manage Teachers</div>} />
                    <Route path="students" element={<div>Manage Students</div>} />
                    <Route path="courses" element={<div>School Courses</div>} />
                    <Route path="analytics" element={<div>School Analytics</div>} />
                    <Route path="settings" element={<div>School Settings</div>} />
                  </Routes>
                </RoleGuard>
              } />

              {/* Super Admin Routes */}
              <Route path="/superadmin/*" element={
                <RoleGuard roles={['super_admin']}>
                  <Routes>
                    <Route path="schools" element={<div>Manage Schools</div>} />
                    <Route path="schools/new" element={<div>Create School</div>} />
                    <Route path="schools/:id/edit" element={<div>Edit School</div>} />
                    <Route path="users" element={<div>All Users</div>} />
                    <Route path="teachers" element={<div>All Teachers</div>} />
                    <Route path="teachers/approve" element={<div>Approve Teachers</div>} />
                    <Route path="courses" element={<div>All Courses</div>} />
                    <Route path="courses/approve" element={<div>Approve Courses</div>} />
                    <Route path="analytics" element={<div>System Analytics</div>} />
                    <Route path="settings" element={<div>System Settings</div>} />
                  </Routes>
                </RoleGuard>
              } />

              {/* Profile & Settings - All authenticated users */}
              <Route path="/profile" element={<div>My Profile</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
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
