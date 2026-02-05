import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../lib/api'
import type { AssignmentSubmission } from '../../../types'

export function useSubmitAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ assignmentId, text, file }: { assignmentId: string; text?: string; file?: File }) => {
      const formData = new FormData()
      if (text) formData.append('text', text)
      if (file) formData.append('file', file)
      const { data } = await api.post<AssignmentSubmission>(`/assignments/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseContent'] })
      queryClient.invalidateQueries({ queryKey: ['lesson'] })
    },
  })
}
