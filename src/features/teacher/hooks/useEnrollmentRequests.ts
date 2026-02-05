import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { EnrollmentRequest } from '../../../types'

const MOCK_REQUESTS: EnrollmentRequest[] = [
  { id: 'er1', studentId: 's10', studentName: 'Alice Mukamana', studentEmail: 'alice@school.edu', studentSchool: 'Paysannat Eastern', courseId: 'tc-1', courseName: 'Introduction to Mathematics', requestedAt: '2024-03-08T10:00:00Z', status: 'pending' },
  { id: 'er2', studentId: 's11', studentName: 'Bob Habimana', studentEmail: 'bob@school.edu', studentSchool: 'Paysannat Southern', courseId: 'tc-1', courseName: 'Introduction to Mathematics', requestedAt: '2024-03-09T14:30:00Z', status: 'pending' },
  { id: 'er3', studentId: 's12', studentName: 'Claire Uwase', studentEmail: 'claire@school.edu', studentSchool: 'Paysannat Northern', courseId: 'tc-2', courseName: 'Advanced Physics', requestedAt: '2024-03-10T09:00:00Z', status: 'pending' },
]

export function useEnrollmentRequests(status?: 'pending' | 'approved' | 'rejected') {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['enrollmentRequests', status, user?.id],
    queryFn: async (): Promise<EnrollmentRequest[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      let requests = [...MOCK_REQUESTS]
      if (status) {
        requests = requests.filter(r => r.status === status)
      }
      return requests
    },
    enabled: user?.role === 'independent_teacher',
  })
}

export function useApproveRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (requestId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return requestId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentRequests'] })
      queryClient.invalidateQueries({ queryKey: ['teacherDashboard'] })
    },
  })
}

export function useRejectRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason?: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return requestId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentRequests'] })
      queryClient.invalidateQueries({ queryKey: ['teacherDashboard'] })
    },
  })
}
