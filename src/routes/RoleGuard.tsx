import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'
import { roleHome } from './roleHome'

interface Props {
  roles: UserRole[]
  children: ReactNode
}

export default function RoleGuard({ roles, children }: Props) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to={roleHome(user.role)} replace />
  return <>{children}</>
}
