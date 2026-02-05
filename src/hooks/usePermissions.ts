import { useAuth } from './useAuth'
import type { UserRole } from '../types'

export function usePermissions() {
  const { user } = useAuth()

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const isSuperAdmin = user?.role === 'super_admin'
  const isSchoolAdmin = user?.role === 'school_admin'
  const isSchoolTeacher = user?.role === 'school_teacher'
  const isSchoolStudent = user?.role === 'school_student'
  const isIndependentTeacher = user?.role === 'independent_teacher'
  const isPublicStudent = user?.role === 'public_student'

  const isAnyAdmin = isSuperAdmin || isSchoolAdmin
  const isAnyTeacher = isSchoolTeacher || isIndependentTeacher
  const isAnyStudent = isSchoolStudent || isPublicStudent
  const isSchoolMember = isSchoolAdmin || isSchoolTeacher || isSchoolStudent

  const belongsToSchool = (schoolId: string): boolean => {
    if (!user || !user.schoolId) return false
    return user.schoolId === schoolId
  }

  return {
    user,
    hasRole,
    hasPermission,
    isSuperAdmin,
    isSchoolAdmin,
    isSchoolTeacher,
    isSchoolStudent,
    isIndependentTeacher,
    isPublicStudent,
    isAnyAdmin,
    isAnyTeacher,
    isAnyStudent,
    isSchoolMember,
    belongsToSchool,
  }
}

export default usePermissions
