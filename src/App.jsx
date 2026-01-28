import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROUTES } from './utils/constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

            <Route path={ROUTES.USERS} element={<ComingSoon title="Users Management" />} />
            <Route path={ROUTES.TEACHERS} element={<ComingSoon title="Teachers" />} />
            <Route path={ROUTES.STUDENTS} element={<ComingSoon title="Students" />} />
            <Route path={ROUTES.SCHOOLS} element={<ComingSoon title="Schools Management" />} />
            <Route path={ROUTES.COURSES} element={<ComingSoon title="All Courses" />} />
            <Route path={ROUTES.MY_COURSES} element={<ComingSoon title="My Courses" />} />
            <Route path={ROUTES.BROWSE_COURSES} element={<ComingSoon title="Browse Courses" />} />
            <Route path={ROUTES.GRADING} element={<ComingSoon title="Grading" />} />
            <Route path={ROUTES.MY_STUDENTS} element={<ComingSoon title="My Students" />} />
            <Route path={ROUTES.MY_GRADES} element={<ComingSoon title="My Grades" />} />
            <Route path={ROUTES.ANNOUNCEMENTS} element={<ComingSoon title="Announcements" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

const ComingSoon = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <p className="text-6xl mb-4">🚧</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">This feature is coming soon!</p>
      <p className="text-sm text-gray-500 mt-2">Week 2-4 implementation</p>
    </div>
  </div>
);

export default App;
