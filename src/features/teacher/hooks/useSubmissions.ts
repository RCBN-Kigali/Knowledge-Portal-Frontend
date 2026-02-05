import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Submission } from '../../../types'

const MOCK_SUBMISSIONS: Submission[] = [
  { id: 'sub1', assignmentId: 'a1', assignmentTitle: 'Geometry Assignment', lessonId: 'l5', courseId: 'tc-1', courseName: 'Introduction to Mathematics', studentId: 's1', studentName: 'Jean Baptiste', submittedAt: '2024-03-10T10:30:00Z', status: 'pending', maxScore: 100, text: 'My solution to the geometry problems...' },
  { id: 'sub2', assignmentId: 'a1', assignmentTitle: 'Geometry Assignment', lessonId: 'l5', courseId: 'tc-1', courseName: 'Introduction to Mathematics', studentId: 's2', studentName: 'Marie Claire', submittedAt: '2024-03-10T11:00:00Z', status: 'pending', maxScore: 100, fileUrl: '/files/marie-assignment.pdf', fileName: 'marie-assignment.pdf' },
  { id: 'sub3', assignmentId: 'a2', assignmentTitle: 'Physics Lab Report', lessonId: 'l10', courseId: 'tc-2', courseName: 'Advanced Physics', studentId: 's3', studentName: 'Paul Kagame', submittedAt: '2024-03-09T14:00:00Z', status: 'graded', maxScore: 50, score: 42, feedback: 'Good work!', text: 'Lab report content...', gradedAt: '2024-03-10T09:00:00Z' },
]

export function useSubmissions(filters?: { courseId?: string; status?: 'pending' | 'graded' }) {
  return useQuery({
    queryKey: ['submissions', filters],
    queryFn: async (): Promise<Submission[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      let subs = [...MOCK_SUBMISSIONS]
      if (filters?.courseId) {
        subs = subs.filter(s => s.courseId === filters.courseId)
      }
      if (filters?.status) {
        subs = subs.filter(s => s.status === filters.status)
      }
      return subs
    },
  })
}

export function useSubmission(id: string | undefined) {
  return useQuery({
    queryKey: ['submission', id],
    queryFn: async (): Promise<Submission | null> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return MOCK_SUBMISSIONS.find(s => s.id === id) || null
    },
    enabled: !!id,
  })
}

export function useGradeSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ submissionId, score, feedback }: { submissionId: string; score: number; feedback?: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return { submissionId, score, feedback }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      queryClient.invalidateQueries({ queryKey: ['submission'] })
      queryClient.invalidateQueries({ queryKey: ['teacherDashboard'] })
    },
  })
}
