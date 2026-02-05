import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { Enrollment } from '../../../types'
import { MOCK_COURSES } from './useCourses'

// Mock enrollment data
const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enrollment-1',
    courseId: 'course-1',
    course: MOCK_COURSES[0],
    studentId: '1',
    status: 'approved',
    progress: 65,
    completedLessons: 16,
    totalLessons: 24,
    enrolledAt: '2024-09-01',
    lastAccessedAt: '2024-12-15',
    currentLessonId: 'lesson-17',
  },
  {
    id: 'enrollment-2',
    courseId: 'course-3',
    course: MOCK_COURSES[2],
    studentId: '1',
    status: 'approved',
    progress: 30,
    completedLessons: 12,
    totalLessons: 40,
    enrolledAt: '2024-10-15',
    lastAccessedAt: '2024-12-14',
    currentLessonId: 'lesson-13',
  },
  {
    id: 'enrollment-3',
    courseId: 'course-6',
    course: MOCK_COURSES[5],
    studentId: '1',
    status: 'approved',
    progress: 100,
    completedLessons: 20,
    totalLessons: 20,
    enrolledAt: '2024-08-01',
    completedAt: '2024-11-20',
    lastAccessedAt: '2024-11-20',
  },
  {
    id: 'enrollment-4',
    courseId: 'course-2',
    course: MOCK_COURSES[1],
    studentId: '1',
    status: 'approved',
    progress: 45,
    completedLessons: 14,
    totalLessons: 30,
    enrolledAt: '2024-11-01',
    lastAccessedAt: '2024-12-13',
    currentLessonId: 'lesson-15',
  },
  {
    id: 'enrollment-5',
    courseId: 'course-8',
    course: MOCK_COURSES[7],
    studentId: '1',
    status: 'approved',
    progress: 100,
    completedLessons: 25,
    totalLessons: 25,
    enrolledAt: '2024-07-15',
    completedAt: '2024-10-01',
    lastAccessedAt: '2024-10-01',
  },
]

export function useEnrollments(status?: 'in_progress' | 'completed') {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['enrollments', status, user?.id],
    queryFn: async (): Promise<Enrollment[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))

      let filtered = MOCK_ENROLLMENTS.filter(e => e.studentId === '1') // Mock: always use student id 1

      if (status === 'completed') {
        filtered = filtered.filter(e => e.progress === 100)
      } else if (status === 'in_progress') {
        filtered = filtered.filter(e => e.progress < 100)
      }

      return filtered
    },
  })
}

export function useEnrollment(id: string | undefined) {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: async (): Promise<Enrollment | undefined> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200))

      return MOCK_ENROLLMENTS.find(e => e.id === id)
    },
    enabled: !!id,
  })
}

// Export mock enrollments for use in other hooks
export { MOCK_ENROLLMENTS }
