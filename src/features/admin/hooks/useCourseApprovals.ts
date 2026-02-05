import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { CourseStatus, CourseVisibility, Teacher } from '../../../types'

export interface PendingCourse {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  visibility: CourseVisibility
  teacher: Teacher & { type: 'school' | 'independent' }
  moduleCount: number
  lessonCount: number
  submittedAt: string
  status: CourseStatus
  rejectionReason?: string
  reviewHistory?: { action: string; date: string; by: string; reason?: string }[]
}

const MOCK_PENDING_COURSES: PendingCourse[] = [
  {
    id: 'pc-1',
    title: 'Advanced Mathematics',
    description: 'Deep dive into calculus and algebra',
    category: 'mathematics',
    difficulty: 'advanced',
    visibility: 'private',
    teacher: { id: 't1', name: 'Alice Uwimana', schoolId: 'school-1', schoolName: 'Paysannat A', type: 'school' },
    moduleCount: 4,
    lessonCount: 12,
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'pending',
  },
  {
    id: 'pc-2',
    title: 'Sustainable Agriculture',
    description: 'Modern farming techniques',
    category: 'agriculture',
    difficulty: 'intermediate',
    visibility: 'public',
    teacher: { id: 't2', name: 'Dr. Mukamana', type: 'independent' },
    moduleCount: 6,
    lessonCount: 18,
    submittedAt: '2024-01-14T14:20:00Z',
    status: 'pending',
  },
  {
    id: 'pc-3',
    title: 'English Literature',
    description: 'Classic and modern literature analysis',
    category: 'languages',
    difficulty: 'beginner',
    visibility: 'public',
    teacher: { id: 't3', name: 'Eric Habimana', schoolId: 'school-1', schoolName: 'Paysannat A', type: 'school' },
    moduleCount: 5,
    lessonCount: 15,
    submittedAt: '2024-01-13T09:15:00Z',
    status: 'pending',
  },
]

const MOCK_APPROVED_COURSES: PendingCourse[] = [
  {
    id: 'ac-1',
    title: 'Introduction to Science',
    description: 'Basic science concepts',
    category: 'science',
    difficulty: 'beginner',
    visibility: 'private',
    teacher: { id: 't1', name: 'Alice Uwimana', schoolId: 'school-1', schoolName: 'Paysannat A', type: 'school' },
    moduleCount: 3,
    lessonCount: 9,
    submittedAt: '2024-01-10T10:00:00Z',
    status: 'approved',
  },
]

const MOCK_REJECTED_COURSES: PendingCourse[] = [
  {
    id: 'rc-1',
    title: 'Quick Math',
    description: 'Fast math tricks',
    category: 'mathematics',
    difficulty: 'beginner',
    visibility: 'private',
    teacher: { id: 't4', name: 'David Niyonzima', schoolId: 'school-2', schoolName: 'Paysannat B', type: 'school' },
    moduleCount: 2,
    lessonCount: 4,
    submittedAt: '2024-01-08T11:00:00Z',
    status: 'rejected',
    rejectionReason: 'Content too brief. Please add more detailed explanations and examples.',
    reviewHistory: [
      { action: 'rejected', date: '2024-01-09T14:00:00Z', by: 'Admin User', reason: 'Content too brief' },
    ],
  },
]

export function usePendingCourses(status: CourseStatus = 'pending') {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['pendingCourses', user?.role, user?.schoolId, status],
    queryFn: async (): Promise<PendingCourse[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let courses: PendingCourse[] = []
      if (status === 'pending') courses = [...MOCK_PENDING_COURSES]
      else if (status === 'approved') courses = [...MOCK_APPROVED_COURSES]
      else if (status === 'rejected') courses = [...MOCK_REJECTED_COURSES]
      
      // School admin only sees their school courses
      if (user?.role === 'school_admin') {
        courses = courses.filter(c => c.teacher.schoolId === user.schoolId)
      }
      // Super admin sees all public courses + independent teacher courses
      else if (user?.role === 'super_admin') {
        courses = courses.filter(c => c.visibility === 'public' || c.teacher.type === 'independent')
      }
      
      return courses
    },
    enabled: user?.role === 'school_admin' || user?.role === 'super_admin',
  })
}

export function useCourseForReview(courseId: string | undefined) {
  return useQuery({
    queryKey: ['courseReview', courseId],
    queryFn: async (): Promise<PendingCourse | null> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      const allCourses = [...MOCK_PENDING_COURSES, ...MOCK_APPROVED_COURSES, ...MOCK_REJECTED_COURSES]
      return allCourses.find(c => c.id === courseId) || null
    },
    enabled: \!\!courseId,
  })
}

export function useApproveCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (courseId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return courseId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCourses'] })
      queryClient.invalidateQueries({ queryKey: ['courseReview'] })
    },
  })
}

export function useRejectCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ courseId, reason }: { courseId: string; reason: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return { courseId, reason }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCourses'] })
      queryClient.invalidateQueries({ queryKey: ['courseReview'] })
    },
  })
}
