import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAdminDashboard } from '../../features/admin/hooks/useAdminDashboard'
import StatsCard from '../../features/admin/components/StatsCard'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { Users, BookOpen, GraduationCap, Clock, UserPlus, CheckSquare } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { data: stats, isLoading } = useAdminDashboard()
  
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
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Admin'}</h1>
        <p className="text-gray-600 mt-1">{user?.schoolName} Dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={<GraduationCap className="w-6 h-6" />}
        />
        <StatsCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={<Users className="w-6 h-6" />}
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
          link="/admin/approvals"
          linkLabel="View all"
        />
      </div>
      
      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-gray-900">Quick Actions</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/users">
              <Button variant="secondary" leftIcon={<UserPlus className="w-4 h-4" />}>
                Add User
              </Button>
            </Link>
            <Link to="/admin/approvals">
              <Button variant="secondary" leftIcon={<CheckSquare className="w-4 h-4" />}>
                View Approvals
                {stats?.pendingApprovals ? (
                  <Badge variant="danger" size="sm" className="ml-2">{stats.pendingApprovals}</Badge>
                ) : null}
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
      
      {/* Recent Registrations */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Registrations</h2>
            <Link to="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
              View all &rarr;
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
                      <p className="text-sm text-gray-500">{reg.email}</p>
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
  )
}
