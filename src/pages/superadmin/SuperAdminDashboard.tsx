import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSuperAdminDashboard } from '../../features/admin/hooks/useAdminDashboard'
import StatsCard from '../../features/admin/components/StatsCard'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { Building2, Users, BookOpen, Clock, UserPlus, CheckSquare, GraduationCap, User, MapPin } from 'lucide-react'

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  const { data: stats, isLoading } = useSuperAdminDashboard()
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Super Admin'}</h1>
        <p className="text-gray-600 mt-1">System-wide overview</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Schools"
          value={stats?.totalSchools || 0}
          icon={<Building2 className="w-6 h-6" />}
          link="/superadmin/schools"
          linkLabel="Manage"
        />
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-6 h-6" />}
          link="/superadmin/users"
          linkLabel="View all"
        />
        <StatsCard
          title="Active Courses"
          value={stats?.activeCourses || 0}
          icon={<BookOpen className="w-6 h-6" />}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          icon={<Clock className="w-6 h-6" />}
          link="/superadmin/approvals"
          linkLabel="Review"
        />
      </div>
      
      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-gray-900">Quick Actions</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-3">
            <Link to="/superadmin/users">
              <Button variant="secondary" leftIcon={<UserPlus className="w-4 h-4" />}>
                Add User
              </Button>
            </Link>
            <Link to="/superadmin/teachers">
              <Button variant="secondary" leftIcon={<User className="w-4 h-4" />}>
                Independent Teachers
                {stats?.independentTeachersPending ? (
                  <Badge variant="warning" size="sm" className="ml-2">{stats.independentTeachersPending}</Badge>
                ) : null}
              </Button>
            </Link>
            <Link to="/superadmin/approvals">
              <Button variant="secondary" leftIcon={<CheckSquare className="w-4 h-4" />}>
                Course Approvals
                {stats?.pendingApprovals ? (
                  <Badge variant="danger" size="sm" className="ml-2">{stats.pendingApprovals}</Badge>
                ) : null}
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
      
      {/* Schools Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Schools Overview</h2>
          <Link to="/superadmin/schools" className="text-sm text-primary-600 hover:text-primary-700">
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats?.schools?.slice(0, 4).map(school => (
            <Link key={school.id} to={`/superadmin/schools/${school.id}`}>
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{school.name}</h3>
                    {school.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4" />
                        {school.location}
                      </div>
                    )}
                  </div>
                </div>
                
                {school.adminName && (
                  <p className="text-sm text-gray-600 mb-4">
                    Admin: <span className="font-medium">{school.adminName}</span>
                  </p>
                )}
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{school.studentCount}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{school.teacherCount}</p>
                    <p className="text-xs text-gray-500">Teachers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{school.courseCount}</p>
                    <p className="text-xs text-gray-500">Courses</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses for Approval */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Pending Course Approvals</h2>
              <Link to="/superadmin/approvals" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {stats?.pendingCourses && stats.pendingCourses.length > 0 ? (
              <div className="space-y-3">
                {stats.pendingCourses.map(course => (
                  <Link 
                    key={course.id} 
                    to={`/superadmin/approvals/${course.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{course.title}</p>
                        <p className="text-sm text-gray-500">by {course.teacherName}</p>
                      </div>
                      <Badge variant={course.teacherType === 'independent' ? 'success' : 'gray'} size="sm">
                        {course.teacherType === 'independent' ? 'Independent' : 'School'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No pending approvals</p>
            )}
          </Card.Body>
        </Card>
        
        {/* Recent Registrations */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Registrations</h2>
              <Link to="/superadmin/users" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            {stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
              <div className="space-y-3">
                {stats.recentRegistrations.map(reg => (
                  <div key={reg.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Avatar name={reg.name} size="sm" />
                      <div>
                        <p className="font-medium text-gray-900">{reg.name}</p>
                        <p className="text-sm text-gray-500">{reg.schoolName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={reg.role === 'school_teacher' ? 'primary' : 'gray'} size="sm">
                        {reg.role === 'school_teacher' ? 'Teacher' : 'Student'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(reg.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent registrations</p>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
