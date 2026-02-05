import { useQuery } from '@tanstack/react-query'
import type { Course } from '../../../types'
import { MOCK_COURSES } from './useCourses'

interface PublicCourseModule {
  id: string
  title: string
  description?: string
  order: number
  lessons: { 
    id: string
    title: string
    type: string
    order: number
    durationMinutes?: number 
  }[]
}

interface PublicCourseDetail extends Course {
  modules: PublicCourseModule[]
}

// Mock modules data
const MOCK_MODULES: Record<string, PublicCourseModule[]> = {
  'course-1': [
    { id: 'm1', title: 'Introduction to Algebra', description: 'Basic algebraic concepts', order: 1, lessons: [
      { id: 'l1', title: 'Variables and Constants', type: 'lecture', order: 1, durationMinutes: 15 },
      { id: 'l2', title: 'Simple Equations', type: 'lecture', order: 2, durationMinutes: 20 },
      { id: 'l3', title: 'Practice Quiz', type: 'quiz', order: 3, durationMinutes: 10 },
    ]},
    { id: 'm2', title: 'Geometry Basics', description: 'Shapes and measurements', order: 2, lessons: [
      { id: 'l4', title: 'Points, Lines, and Planes', type: 'lecture', order: 1, durationMinutes: 18 },
      { id: 'l5', title: 'Triangles and Quadrilaterals', type: 'lecture', order: 2, durationMinutes: 22 },
      { id: 'l6', title: 'Geometry Assignment', type: 'assignment', order: 3, durationMinutes: 30 },
    ]},
  ],
  'course-2': [
    { id: 'm3', title: 'Cell Biology', description: 'The building blocks of life', order: 1, lessons: [
      { id: 'l7', title: 'Introduction to Cells', type: 'lecture', order: 1, durationMinutes: 20 },
      { id: 'l8', title: 'Cell Structure', type: 'lecture', order: 2, durationMinutes: 25 },
    ]},
  ],
}

export function usePublicCourse(id: string | undefined) {
  return useQuery({
    queryKey: ['publicCourse', id],
    queryFn: async (): Promise<PublicCourseDetail | null> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const course = MOCK_COURSES.find(c => c.id === id)
      if (!course) return null
      
      return {
        ...course,
        modules: MOCK_MODULES[id!] || [
          { id: 'default-m1', title: 'Module 1', order: 1, lessons: [
            { id: 'default-l1', title: 'Lesson 1', type: 'lecture', order: 1, durationMinutes: 15 },
            { id: 'default-l2', title: 'Lesson 2', type: 'lecture', order: 2, durationMinutes: 20 },
          ]},
        ],
      }
    },
    enabled: !!id,
  })
}
