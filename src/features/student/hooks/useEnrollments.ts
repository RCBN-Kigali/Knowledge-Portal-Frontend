import { useQuery } from '@tanstack/react-query'
import api from '../../../lib/api'
import type { Enrollment } from '../../../types'

export function useEnrollments(status?: 'in_progress' | 'completed') {
  return useQuery({
    queryKey: ['enrollments', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : ''
      const { data } = await api.get<Enrollment[]>(`/enrollments${params}`)
      return data
    },
  })
}

export function useEnrollment(id: string | undefined) {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      const { data } = await api.get<Enrollment>(`/enrollments/${id}`)
      return data
    },
    enabled: !!id,
  })
}
