import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { StudentDashboardData } from '../../../types'
import { MOCK_COURSES } from './useCourses'
import { MOCK_ENROLLMENTS } from './useEnrollments'

export function useStudentDashboard() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['studentDashboard', user?.id],
    queryFn: async (): Promise<StudentDashboardData> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const inProgressEnrollments = MOCK_ENROLLMENTS.filter(e => e.progress < 100)
      const completedEnrollments = MOCK_ENROLLMENTS.filter(e => e.progress === 100)

      // Find most recent course (by lastAccessedAt)
      const sortedEnrollments = [...inProgressEnrollments].sort((a, b) => {
        const dateA = new Date(a.lastAccessedAt || a.enrolledAt)
        const dateB = new Date(b.lastAccessedAt || b.enrolledAt)
        return dateB.getTime() - dateA.getTime()
      })

      // Get school-specific courses for school students
      const schoolCourses = user?.schoolId
        ? MOCK_COURSES.filter(c => c.schoolId === user.schoolId && !MOCK_ENROLLMENTS.some(e => e.courseId === c.id))
        : []

      return {
        recentCourse: sortedEnrollments[0],
        enrolledCourses: inProgressEnrollments.slice(0, 6),
        upcomingDeadlines: [
          {
            lessonTitle: 'Algebra Quiz - Chapter 5',
            courseName: 'Introduction to Mathematics',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'quiz',
          },
          {
            lessonTitle: 'Essay: Describe Your Community',
            courseName: 'English Language Skills',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'assignment',
          },
          {
            lessonTitle: 'Cell Division Lab Report',
            courseName: 'Biology Fundamentals',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'assignment',
          },
        ],
        announcements: [
          {
            id: 'ann-1',
            title: 'Welcome to the New Semester!',
            content: 'We are excited to welcome all students back. This semester brings new courses and exciting learning opportunities.',
            authorName: 'Admin Team',
            isRead: false,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'ann-2',
            title: 'Mathematics Course Update',
            content: 'New practice problems have been added to Chapter 5. Please complete them before the quiz.',
            authorName: 'Prof. Uwimana',
            courseName: 'Introduction to Mathematics',
            courseId: 'course-1',
            isRead: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'ann-3',
            title: 'Library Hours Extended',
            content: 'The school library will now be open until 8 PM on weekdays to support your studies.',
            authorName: 'School Admin',
            isRead: false,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        stats: {
          enrolledCount: MOCK_ENROLLMENTS.length,
          completedCount: completedEnrollments.length,
          averageGrade: 78,
          hoursSpent: 45,
        },
        schoolCourses: schoolCourses.slice(0, 3),
      }
    },
  })
}
