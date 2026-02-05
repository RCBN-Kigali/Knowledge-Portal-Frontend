import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTeacherDashboard } from '../../features/teacher/hooks/useTeacherDashboard'
import { useTeacherCourses } from '../../features/teacher/hooks/useTeacherCourses'
import { useSubmissions } from '../../features/teacher/hooks/useSubmissions'
import { useEnrollmentRequests } from '../../features/teacher/hooks/useEnrollmentRequests'
import SimpleStatsCard from '../../features/teacher/components/SimpleStatsCard'
import CourseStatusBadge from '../../features/teacher/components/CourseStatusBadge'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { BookOpen, Users, FileText, Clock, Plus, ArrowRight, Bell } from 'lucide-react'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { data: dashboard, isLoading: dashboardLoading } = useTeacherDashboard()
  const { data: courses, isLoading: coursesLoading } = useTeacherCourses()
  const { data: submissions } = useSubmissions({ status: 'pending' })
  const { data: enrollmentRequests } = useEnrollmentRequests('pending')
  
  const isIndependentTeacher = user?.role === 'independent_teacher'
  
  if (dashboardLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }
  
  const stats = dashboard?.stats
  const courseCounts = dashboard?.courseCounts
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        <Link to="/teacher/courses/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create Course
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SimpleStatsCard
          title="Total Courses"
          value={stats?.totalCourses || 0}
          icon={<BookOpen className="w-5 h-5" />}
          trend={{ value: courseCounts?.approved || 0, label: 'approved' }}
        />
        <SimpleStatsCard
          title="Active Students"
          value={stats?.activeStudents || 0}
          icon={<Users className="w-5 h-5" />}
        />
        <SimpleStatsCard
          title="Pending Submissions"
          value={stats?.pendingSubmissions || 0}
          icon={<FileText className="w-5 h-5" />}
          trend={stats?.pendingSubmissions ? { value: stats.pendingSubmissions, label: 'need grading', isPositive: false } : undefined}
        />
        {isIndependentTeacher ? (
          <SimpleStatsCard
            title="Enrollment Requests"
            value={stats?.pendingEnrollmentRequests || 0}
            icon={<Bell className="w-5 h-5" />}
            trend={stats?.pendingEnrollmentRequests ? { value: stats.pendingEnrollmentRequests, label: 'pending' } : undefined}
          />
        ) : (
          <SimpleStatsCard
            title="Pending Review"
            value={courseCounts?.pending || 0}
            icon={<Clock className="w-5 h-5" />}
          />
        )}
      </div>
      
      {/* Course Status Overview */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Course Status Overview</h2>
            <Link to="/teacher/courses" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{courseCounts?.draft || 0}</div>
              <div className="text-sm text-gray-500">Drafts</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600">{courseCounts?.pending || 0}</div>
              <div className="text-sm text-warning-600">Pending Review</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600">{courseCounts?.approved || 0}</div>
              <div className="text-sm text-success-600">Approved</div>
            </div>
            <div className="text-center p-4 bg-danger-50 rounded-lg">
              <div className="text-2xl font-bold text-danger-600">{courseCounts?.rejected || 0}</div>
              <div className="text-sm text-danger-600">Rejected</div>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">Recent Courses</h2>
          </Card.Header>
          <Card.Body>
            {coursesLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="space-y-3">
                {courses.slice(0, 5).map(course => (
                  <Link
                    key={course.id}
                    to={`/teacher/courses/${course.id}/edit`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.studentCount || 0} students</p>
                    </div>
                    <CourseStatusBadge status={course.status} />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No courses yet"
                description="Create your first course to get started"
                actionLabel="Create Course"
                onAction={() => window.location.href = '/teacher/courses/new'}
              />
            )}
          </Card.Body>
        </Card>
        
        {/* Pending Items */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">
              {isIndependentTeacher ? 'Enrollment Requests' : 'Pending Submissions'}
            </h2>
          </Card.Header>
          <Card.Body>
            {isIndependentTeacher ? (
              enrollmentRequests && enrollmentRequests.length > 0 ? (
                <div className="space-y-3">
                  {enrollmentRequests.slice(0, 5).map(request => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{request.studentName}</p>
                        <p className="text-sm text-gray-500">{request.courseName}</p>
                      </div>
                      <Link to="/teacher/students" className="text-sm text-primary-600 hover:underline">
                        Review
                      </Link>
                    </div>
                  ))}
                  {enrollmentRequests.length > 5 && (
                    <Link to="/teacher/students" className="block text-center text-sm text-primary-600 hover:underline py-2">
                      View all {enrollmentRequests.length} requests
                    </Link>
                  )}
                </div>
              ) : (
                <EmptyState
                  title="No pending requests"
                  description="New enrollment requests will appear here"
                />
              )
            ) : (
              submissions && submissions.length > 0 ? (
                <div className="space-y-3">
                  {submissions.slice(0, 5).map(sub => (
                    <Link
                      key={sub.id}
                      to={`/teacher/submissions?id=${sub.id}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{sub.studentName}</p>
                        <p className="text-sm text-gray-500">{sub.assignmentTitle}</p>
                      </div>
                      <span className="text-sm text-warning-600">Needs grading</span>
                    </Link>
                  ))}
                  {submissions.length > 5 && (
                    <Link to="/teacher/submissions" className="block text-center text-sm text-primary-600 hover:underline py-2">
                      View all {submissions.length} submissions
                    </Link>
                  )}
                </div>
              ) : (
                <EmptyState
                  title="No pending submissions"
                  description="Student submissions will appear here"
                />
              )
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
