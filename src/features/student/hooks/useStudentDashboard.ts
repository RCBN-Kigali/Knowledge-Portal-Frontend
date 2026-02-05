import { useQuery } from '@tanstack/react-query'
import api from '../../../lib/api'
import type { StudentDashboardData } from '../../../types'

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: async () => {
      const { data } = await api.get<StudentDashboardData>('/students/dashboard')
      return data
    },
  })
}
