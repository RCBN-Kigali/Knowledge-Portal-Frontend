import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export function RoleRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />
  }

  return children
}

RoleRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RoleRoute
