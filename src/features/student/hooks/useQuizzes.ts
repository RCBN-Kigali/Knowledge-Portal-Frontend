import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../lib/api'
import type { Quiz, QuizAttempt, QuizAnswer } from '../../../types'

export function useQuiz(id: string | undefined) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const { data } = await api.get<Quiz>(`/quizzes/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ quizId, answers }: { quizId: string; answers: QuizAnswer[] }) => {
      const { data } = await api.post<QuizAttempt>(`/quizzes/${quizId}/submit`, { answers })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseContent'] })
      queryClient.invalidateQueries({ queryKey: ['lesson'] })
    },
  })
}
