import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'

export interface AdminDashboardStats {
  totalStudents: number
  totalTeachers: number
  activeCourses: number
  pendingApprovals: number
  recentRegistrations: { id: string; name: string; email: string; role: string; date: string }[]
}

export interface SuperAdminDashboardStats {
  totalSchools: number
  totalUsers: number
  activeCourses: number
  pendingApprovals: number
  independentTeachersPending: number
  schools: {
    id: string
    name: string
    location?: string
    studentCount: number
    teacherCount: number
    courseCount: number
    adminName?: string
  }[]
  pendingCourses: {
    id: string
    title: string
    teacherName: string
    teacherType: 'school' | 'independent'
  }[]
  recentRegistrations: {
    id: string
    name: string
    email: string
    role: string
    schoolName: string
    date: string
  }[]
}

const MOCK_ADMIN_STATS: AdminDashboardStats = {
  totalStudents: 245,
  totalTeachers: 12,
  activeCourses: 18,
  pendingApprovals: 3,
  recentRegistrations: [
    { id: '1', name: 'Jean Baptiste', email: 'jean@student.edu', role: 'school_student', date: '2024-01-15' },
    { id: '2', name: 'Marie Claire', email: 'marie@student.edu', role: 'school_student', date: '2024-01-14' },
    { id: '3', name: 'Paul Mugisha', email: 'paul@student.edu', role: 'school_student', date: '2024-01-13' },
  ],
}

const MOCK_SUPERADMIN_STATS: SuperAdminDashboardStats = {
  totalSchools: 4,
  totalUsers: 1250,
  activeCourses: 87,
  pendingApprovals: 5,
  independentTeachersPending: 2,
  schools: [
    { id: 'school-1', name: 'Paysannat A', location: 'Rwamagana', studentCount: 450, teacherCount: 15, courseCount: 32, adminName: 'Jean Bosco' },
    { id: 'school-2', name: 'Paysannat B', location: 'Rwamagana', studentCount: 320, teacherCount: 10, courseCount: 24, adminName: 'Marie Rose' },
    { id: 'school-3', name: 'Paysannat C', location: 'Rwamagana', studentCount: 280, teacherCount: 12, courseCount: 18, adminName: 'Patrick Mugabo' },
    { id: 'school-4', name: 'Paysannat D', location: 'Rwamagana', studentCount: 200, teacherCount: 8, courseCount: 13, adminName: 'Alice Uwimana' },
  ],
  pendingCourses: [
    { id: 'course-1', title: 'Advanced Sustainable Agriculture', teacherName: 'Dr. Mukamana', teacherType: 'independent' },
    { id: 'course-2', title: 'Digital Literacy Fundamentals', teacherName: 'Emmanuel Habimana', teacherType: 'school' },
    { id: 'course-3', title: 'Climate Change Adaptation', teacherName: 'Prof. Nshimiyimana', teacherType: 'independent' },
  ],
  recentRegistrations: [
    { id: '1', name: 'Jean Baptiste', email: 'jean@student.edu', role: 'school_student', schoolName: 'Paysannat A', date: '2024-01-15' },
    { id: '2', name: 'Marie Claire', email: 'marie@teacher.edu', role: 'school_teacher', schoolName: 'Paysannat C', date: '2024-01-14' },
    { id: '3', name: 'Paul Mugisha', email: 'paul@student.edu', role: 'school_student', schoolName: 'Paysannat B', date: '2024-01-13' },
  ],
}

export function useAdminDashboard() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['adminDashboard', user?.schoolId],
    queryFn: async (): Promise<AdminDashboardStats> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return MOCK_ADMIN_STATS
    },
    enabled: user?.role === 'school_admin',
  })
}

export function useSuperAdminDashboard() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['superAdminDashboard'],
    queryFn: async (): Promise<SuperAdminDashboardStats> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return MOCK_SUPERADMIN_STATS
    },
    enabled: user?.role === 'super_admin',
  })
}
