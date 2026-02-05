import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Module } from '../../../types'

// Mock modules data
const MOCK_MODULES: Record<string, Module[]> = {}

export function useModules(courseId: string | undefined) {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: async (): Promise<Module[]> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return MOCK_MODULES[courseId!] || []
    },
    enabled: !!courseId,
  })
}

export function useCreateModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ courseId, title, description }: { courseId: string; title: string; description?: string }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      const newModule: Module = {
        id: `mod-${Date.now()}`,
        courseId,
        title,
        description,
        order: (MOCK_MODULES[courseId]?.length || 0) + 1,
        lessons: [],
      }
      if (!MOCK_MODULES[courseId]) {
        MOCK_MODULES[courseId] = []
      }
      MOCK_MODULES[courseId].push(newModule)
      return newModule
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules', variables.courseId] })
    },
  })
}

export function useUpdateModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, title, description }: { id: string; title: string; description?: string }) => {
      await new Promise(resolve => setTimeout(resolve, 200))
      // Find and update the module in mock data
      for (const courseId in MOCK_MODULES) {
        const moduleIndex = MOCK_MODULES[courseId].findIndex(m => m.id === id)
        if (moduleIndex !== -1) {
          MOCK_MODULES[courseId][moduleIndex] = {
            ...MOCK_MODULES[courseId][moduleIndex],
            title,
            description,
          }
          return MOCK_MODULES[courseId][moduleIndex]
        }
      }
      throw new Error('Module not found')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] })
    },
  })
}

export function useDeleteModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (moduleId: string) => {
      await new Promise(resolve => setTimeout(resolve, 200))
      for (const courseId in MOCK_MODULES) {
        const moduleIndex = MOCK_MODULES[courseId].findIndex(m => m.id === moduleId)
        if (moduleIndex !== -1) {
          MOCK_MODULES[courseId].splice(moduleIndex, 1)
          // Reorder remaining modules
          MOCK_MODULES[courseId].forEach((m, i) => { m.order = i + 1 })
          return moduleId
        }
      }
      throw new Error('Module not found')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] })
    },
  })
}

export function useReorderModules() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ courseId, moduleId, direction }: { courseId: string; moduleId: string; direction: 'up' | 'down' }) => {
      await new Promise(resolve => setTimeout(resolve, 200))
      const modules = MOCK_MODULES[courseId] || []
      const currentIndex = modules.findIndex(m => m.id === moduleId)
      if (currentIndex === -1) throw new Error('Module not found')
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= modules.length) return modules
      
      // Swap modules
      const temp = modules[currentIndex]
      modules[currentIndex] = modules[newIndex]
      modules[newIndex] = temp
      
      // Update order
      modules.forEach((m, i) => { m.order = i + 1 })
      
      return modules
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modules', variables.courseId] })
    },
  })
}

// Export for use in lessons hook
export { MOCK_MODULES }
