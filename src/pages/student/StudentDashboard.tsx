import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, Clock, TrendingUp, ArrowRight, Bell, Calendar } from 'lucide-react'
import { Card, ProgressBar, Skeleton, Badge, Button, EmptyState } from '../../components/ui'
import { useStudentDashboard } from '../../features/student/hooks/useStudentDashboard'
import EnrolledCourseCard from '../../features/student/components/EnrolledCourseCard'
import CourseCard from '../../features/student/components/CourseCard'
import { useAuth } from '../../hooks/useAuth'
import { usePermissions } from '../../hooks/usePermissions'

function StudentDashboard() {
  const { user } = useAuth()
  const { isSchoolStudent } = usePermissions()
  const { data, isLoading } = useStudentDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" lines={2} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="card" height="100px" />)}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} variant="card" />)}
        </div>
      </div>
    )
  }

  const stats = [
    { icon: BookOpen, label: 'Enrolled', value: String(data?.stats?.enrolledCount ?? 0), color: 'bg-primary-100 text-primary-600' },
    { icon: CheckCircle2, label: 'Completed', value: String(data?.stats?.completedCount ?? 0), color: 'bg-success-100 text-success-600' },
    { icon: TrendingUp, label: 'Avg Grade', value: `${data?.stats?.averageGrade ?? 0}%`, color: 'bg-warning-100 text-warning-600' },
    { icon: Clock, label: 'Hours Spent', value: String(data?.stats?.hoursSpent ?? 0), color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || user?.name?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-gray-500">Here's your learning overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Continue Learning */}
      {data?.recentCourse && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Continue Learning</h2>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900">{data.recentCourse.course.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{data.recentCourse.course.teacher.name}</p>
              <ProgressBar value={data.recentCourse.progress} max={100} size="sm" showValue className="mt-3" />
            </div>
            <Link to={`/student/learn/${data.recentCourse.id}`}>
              <Button leftIcon={<ArrowRight className="w-4 h-4" />}>Resume</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* School Courses (school students only) */}
      {isSchoolStudent && data?.schoolCourses && data.schoolCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">New School Courses</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.schoolCourses.slice(0, 3).map(course => (
              <CourseCard key={course.id} course={course} linkPrefix="/student/courses" />
            ))}
          </div>
        </div>
      )}

      {/* Enrolled Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
          <Link to="/student/enrollments" className="text-primary-600 text-sm font-medium hover:text-primary-700">
            View All &rarr;
          </Link>
        </div>
        {data?.enrolledCourses && data.enrolledCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.enrolledCourses.slice(0, 6).map(enrollment => (
              <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <Card className="p-8">
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Browse courses and start your learning journey"
              actionLabel="Browse Courses"
              onAction={() => window.location.href = '/student/courses'}
            />
          </Card>
        )}
      </div>

      {/* Bottom row: deadlines + announcements */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Deadlines */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" /> Upcoming Deadlines
          </h2>
          {data?.upcomingDeadlines && data.upcomingDeadlines.length > 0 ? (
            <ul className="space-y-3">
              {data.upcomingDeadlines.map((d, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{d.lessonTitle}</p>
                    <p className="text-gray-500">{d.courseName}</p>
                  </div>
                  <Badge variant={new Date(d.dueDate) < new Date() ? 'danger' : 'warning'} size="sm">
                    {new Date(d.dueDate).toLocaleDateString()}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No upcoming deadlines</p>
          )}
        </Card>

        {/* Announcements */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" /> Recent Announcements
          </h2>
          {data?.announcements && data.announcements.length > 0 ? (
            <ul className="space-y-3">
              {data.announcements.slice(0, 3).map(a => (
                <li key={a.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{a.title}</p>
                    {!a.isRead && <Badge variant="primary" size="sm">New</Badge>}
                  </div>
                  <p className="text-gray-500 line-clamp-1">{a.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No announcements</p>
          )}
          <Link to="/student/announcements" className="text-primary-600 text-sm font-medium mt-3 inline-block hover:text-primary-700">
            View All &rarr;
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default StudentDashboard
