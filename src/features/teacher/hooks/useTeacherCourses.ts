import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TeacherCourse, CourseStatus, CourseCategory, DifficultyLevel, CourseVisibility } from '../../../types'

const MOCK_TEACHER_COURSES: TeacherCourse[] = [
  {
    id: 'tc-1',
    title: 'Introduction to Mathematics',
    description: 'A comprehensive course covering basic mathematical concepts',
    thumbnailUrl: '/images/math.jpg',
    category: 'mathematics',
    difficulty: 'beginner',
    teacher: { id: 't1', name: 'Prof. Uwimana' },
    isPublic: true,
    studentCount: 45,
    rating: 4.5,
    ratingCount: 20,
    moduleCount: 5,
    lessonCount: 15,
    createdAt: '2024-01-01',
    status: 'approved',
    visibility: 'public',
    schoolId: 'school-1',
  },
  {
    id: 'tc-2',
    title: 'Advanced Physics',
    description: 'Deep dive into physics principles',
    thumbnailUrl: '/images/physics.jpg',
    category: 'science',
    difficulty: 'advanced',
    teacher: { id: 't1', name: 'Prof. Uwimana' },
    isPublic: false,
    studentCount: 22,
    rating: 4.8,
    ratingCount: 10,
    moduleCount: 3,
    lessonCount: 10,
    createdAt: '2024-01-15',
    status: 'approved',
    visibility: 'private',
    schoolId: 'school-1',
  },
  {
    id: 'tc-3',
    title: 'Biology Fundamentals',
    description: 'Introduction to biology',
    thumbnailUrl: '/images/biology.jpg',
    category: 'science',
    difficulty: 'beginner',
    teacher: { id: 't1', name: 'Prof. Uwimana' },
    isPublic: false,
    studentCount: 0,
    rating: 0,
    ratingCount: 0,
    moduleCount: 0,
    lessonCount: 0,
    createdAt: '2024-02-01',
    status: 'draft',
    visibility: 'private',
    schoolId: 'school-1',
  },
  {
    id: 'tc-4',
    title: 'Chemistry Lab',
    description: 'Hands-on chemistry experiments',
    thumbnailUrl: '/images/chemistry.jpg',
    category: 'science',
    difficulty: 'intermediate',
    teacher: { id: 't1', name: 'Prof. Uwimana' },
    isPublic: true,
    studentCount: 0,
    rating: 0,
    ratingCount: 0,
    moduleCount: 2,
    lessonCount: 6,
    createdAt: '2024-02-10',
    status: 'pending',
    visibility: 'public',
    schoolId: 'school-1',
  },
]

export function useTeacherCourses(status?: CourseStatus) {
  return useQuery({
    queryKey: ['teacherCourses', status],
    queryFn: async (): Promise<TeacherCourse[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      if (status) {
        return MOCK_TEACHER_COURSES.filter(c => c.status === status)
      }
      return MOCK_TEACHER_COURSES
    },
  })
}

export function useTeacherCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ['teacherCourse', courseId],
    queryFn: async (): Promise<TeacherCourse | null> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return MOCK_TEACHER_COURSES.find(c => c.id === courseId) || null
    },
    enabled: !!courseId,
  })
}

interface CreateCourseData {
  title: string
  description: string
  category: CourseCategory
  difficulty: DifficultyLevel
  visibility: CourseVisibility
  thumbnailUrl?: string
  teacherId: string
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateCourseData): Promise<TeacherCourse> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newCourse: TeacherCourse = {
        id: `tc-${Date.now()}`,
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        difficulty: data.difficulty,
        teacher: { id: data.teacherId, name: 'Current Teacher' },
        isPublic: data.visibility === 'public',
        studentCount: 0,
        rating: 0,
        ratingCount: 0,
        moduleCount: 0,
        lessonCount: 0,
        createdAt: new Date().toISOString(),
        status: 'draft',
        visibility: data.visibility,
        schoolId: 'school-1',
      }
      return newCourse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherCourses'] })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TeacherCourse> }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherCourses'] })
      queryClient.invalidateQueries({ queryKey: ['teacherCourse'] })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (courseId: string) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return courseId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherCourses'] })
    },
  })
}

export function useSubmitForReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (courseId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return courseId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherCourses'] })
      queryClient.invalidateQueries({ queryKey: ['teacherCourse'] })
    },
  })
}
