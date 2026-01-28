import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ROUTES } from '../utils/constants';

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default RoleRoute;
