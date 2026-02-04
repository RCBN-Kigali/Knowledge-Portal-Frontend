import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, Users, Clock, ArrowRight, 
  PlusCircle, ClipboardList, CheckCircle,
  Building2, FileText
} from 'lucide-react'
import { Card, Button, ProgressBar, Badge } from '../../components/ui'
import { PageHeader } from '../../components/layout'
import useAuthStore from '../../stores/authStore'

// Stat card component
function StatCard({ icon: Icon, label, value, color = 'primary', onClick }) {
  return (
    <Card 
      variant={onClick ? 'interactive' : 'default'} 
      padding="md"
      onClick={onClick}
      className="text-center"
    >
      <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-${color}-100 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </Card>
  )
}

// Course card for students
function CourseCard({ title, progress, lastAccessed }) {
  return (
    <Card variant="interactive" padding="md">
      <h3 className="font-semibold text-gray-900 mb-2 truncate">{title}</h3>
      <ProgressBar value={progress} max={100} size="sm" className="mb-2" />
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">{progress}% complete</span>
        <span className="text-gray-400">{lastAccessed}</span>
      </div>
    </Card>
  )
}

// Activity item
function ActivityItem({ icon: Icon, title, subtitle, time }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-sm text-gray-500 truncate">{subtitle}</p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
    </div>
  )
}

// Student Dashboard
function StudentDashboard({ user }) {
  const navigate = useNavigate()

  // Mock data - would come from API
  const enrolledCourses = [
    { id: 1, title: 'Introduction to Mathematics', progress: 65, lastAccessed: '2 hours ago' },
    { id: 2, title: 'English Language Basics', progress: 40, lastAccessed: 'Yesterday' },
    { id: 3, title: 'Science Fundamentals', progress: 20, lastAccessed: '3 days ago' },
  ]

  const upcomingDeadlines = [
    { id: 1, title: 'Math Quiz Chapter 5', course: 'Introduction to Mathematics', due: 'Tomorrow' },
    { id: 2, title: 'Essay Assignment', course: 'English Language Basics', due: 'In 3 days' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-1">Continue where you left off</p>
      </div>

      {/* Continue Learning */}
      {enrolledCourses[0] && (
        <Card className="bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-primary-700">Continue Learning</span>
            <Badge variant="primary" size="sm">{enrolledCourses[0].progress}%</Badge>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">{enrolledCourses[0].title}</h3>
          <ProgressBar value={enrolledCourses[0].progress} max={100} variant="primary" />
          <Button className="mt-4" onClick={() => navigate(`/courses/${enrolledCourses[0].id}`)}>
            Resume Course
          </Button>
        </Card>
      )}

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-courses')}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
        </div>
        <Card padding="none">
          {upcomingDeadlines.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {upcomingDeadlines.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.course}</p>
                  </div>
                  <Badge variant="warning" size="sm">{item.due}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No upcoming deadlines
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// Teacher Dashboard
function TeacherDashboard({ user }) {
  const navigate = useNavigate()

  // Mock data
  const stats = {
    courses: 5,
    students: 142,
    pending: 23,
  }

  const recentActivity = [
    { icon: FileText, title: 'New submission', subtitle: 'John Doe submitted Math Quiz', time: '2h ago' },
    { icon: Users, title: 'New enrollment', subtitle: 'Sarah joined English Basics', time: '5h ago' },
    { icon: FileText, title: 'New submission', subtitle: 'Mike submitted Essay', time: '1d ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(' ')[0]}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your courses</p>
        </div>
        <Button onClick={() => navigate('/courses/new')} leftIcon={<PlusCircle className="w-5 h-5" />}>
          Create Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        <StatCard icon={BookOpen} label="Courses" value={stats.courses} color="primary" />
        <StatCard icon={Users} label="Students" value={stats.students} color="success" />
        <StatCard 
          icon={ClipboardList} 
          label="Pending" 
          value={stats.pending} 
          color="warning"
          onClick={() => navigate('/grading')}
        />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card padding="none">
          <div className="divide-y divide-gray-200 px-4">
            {recentActivity.map((item, index) => (
              <ActivityItem key={index} {...item} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Admin Dashboard
function AdminDashboard({ user }) {
  const navigate = useNavigate()

  // Mock data
  const stats = {
    teachers: 12,
    students: 4521,
    courses: 34,
    pending: 3,
  }

  const pendingReviews = [
    { id: 1, title: 'Advanced Mathematics', teacher: 'John Smith', submitted: '2 days ago' },
    { id: 2, title: 'Physics 101', teacher: 'Jane Doe', submitted: '3 days ago' },
    { id: 3, title: 'Chemistry Basics', teacher: 'Bob Wilson', submitted: '5 days ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-1">System overview and pending tasks</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={Users} 
          label="Teachers" 
          value={stats.teachers} 
          color="primary"
          onClick={() => navigate('/admin/users?role=teacher')}
        />
        <StatCard 
          icon={Users} 
          label="Students" 
          value={stats.students.toLocaleString()} 
          color="success"
          onClick={() => navigate('/admin/users?role=student')}
        />
        <StatCard 
          icon={BookOpen} 
          label="Courses" 
          value={stats.courses} 
          color="primary"
          onClick={() => navigate('/courses')}
        />
        <StatCard 
          icon={CheckCircle} 
          label="Pending Review" 
          value={stats.pending} 
          color="warning"
          onClick={() => navigate('/admin/reviews')}
        />
      </div>

      {/* Pending Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Course Reviews</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/reviews')}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <Card padding="none">
          {pendingReviews.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {pendingReviews.map((course) => (
                <div key={course.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-500">by {course.teacher}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="warning" size="sm">Pending</Badge>
                    <p className="text-xs text-gray-400 mt-1">{course.submitted}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No courses pending review
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// Main Dashboard component
export function Dashboard() {
  const { user } = useAuthStore()

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard user={user} />
    case 'teacher':
      return <TeacherDashboard user={user} />
    default:
      return <StudentDashboard user={user} />
  }
}

export default Dashboard
