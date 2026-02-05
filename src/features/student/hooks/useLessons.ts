import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Lesson } from '../../../types'
import { MOCK_COURSE_CONTENT } from './useCourseContent'

// Get all lessons from mock course content
function getAllMockLessons(): Lesson[] {
  const lessons: Lesson[] = []
  for (const courseContent of Object.values(MOCK_COURSE_CONTENT)) {
    for (const module of courseContent.modules) {
      lessons.push(...module.lessons)
    }
  }
  return lessons
}

export function useLesson(id: string | undefined) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: async (): Promise<Lesson | undefined> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200))

      if (!id) return undefined

      const allLessons = getAllMockLessons()
      return allLessons.find(l => l.id === id)
    },
    enabled: !!id,
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (lessonId: string) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // In a real app, this would update the server
      // For mock, we just return success
      return { lessonId, completed: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseContent'] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] })
    },
  })
}
