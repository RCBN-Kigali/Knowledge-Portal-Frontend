import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext'

import ProtectedRoute from './routes/ProtectedRoute'
import PublicOnlyRoute from './routes/PublicOnlyRoute'
import RoleGuard from './routes/RoleGuard'

import StudentLayout from './layouts/StudentLayout'

import Welcome from './pages/Welcome'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import NotFound from './pages/errors/NotFound'

import DiscoveryHome from './pages/student/DiscoveryHome'
import SearchPage from './pages/student/SearchPage'
import ContentDetail from './pages/student/ContentDetail'
import Notifications from './pages/student/Notifications'
import Announcements from './pages/student/Announcements'
import AnnouncementDetail from './pages/student/AnnouncementDetail'
import Profile from './pages/student/Profile'
import CareerExplorer from './pages/student/CareerExplorer'
import ComingSoon from './pages/student/ComingSoon'

import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherPending from './pages/teacher/TeacherPending'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
            <Route path="/teacher/pending" element={<TeacherPending />} />

            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['student']}>
                    <StudentLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<DiscoveryHome />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="explore" element={<CareerExplorer />} />
              <Route path="content/:contentId" element={<ContentDetail />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="announcements/:announcementId" element={<AnnouncementDetail />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route
                path="courses"
                element={
                  <ComingSoon
                    title="Courses"
                    description="Structured courses are coming soon. For now, browse individual lessons from the Discover feed."
                  />
                }
              />
              <Route
                path="my-learning"
                element={
                  <ComingSoon
                    title="My Learning"
                    description="Personal learning history and saved lessons will appear here once the feature is enabled."
                  />
                }
              />
              <Route
                path="library"
                element={
                  <ComingSoon
                    title="Library"
                    description="Bookmarked content and downloads will live here. We're working on it."
                  />
                }
              />
              <Route
                path="progress"
                element={
                  <ComingSoon
                    title="Progress"
                    description="Track your learning progress here when course tracking ships."
                  />
                }
              />
            </Route>

            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['teacher']}>
                    <TeacherDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['admin']}>
                    <AdminDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
