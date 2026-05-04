import type { UserRole } from '../types'

export function roleHome(role: UserRole): string {
  switch (role) {
    case 'student': return '/student'
    case 'teacher': return '/teacher/dashboard'
    case 'admin': return '/admin/dashboard'
  }
}
