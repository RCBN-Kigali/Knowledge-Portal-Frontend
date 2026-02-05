import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Redirects to the appropriate dashboard based on user role
export default function DashboardRedirect() {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  switch (user.role) {
    case 'super_admin':
      return <Navigate to="/superadmin/dashboard" replace />
    case 'school_admin':
      return <Navigate to="/admin/dashboard" replace />
    case 'school_teacher':
    case 'independent_teacher':
      return <Navigate to="/teacher/dashboard" replace />
    case 'school_student':
    default:
      return <Navigate to="/student/dashboard" replace />
  }
}
