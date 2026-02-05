import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../lib/api'
import type { Lesson } from '../../../types'

export function useLesson(id: string | undefined) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      const { data } = await api.get<Lesson>(`/lessons/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const { data } = await api.post(`/lessons/${lessonId}/complete`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseContent'] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] })
    },
  })
}
