import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Lesson, LessonContent, LessonType } from '../../../types'
import { MOCK_MODULES } from './useModules'

export function useCreateLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ moduleId, title, type, durationMinutes, content }: { 
      moduleId: string
      title: string
      type: LessonType
      durationMinutes?: number
      content?: LessonContent
    }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Find the module and add the lesson
      for (const courseId in MOCK_MODULES) {
        const module = MOCK_MODULES[courseId].find(m => m.id === moduleId)
        if (module) {
          const newLesson: Lesson = {
            id: `les-${Date.now()}`,
            moduleId,
            title,
            type,
            order: (module.lessons?.length || 0) + 1,
            durationMinutes,
            content,
          }
          if (!module.lessons) {
            module.lessons = []
          }
          module.lessons.push(newLesson)
          return { lesson: newLesson, courseId }
        }
      }
      throw new Error('Module not found')
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['modules', result.courseId] })
    },
  })
}

export function useUpdateLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lesson> }) => {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Find and update the lesson
      for (const courseId in MOCK_MODULES) {
        for (const module of MOCK_MODULES[courseId]) {
          const lessonIndex = module.lessons?.findIndex(l => l.id === id)
          if (lessonIndex !== undefined && lessonIndex !== -1 && module.lessons) {
            module.lessons[lessonIndex] = {
              ...module.lessons[lessonIndex],
              ...data,
            }
            return { lesson: module.lessons[lessonIndex], courseId }
          }
        }
      }
      throw new Error('Lesson not found')
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['modules', result.courseId] })
    },
  })
}

export function useDeleteLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (lessonId: string) => {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Find and delete the lesson
      for (const courseId in MOCK_MODULES) {
        for (const module of MOCK_MODULES[courseId]) {
          const lessonIndex = module.lessons?.findIndex(l => l.id === lessonId)
          if (lessonIndex !== undefined && lessonIndex !== -1 && module.lessons) {
            module.lessons.splice(lessonIndex, 1)
            // Reorder remaining lessons
            module.lessons.forEach((l, i) => { l.order = i + 1 })
            return { lessonId, courseId }
          }
        }
      }
      throw new Error('Lesson not found')
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['modules', result.courseId] })
    },
  })
}

export function useReorderLesson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ moduleId, lessonId, direction }: { moduleId: string; lessonId: string; direction: 'up' | 'down' }) => {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      for (const courseId in MOCK_MODULES) {
        const module = MOCK_MODULES[courseId].find(m => m.id === moduleId)
        if (module && module.lessons) {
          const currentIndex = module.lessons.findIndex(l => l.id === lessonId)
          if (currentIndex === -1) continue
          
          const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
          if (newIndex < 0 || newIndex >= module.lessons.length) return { courseId }
          
          // Swap lessons
          const temp = module.lessons[currentIndex]
          module.lessons[currentIndex] = module.lessons[newIndex]
          module.lessons[newIndex] = temp
          
          // Update order
          module.lessons.forEach((l, i) => { l.order = i + 1 })
          
          return { courseId }
        }
      }
      throw new Error('Module or lesson not found')
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['modules', result.courseId] })
    },
  })
}
