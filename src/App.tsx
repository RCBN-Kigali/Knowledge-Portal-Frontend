import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './context/AuthContext'

import ProtectedRoute from './routes/ProtectedRoute'
import PublicOnlyRoute from './routes/PublicOnlyRoute'
import RoleGuard from './routes/RoleGuard'

import StudentLayout from './layouts/StudentLayout'
import TeacherLayout from './layouts/TeacherLayout'
import AdminLayout from './layouts/AdminLayout'

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
import Courses from './pages/student/Courses'
import CourseDetail from './pages/student/CourseDetail'
import Library from './pages/student/Library'
import MyLearning from './pages/student/MyLearning'
import StudentProgress from './pages/student/Progress'

import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherPending from './pages/teacher/TeacherPending'
import UploadContent from './pages/teacher/UploadContent'
import EditContent from './pages/teacher/EditContent'
import TeacherComments from './pages/teacher/TeacherComments'
import TeacherProfile from './pages/teacher/TeacherProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingApprovals from './pages/admin/PendingApprovals'
import TeacherManagement from './pages/admin/TeacherManagement'
import AddTeacher from './pages/admin/AddTeacher'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminSettings from './pages/admin/AdminSettings'

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
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="my-learning" element={<MyLearning />} />
              <Route path="library" element={<Library />} />
              <Route path="progress" element={<StudentProgress />} />
            </Route>

            <Route
              path="/teacher"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['teacher']}>
                    <TeacherLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="upload" element={<UploadContent />} />
              <Route path="content/:contentId/edit" element={<EditContent />} />
              <Route path="comments" element={<TeacherComments />} />
              <Route path="profile" element={<TeacherProfile />} />
            </Route>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['admin']}>
                    <AdminLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="approvals" element={<PendingApprovals />} />
              <Route path="teachers" element={<TeacherManagement />} />
              <Route path="teachers/add" element={<AddTeacher />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
