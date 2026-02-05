import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { User, Course } from '../../../types'

// Types for enrolled students (school teacher)
export interface EnrolledStudent {
  id: string
  name: string
  email: string
  avatarUrl?: string
  enrolledCourses: { id: string; title: string; progress: number }[]
  overallProgress: number
  lastActiveAt: string
}

// Types for non-enrolled students (school teacher)
export interface SchoolStudent {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

// Types for independent teacher students
export interface IndependentTeacherStudent {
  id: string
  name: string
  email: string
  avatarUrl?: string
  schoolName: string
  courseName: string
  courseId: string
  progress: number
  lastActiveAt: string
}

// Mock data for enrolled students
const MOCK_ENROLLED_STUDENTS: EnrolledStudent[] = [
  {
    id: 's1',
    name: 'Jean Baptiste',
    email: 'jean@student.edu',
    enrolledCourses: [
      { id: 'c1', title: 'Introduction to Mathematics', progress: 75 },
      { id: 'c2', title: 'Basic Science', progress: 45 },
    ],
    overallProgress: 60,
    lastActiveAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 's2',
    name: 'Marie Claire',
    email: 'marie@student.edu',
    enrolledCourses: [
      { id: 'c1', title: 'Introduction to Mathematics', progress: 90 },
    ],
    overallProgress: 90,
    lastActiveAt: '2024-01-14T14:20:00Z',
  },
  {
    id: 's3',
    name: 'Paul Mugisha',
    email: 'paul@student.edu',
    enrolledCourses: [
      { id: 'c1', title: 'Introduction to Mathematics', progress: 30 },
      { id: 'c2', title: 'Basic Science', progress: 55 },
      { id: 'c3', title: 'English Language', progress: 80 },
    ],
    overallProgress: 55,
    lastActiveAt: '2024-01-13T09:15:00Z',
  },
]

// Mock data for non-enrolled students
const MOCK_NON_ENROLLED_STUDENTS: SchoolStudent[] = [
  { id: 's4', name: 'Alice Uwimana', email: 'alice@student.edu' },
  { id: 's5', name: 'Eric Habimana', email: 'eric@student.edu' },
  { id: 's6', name: 'Grace Mukamana', email: 'grace@student.edu' },
  { id: 's7', name: 'David Niyonzima', email: 'david@student.edu' },
]

// Mock data for independent teacher students
const MOCK_INDEPENDENT_STUDENTS: IndependentTeacherStudent[] = [
  {
    id: 'is1',
    name: 'Jean Baptiste',
    email: 'jean@school1.edu',
    schoolName: 'Paysannat Main Campus',
    courseName: 'Advanced Agriculture',
    courseId: 'c1',
    progress: 65,
    lastActiveAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'is2',
    name: 'Marie Claire',
    email: 'marie@school2.edu',
    schoolName: 'Paysannat Eastern',
    courseName: 'Advanced Agriculture',
    courseId: 'c1',
    progress: 80,
    lastActiveAt: '2024-01-14T14:20:00Z',
  },
  {
    id: 'is3',
    name: 'Paul Kagame',
    email: 'paul@school3.edu',
    schoolName: 'Green Hills Academy',
    courseName: 'Sustainable Farming',
    courseId: 'c2',
    progress: 45,
    lastActiveAt: '2024-01-13T09:15:00Z',
  },
]

// Hook for enrolled students (school teacher)
export function useEnrolledStudents(search?: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['enrolledStudents', user?.schoolId, search],
    queryFn: async (): Promise<EnrolledStudent[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      let students = [...MOCK_ENROLLED_STUDENTS]
      if (search) {
        const s = search.toLowerCase()
        students = students.filter(st => 
          st.name.toLowerCase().includes(s) || 
          st.email.toLowerCase().includes(s)
        )
      }
      return students
    },
    enabled: user?.role === 'school_teacher',
  })
}

// Hook for non-enrolled students (school teacher)
export function useNonEnrolledStudents(search?: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['nonEnrolledStudents', user?.schoolId, search],
    queryFn: async (): Promise<SchoolStudent[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      let students = [...MOCK_NON_ENROLLED_STUDENTS]
      if (search) {
        const s = search.toLowerCase()
        students = students.filter(st => 
          st.name.toLowerCase().includes(s) || 
          st.email.toLowerCase().includes(s)
        )
      }
      return students
    },
    enabled: user?.role === 'school_teacher',
  })
}

// Hook for independent teacher students
export function useIndependentTeacherStudents(search?: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['independentStudents', user?.id, search],
    queryFn: async (): Promise<IndependentTeacherStudent[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      let students = [...MOCK_INDEPENDENT_STUDENTS]
      if (search) {
        const s = search.toLowerCase()
        students = students.filter(st => 
          st.name.toLowerCase().includes(s) || 
          st.email.toLowerCase().includes(s) ||
          st.schoolName.toLowerCase().includes(s)
        )
      }
      return students
    },
    enabled: user?.role === 'independent_teacher',
  })
}

// Mutation to enroll students in courses
export function useEnrollStudents() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ studentIds, courseIds }: { studentIds: string[]; courseIds: string[] }) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      // In real app, this would call the API
      return { studentIds, courseIds, enrolledCount: studentIds.length * courseIds.length }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledStudents'] })
      queryClient.invalidateQueries({ queryKey: ['nonEnrolledStudents'] })
    },
  })
}

// Legacy export for backwards compatibility
export function useTeacherStudents(search?: string) {
  return useEnrolledStudents(search)
}

export function useEnrollStudent() {
  const enrollStudents = useEnrollStudents()
  return {
    ...enrollStudents,
    mutateAsync: async ({ studentId, courseId }: { studentId: string; courseId: string }) => {
      return enrollStudents.mutateAsync({ studentIds: [studentId], courseIds: [courseId] })
    },
  }
}
