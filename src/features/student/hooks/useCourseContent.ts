import { useQuery } from '@tanstack/react-query'
import api from '../../../lib/api'
import type { Course, Module } from '../../../types'

interface CourseContent extends Course {
  modules: Module[]
}

export function useCourseContent(id: string | undefined) {
  return useQuery({
    queryKey: ['courseContent', id],
    queryFn: async () => {
      const { data } = await api.get<CourseContent>(`/courses/${id}`)
      return data
    },
    enabled: !!id,
  })
}
