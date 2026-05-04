import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { roleHome } from './roleHome'

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (isAuthenticated && user) return <Navigate to={roleHome(user.role)} replace />
  return <>{children}</>
}
