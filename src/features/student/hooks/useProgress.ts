import { useQuery } from '@tanstack/react-query'
import api from '../../../lib/api'
import type { StudentProgress } from '../../../types'

export function useProgress() {
  return useQuery({
    queryKey: ['studentProgress'],
    queryFn: async () => {
      const { data } = await api.get<StudentProgress>('/students/progress')
      return data
    },
  })
}
