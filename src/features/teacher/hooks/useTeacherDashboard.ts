import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { TeacherDashboardData } from '../../../types'

export function useTeacherDashboard() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['teacherDashboard', user?.id],
    queryFn: async (): Promise<TeacherDashboardData> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return {
        stats: {
          totalCourses: 5,
          activeStudents: 127,
          pendingSubmissions: 8,
          pendingEnrollmentRequests: user?.role === 'independent_teacher' ? 3 : undefined,
        },
        courseCounts: {
          draft: 2,
          pending: 1,
          approved: 3,
          rejected: 1,
        },
        recentActivity: [
          { message: 'New submission in "Introduction to Mathematics"', date: '2024-03-10T10:30:00Z' },
          { message: '"Biology Fundamentals" was approved', date: '2024-03-09T15:00:00Z' },
          { message: 'New enrollment in "Computer Basics"', date: '2024-03-08T09:00:00Z' },
        ],
      }
    },
  })
}
