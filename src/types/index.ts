export type UserRole = 'super_admin' | 'school_admin' | 'school_teacher' | 'school_student' | 'independent_teacher' | 'public_student'

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: UserRole
  schoolId: string | null
  schoolName?: string
  avatarUrl?: string
  permissions: string[]
  createdAt?: string
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}
