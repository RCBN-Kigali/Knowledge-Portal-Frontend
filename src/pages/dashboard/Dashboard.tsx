import { useAuth } from '../../hooks/useAuth'
import { BookOpen, Users, School, TrendingUp, Clock, Award, FileText, BarChart3 } from 'lucide-react'
import { Card } from '../../components/ui'
import type { User } from '../../types'
import type { ComponentType } from 'react'

interface StatItem {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
  color: string
}

function StatGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function StudentDashboard({ user }: { user: User }) {
  const stats: StatItem[] = [
    { label: 'Courses Enrolled', value: '4', icon: BookOpen, color: 'bg-primary-100 text-primary-600' },
    { label: 'Completed Lessons', value: '12', icon: Award, color: 'bg-success-100 text-success-600' },
    { label: 'Hours Spent', value: '24', icon: Clock, color: 'bg-warning-100 text-warning-600' },
    { label: 'Avg. Score', value: '78%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
        <p className="mt-1 text-gray-600">Continue where you left off</p>
      </div>
      <StatGrid stats={stats} />
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Introduction to Mathematics</p>
              <p className="text-sm text-gray-600">Lesson 5: Fractions</p>
            </div>
            <span className="text-sm text-primary-600 font-medium">Continue</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-success-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">English Language</p>
              <p className="text-sm text-gray-600">Quiz completed - Score: 85%</p>
            </div>
            <span className="text-sm text-success-600 font-medium">Completed</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

function TeacherDashboard({ user }: { user: User }) {
  const stats: StatItem[] = [
    { label: 'My Courses', value: '3', icon: BookOpen, color: 'bg-primary-100 text-primary-600' },
    { label: 'Total Students', value: '86', icon: Users, color: 'bg-success-100 text-success-600' },
    { label: 'Pending Reviews', value: '12', icon: FileText, color: 'bg-warning-100 text-warning-600' },
    { label: 'Avg. Performance', value: '72%', icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
        <p className="mt-1 text-gray-600">Here is your teaching overview</p>
      </div>
      <StatGrid stats={stats} />
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-warning-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Mathematics Quiz - Chapter 3</p>
              <p className="text-sm text-gray-600">8 submissions pending review</p>
            </div>
            <span className="text-sm text-warning-600 font-medium">Review</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

function AdminDashboard() {
  const stats: StatItem[] = [
    { label: 'Total Students', value: '520', icon: Users, color: 'bg-primary-100 text-primary-600' },
    { label: 'Total Teachers', value: '40', icon: Users, color: 'bg-success-100 text-success-600' },
    { label: 'Active Courses', value: '24', icon: BookOpen, color: 'bg-warning-100 text-warning-600' },
    { label: 'Schools', value: '4', icon: School, color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">System overview and management</p>
      </div>
      <StatGrid stats={stats} />
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Platform Activity</p>
              <p className="text-sm text-gray-600">128 active users today</p>
            </div>
            <span className="text-sm text-success-600 font-medium">Active</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case 'super_admin':
    case 'school_admin':
      return <AdminDashboard />
    case 'school_teacher':
    case 'independent_teacher':
      return <TeacherDashboard user={user} />
    case 'school_student':
    case 'school_student':
    default:
      return <StudentDashboard user={user} />
  }
}

export default Dashboard
