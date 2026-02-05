import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'

export interface IndependentTeacher {
  id: string
  name: string
  email: string
  bio?: string
  avatarUrl?: string
  courseCount: number
  status: 'pending' | 'approved' | 'rejected'
  appliedAt: string
  approvedAt?: string
  rejectionReason?: string
}

export interface IndependentTeachersFilters {
  search?: string
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  perPage?: number
}

export interface IndependentTeachersResponse {
  teachers: IndependentTeacher[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

const MOCK_INDEPENDENT_TEACHERS: IndependentTeacher[] = [
  {
    id: 'it-1',
    name: 'Dr. Mukamana',
    email: 'dr.mukamana@independent.edu',
    bio: 'Agricultural scientist with 15 years of experience in sustainable farming practices.',
    courseCount: 3,
    status: 'approved',
    appliedAt: '2024-01-01T10:00:00Z',
    approvedAt: '2024-01-05T14:30:00Z',
  },
  {
    id: 'it-2',
    name: 'Prof. Habimana',
    email: 'prof.habimana@independent.edu',
    bio: 'Mathematics professor and researcher specializing in applied statistics.',
    courseCount: 5,
    status: 'approved',
    appliedAt: '2023-10-15T09:00:00Z',
    approvedAt: '2023-10-20T11:00:00Z',
  },
  {
    id: 'it-3',
    name: 'Dr. Uwimana',
    email: 'dr.uwimana@independent.edu',
    bio: 'Science educator and curriculum developer with focus on environmental studies.',
    courseCount: 0,
    status: 'pending',
    appliedAt: '2024-01-10T15:00:00Z',
  },
  {
    id: 'it-4',
    name: 'Mr. Niyonzima',
    email: 'mr.niyonzima@independent.edu',
    bio: 'Language and literature specialist.',
    courseCount: 0,
    status: 'rejected',
    appliedAt: '2023-12-01T08:00:00Z',
    rejectionReason: 'Insufficient qualifications documentation provided.',
  },
  {
    id: 'it-5',
    name: 'Dr. Nshimiyimana',
    email: 'dr.nshimiyimana@independent.edu',
    bio: 'Climate change researcher and environmental policy expert.',
    courseCount: 0,
    status: 'pending',
    appliedAt: '2024-01-12T10:30:00Z',
  },
]

export function useIndependentTeachers(filters: IndependentTeachersFilters = {}) {
  const { user } = useAuth()
  const { search, status, page = 1, perPage = 10 } = filters
  
  return useQuery({
    queryKey: ['independentTeachers', search, status, page, perPage],
    queryFn: async (): Promise<IndependentTeachersResponse> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let filtered = [...MOCK_INDEPENDENT_TEACHERS]
      
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(t => 
          t.name.toLowerCase().includes(s) || 
          t.email.toLowerCase().includes(s)
        )
      }
      
      if (status) {
        filtered = filtered.filter(t => t.status === status)
      }
      
      const total = filtered.length
      const totalPages = Math.ceil(total / perPage)
      const start = (page - 1) * perPage
      const teachers = filtered.slice(start, start + perPage)
      
      return {
        teachers,
        pagination: { page, perPage, total, totalPages },
      }
    },
    enabled: user?.role === 'super_admin',
  })
}

export interface AddIndependentTeacherData {
  name: string
  email: string
  bio?: string
}

export function useAddIndependentTeacher() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: AddIndependentTeacherData): Promise<IndependentTeacher> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newTeacher: IndependentTeacher = {
        id: 'it-' + Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        bio: data.bio,
        courseCount: 0,
        status: 'approved',
        appliedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      }
      return newTeacher
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['independentTeachers'] })
    },
  })
}

export function useUpdateTeacherStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ teacherId, status, reason }: { teacherId: string; status: 'approved' | 'rejected'; reason?: string }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { teacherId, status, reason }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['independentTeachers'] })
    },
  })
}
