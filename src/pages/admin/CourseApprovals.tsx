import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePendingCourses } from '../../features/admin/hooks/useCourseApprovals'
import Card from '../../components/ui/Card'
import Tabs from '../../components/ui/Tabs'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import type { CourseStatus } from '../../types'
import { BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function CourseApprovals() {
  const { user } = useAuth()
  const [statusTab, setStatusTab] = useState<CourseStatus>('pending')

  const { data: courses, isLoading } = usePendingCourses(statusTab)

  const isSuperAdmin = user?.role === 'super_admin'

  const tabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ]

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: CourseStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  const getStatusVariant = (status: CourseStatus): 'warning' | 'success' | 'danger' | 'gray' => {
    switch (status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'danger'
      default: return 'gray'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Approvals</h1>
        <p className="text-gray-600 mt-1">
          {isSuperAdmin
            ? 'Review and approve public courses from all teachers'
            : "Review and approve courses from your school's teachers"}
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-primary-800">
          {isSuperAdmin
            ? 'As Super Admin, you review public courses from school teachers and all courses from independent teachers.'
            : 'Review both private and public courses submitted by teachers in your school.'}
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={statusTab}
        onChange={(id) => setStatusTab(id as CourseStatus)}
      />

      {/* Course List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : courses && courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map(course => (
            <Link key={course.id} to={`/admin/approvals/${course.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                      <Badge variant={getStatusVariant(course.status)} size="sm">
                        {getStatusIcon(course.status)}
                        <span className="ml-1 capitalize">{course.status}</span>
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar name={course.teacher.name} size="xs" />
                        <span className="text-gray-600">{course.teacher.name}</span>
                        <Badge variant={course.teacher.type === 'independent' ? 'success' : 'gray'} size="sm">
                          {course.teacher.type === 'independent' ? 'Independent' : 'School'}
                        </Badge>
                      </div>

                      <Badge variant={course.visibility === 'public' ? 'primary' : 'gray'} size="sm">
                        {course.visibility === 'public' ? 'Public' : 'Private'}
                      </Badge>

                      <span className="text-gray-500">
                        {course.moduleCount} modules - {course.lessonCount} lessons
                      </span>
                    </div>

                    {course.status === 'rejected' && course.rejectionReason && (
                      <div className="mt-3 p-2 bg-danger-50 rounded text-sm text-danger-700">
                        <strong>Rejection reason:</strong> {course.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="text-right text-sm text-gray-500 whitespace-nowrap">
                    <p>Submitted</p>
                    <p>{formatDate(course.submittedAt)}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={`No ${statusTab} courses`}
          description={
            statusTab === 'pending'
              ? 'No courses are waiting for approval'
              : `No ${statusTab} courses to display`
          }
        />
      )}
    </div>
  )
}
