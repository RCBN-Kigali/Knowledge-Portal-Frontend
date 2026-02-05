import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Tabs, Skeleton, Card, EmptyState } from '../../components/ui'
import EnrolledCourseCard from '../../features/student/components/EnrolledCourseCard'
import { useEnrollments } from '../../features/student/hooks/useEnrollments'

function MyEnrollments() {
  const [activeTab, setActiveTab] = useState<string>('in_progress')

  const { data: enrollments, isLoading } = useEnrollments(activeTab as 'in_progress' | 'completed')

  const tabs = [
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Enrollments</h1>
        <p className="text-gray-500">Track your course progress</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} variant="card" />)}
        </div>
      ) : !enrollments || enrollments.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={BookOpen}
            title={activeTab === 'completed' ? 'No completed courses yet' : 'No courses in progress'}
            description={activeTab === 'in_progress' ? 'Browse courses and enroll to start learning' : 'Complete your first course to see it here'}
            actionLabel={activeTab === 'in_progress' ? 'Browse Courses' : undefined}
            onAction={activeTab === 'in_progress' ? () => { window.location.href = '/student/courses' } : undefined}
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(enrollment => (
            <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyEnrollments
