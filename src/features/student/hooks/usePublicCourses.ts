import { useQuery } from '@tanstack/react-query'
import type { Course, PaginatedResponse, CourseCategory, DifficultyLevel } from '../../../types'
import { MOCK_COURSES } from './useCourses'

export interface CourseFilters {
  search?: string
  category?: CourseCategory
  difficulty?: DifficultyLevel
  page?: number
  perPage?: number
}

export function usePublicCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: ['publicCourses', filters],
    queryFn: async (): Promise<PaginatedResponse<Course>> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Only show public courses
      let filtered = MOCK_COURSES.filter(c => c.isPublic)
      
      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.teacher.name.toLowerCase().includes(searchLower)
        )
      }
      
      // Filter by category
      if (filters.category) {
        filtered = filtered.filter(c => c.category === filters.category)
      }
      
      // Filter by difficulty
      if (filters.difficulty) {
        filtered = filtered.filter(c => c.difficulty === filters.difficulty)
      }
      
      // Pagination
      const page = filters.page || 1
      const perPage = filters.perPage || 12
      const start = (page - 1) * perPage
      const end = start + perPage
      const paginated = filtered.slice(start, end)
      
      return {
        data: paginated,
        pagination: {
          page,
          perPage,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / perPage),
        },
      }
    },
  })
}
