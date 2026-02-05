import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { usePermissions } from '../hooks/usePermissions'
import type { UserRole } from '../types'

interface RoleGuardProps {
  children: ReactNode
  roles: UserRole[]
  requireSchoolId?: boolean
}

function RoleGuard({ children, roles, requireSchoolId = false }: RoleGuardProps) {
  const { hasRole, user } = usePermissions()

  if (!hasRole(roles)) {
    return <Navigate to="/forbidden" replace />
  }

  if (requireSchoolId && !user?.schoolId) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}

export default RoleGuard
