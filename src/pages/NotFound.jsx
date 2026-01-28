import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ROUTES } from '../utils/constants';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <p className="text-9xl">404</p>
          <p className="text-6xl mb-4">📚</p>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to your learning dashboard.
        </p>
        <Link to={ROUTES.DASHBOARD}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
