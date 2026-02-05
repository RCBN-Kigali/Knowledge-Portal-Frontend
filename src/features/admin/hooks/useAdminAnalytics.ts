import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'

export interface AnalyticsData {
  // Summary stats
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  completionRate: number
  userGrowth: number
  courseGrowth: number
  enrollmentGrowth: number
  completionChange: number
  
  // Activity
  avgSessionTime: number
  dailyActiveUsers: number
  lessonsCompleted: number
  certificatesIssued: number
  
  // Top courses
  topCourses: {
    id: string
    title: string
    enrollments: number
    completionRate: number
  }[]
  
  // User breakdown
  usersByRole: { role: string; count: number }[]
  registrationTrends: { date: string; count: number }[]
  
  // Course breakdown
  coursesByCategory: { category: string; count: number }[]
  coursesByStatus: { status: string; count: number }[]
  
  // Engagement
  avgQuizScore: number
  assignmentSubmissionRate: number
  videoCompletionRate: number
  peakTimes: { time: string; percentage: number }[]
}

const generateMockAnalytics = (isSuperAdmin: boolean): AnalyticsData => ({
  totalUsers: isSuperAdmin ? 1250 : 257,
  totalCourses: isSuperAdmin ? 87 : 18,
  totalEnrollments: isSuperAdmin ? 3450 : 892,
  completionRate: 68,
  userGrowth: 12,
  courseGrowth: 8,
  enrollmentGrowth: 15,
  completionChange: 5,
  
  avgSessionTime: 24,
  dailyActiveUsers: isSuperAdmin ? 345 : 89,
  lessonsCompleted: isSuperAdmin ? 12450 : 3240,
  certificatesIssued: isSuperAdmin ? 234 : 56,
  
  topCourses: [
    { id: '1', title: 'Introduction to Agriculture', enrollments: 156, completionRate: 72 },
    { id: '2', title: 'Digital Literacy Fundamentals', enrollments: 134, completionRate: 68 },
    { id: '3', title: 'English for Professionals', enrollments: 98, completionRate: 81 },
    { id: '4', title: 'Basic Computer Skills', enrollments: 87, completionRate: 75 },
    { id: '5', title: 'Environmental Science', enrollments: 76, completionRate: 63 },
  ],
  
  usersByRole: [
    { role: 'student', count: isSuperAdmin ? 1050 : 230 },
    { role: 'teacher', count: isSuperAdmin ? 180 : 25 },
    { role: 'admin', count: isSuperAdmin ? 20 : 2 },
  ],
  
  registrationTrends: [
    { date: '2024-01-01', count: 12 },
    { date: '2024-01-02', count: 8 },
    { date: '2024-01-03', count: 15 },
    { date: '2024-01-04', count: 9 },
    { date: '2024-01-05', count: 18 },
    { date: '2024-01-06', count: 6 },
    { date: '2024-01-07', count: 11 },
  ],
  
  coursesByCategory: [
    { category: 'Agriculture', count: isSuperAdmin ? 24 : 6 },
    { category: 'Technology', count: isSuperAdmin ? 18 : 4 },
    { category: 'Languages', count: isSuperAdmin ? 15 : 3 },
    { category: 'Science', count: isSuperAdmin ? 12 : 2 },
    { category: 'Business', count: isSuperAdmin ? 10 : 2 },
    { category: 'Other', count: isSuperAdmin ? 8 : 1 },
  ],
  
  coursesByStatus: [
    { status: 'published', count: isSuperAdmin ? 65 : 14 },
    { status: 'draft', count: isSuperAdmin ? 12 : 2 },
    { status: 'pending', count: isSuperAdmin ? 10 : 2 },
  ],
  
  avgQuizScore: 74,
  assignmentSubmissionRate: 82,
  videoCompletionRate: 65,
  
  peakTimes: [
    { time: '8AM - 10AM', percentage: 15 },
    { time: '10AM - 12PM', percentage: 25 },
    { time: '2PM - 4PM', percentage: 30 },
    { time: '4PM - 6PM', percentage: 20 },
    { time: '6PM - 8PM', percentage: 10 },
  ],
})

export function useAdminAnalytics(timeRange: string = '30d') {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['adminAnalytics', user?.schoolId, timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return generateMockAnalytics(false)
    },
    enabled: user?.role === 'school_admin',
  })
}

export function useSuperAdminAnalytics(timeRange: string = '30d') {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['superAdminAnalytics', timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return generateMockAnalytics(true)
    },
    enabled: user?.role === 'super_admin',
  })
}
