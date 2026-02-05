import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { User } from '../../../types'

interface TeacherStudent extends User {
  enrolledCourses: number
  averageProgress: number
}

const MOCK_STUDENTS: TeacherStudent[] = [
  { id: 's1', email: 'jean@student.edu', name: 'Jean Baptiste', role: 'school_student', schoolId: 'school-1', schoolName: 'Paysannat Main', permissions: [], enrolledCourses: 3, averageProgress: 65 },
  { id: 's2', email: 'marie@student.edu', name: 'Marie Claire', role: 'school_student', schoolId: 'school-1', schoolName: 'Paysannat Main', permissions: [], enrolledCourses: 2, averageProgress: 80 },
  { id: 's3', email: 'paul@student.edu', name: 'Paul Kagame', role: 'school_student', schoolId: 'school-1', schoolName: 'Paysannat Main', permissions: [], enrolledCourses: 4, averageProgress: 45 },
]

export function useTeacherStudents(search?: string) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['teacherStudents', user?.schoolId, search],
    queryFn: async (): Promise<TeacherStudent[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      let students = [...MOCK_STUDENTS]
      if (search) {
        const s = search.toLowerCase()
        students = students.filter(st => st.name.toLowerCase().includes(s) || st.email.toLowerCase().includes(s))
      }
      return students
    },
    enabled: user?.role === 'school_teacher',
  })
}

export function useEnrollStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ studentId, courseId }: { studentId: string; courseId: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return { studentId, courseId }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherStudents'] })
      queryClient.invalidateQueries({ queryKey: ['teacherCourses'] })
    },
  })
}
