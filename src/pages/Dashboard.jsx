import useAuthStore from '../store/authStore';
import Card from '../components/common/Card';
import { capitalizeFirstLetter, formatDate } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuthStore();

  const getRoleSpecificCards = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Total Users', value: '---', icon: '👥', color: 'bg-blue-500' },
          { title: 'Total Schools', value: '4', icon: '🏫', color: 'bg-green-500' },
          { title: 'Total Courses', value: '---', icon: '📚', color: 'bg-purple-500' },
          { title: 'Active Students', value: '20,000+', icon: '🎓', color: 'bg-yellow-500' }
        ];
      case 'teacher':
        return [
          { title: 'My Courses', value: '---', icon: '📚', color: 'bg-blue-500' },
          { title: 'My Students', value: '---', icon: '👥', color: 'bg-green-500' },
          { title: 'Pending Grades', value: '---', icon: '✏️', color: 'bg-yellow-500' },
          { title: 'Announcements', value: '---', icon: '📢', color: 'bg-purple-500' }
        ];
      case 'student':
        return [
          { title: 'Enrolled Courses', value: '---', icon: '📚', color: 'bg-blue-500' },
          { title: 'Assignments Due', value: '---', icon: '📝', color: 'bg-red-500' },
          { title: 'Average Grade', value: '---', icon: '⭐', color: 'bg-green-500' },
          { title: 'Certificates', value: '---', icon: '🏆', color: 'bg-yellow-500' }
        ];
      default:
        return [];
    }
  };

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'admin':
        return 'Manage your schools, users, and oversee all learning activities across the network.';
      case 'teacher':
        return 'Create engaging courses, track student progress, and manage your classroom activities.';
      case 'student':
        return 'Continue your learning journey, complete assignments, and track your academic progress.';
      default:
        return 'Welcome to Knowledge Portal LMS';
    }
  };

  const roleCards = getRoleSpecificCards();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-blue-100 mb-1">{getWelcomeMessage()}</p>
        <div className="flex items-center text-sm text-blue-100 mt-4">
          <span className="mr-4">
            Role: <span className="font-semibold">{capitalizeFirstLetter(user?.role || 'guest')}</span>
          </span>
          <span>
            Last login: <span className="font-semibold">{formatDate(user?.last_login)}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleCards.map((card, index) => (
          <Card key={index} padding={false} className="hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="space-y-3">
            {user?.role === 'admin' && (
              <>
                <QuickActionButton icon="➕" text="Add New User" />
                <QuickActionButton icon="🏫" text="Manage Schools" />
                <QuickActionButton icon="📊" text="View Reports" />
              </>
            )}
            {user?.role === 'teacher' && (
              <>
                <QuickActionButton icon="➕" text="Create Course" />
                <QuickActionButton icon="✏️" text="Grade Assignments" />
                <QuickActionButton icon="📢" text="Post Announcement" />
              </>
            )}
            {user?.role === 'student' && (
              <>
                <QuickActionButton icon="🔍" text="Browse Courses" />
                <QuickActionButton icon="📝" text="View Assignments" />
                <QuickActionButton icon="📊" text="Check Grades" />
              </>
            )}
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">📋</p>
            <p>No recent activity</p>
            <p className="text-sm mt-1">Your activity will appear here</p>
          </div>
        </Card>
      </div>

      <Card title="System Information">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">4</p>
            <p className="text-sm text-gray-600">Total Schools</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">20,000+</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">~40</p>
            <p className="text-sm text-gray-600">Total Teachers</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const QuickActionButton = ({ icon, text }) => (
  <button className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-left">
    <span className="text-2xl mr-3">{icon}</span>
    <span className="text-sm font-medium text-gray-700">{text}</span>
  </button>
);

export default Dashboard;
