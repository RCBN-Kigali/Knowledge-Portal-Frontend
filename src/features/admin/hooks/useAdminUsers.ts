import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { UserRole } from '../../../types'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  schoolId: string | null
  schoolName?: string
  status: 'active' | 'inactive'
  avatarUrl?: string
  createdAt: string
  lastLoginAt?: string
}

export interface AdminUsersFilters {
  search?: string
  role?: UserRole | 'all'
  status?: 'active' | 'inactive' | 'all'
  schoolId?: string
  page?: number
  perPage?: number
}

export interface AdminUsersResponse {
  users: AdminUser[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

const MOCK_USERS: AdminUser[] = [
  { id: 'u1', name: 'Jean Baptiste', email: 'jean@student.edu', role: 'school_student', schoolId: 'school-1', schoolName: 'Paysannat Main Campus', status: 'active', createdAt: '2024-01-15' },
  { id: 'u2', name: 'Marie Claire', email: 'marie@student.edu', role: 'school_student', schoolId: 'school-1', schoolName: 'Paysannat Main Campus', status: 'active', createdAt: '2024-01-14' },
  { id: 'u3', name: 'Paul Mugisha', email: 'paul@student.edu', role: 'school_student', schoolId: 'school-1', schoolName: 'Paysannat Main Campus', status: 'inactive', createdAt: '2024-01-13' },
  { id: 'u4', name: 'Alice Uwimana', email: 'alice@teacher.edu', role: 'school_teacher', schoolId: 'school-1', schoolName: 'Paysannat Main Campus', status: 'active', createdAt: '2024-01-10' },
  { id: 'u5', name: 'Eric Habimana', email: 'eric@teacher.edu', role: 'school_teacher', schoolId: 'school-1', schoolName: 'Paysannat Main Campus', status: 'active', createdAt: '2024-01-08' },
  { id: 'u6', name: 'Grace Mukamana', email: 'grace@student.edu', role: 'school_student', schoolId: 'school-2', schoolName: 'Paysannat Eastern', status: 'active', createdAt: '2024-01-12' },
  { id: 'u7', name: 'David Niyonzima', email: 'david@teacher.edu', role: 'school_teacher', schoolId: 'school-2', schoolName: 'Paysannat Eastern', status: 'active', createdAt: '2024-01-05' },
  { id: 'u8', name: 'Dr. Mukamana', email: 'dr.mukamana@independent.edu', role: 'independent_teacher', schoolId: null, status: 'active', createdAt: '2024-01-01' },
]

export function useAdminUsers(filters: AdminUsersFilters = {}) {
  const { user } = useAuth()
  const { search, role, status, schoolId, page = 1, perPage = 10 } = filters
  
  return useQuery({
    queryKey: ['adminUsers', user?.schoolId, search, role, status, schoolId, page, perPage],
    queryFn: async (): Promise<AdminUsersResponse> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let filtered = [...MOCK_USERS]
      
      // School admin can only see their school's users
      if (user?.role === 'school_admin') {
        filtered = filtered.filter(u => u.schoolId === user.schoolId)
      } else if (schoolId && schoolId !== 'all') {
        filtered = filtered.filter(u => u.schoolId === schoolId)
      }
      
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(u => 
          u.name.toLowerCase().includes(s) || 
          u.email.toLowerCase().includes(s)
        )
      }
      
      if (role && role !== 'all') {
        filtered = filtered.filter(u => u.role === role)
      }
      
      if (status && status !== 'all') {
        filtered = filtered.filter(u => u.status === status)
      }
      
      const total = filtered.length
      const totalPages = Math.ceil(total / perPage)
      const start = (page - 1) * perPage
      const paged = filtered.slice(start, start + perPage)
      
      return {
        users: paged,
        pagination: { page, perPage, total, totalPages },
      }
    },
    enabled: user?.role === 'school_admin' || user?.role === 'super_admin',
  })
}

export interface CreateUserData {
  name: string
  email: string
  role: UserRole
  schoolId?: string
  sendWelcomeEmail?: boolean
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateUserData): Promise<{ user: AdminUser; tempPassword: string }> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
      const newUser: AdminUser = {
        id: `u-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        schoolId: data.schoolId || null,
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      return { user: newUser, tempPassword }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AdminUser> }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userId: string) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return userId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}

export function useActivateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userId: string) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return userId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (userId: string): Promise<{ tempPassword: string }> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
      return { tempPassword }
    },
  })
}
