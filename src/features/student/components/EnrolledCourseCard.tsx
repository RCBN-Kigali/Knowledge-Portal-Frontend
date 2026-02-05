import { Link } from 'react-router-dom'
import { PlayCircle } from 'lucide-react'
import { Card, ProgressBar, Button } from '../../../components/ui'
import EnrollmentStatusBadge from './EnrollmentStatusBadge'
import type { Enrollment } from '../../../types'

interface EnrolledCourseCardProps {
  enrollment: Enrollment
}

function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const { course } = enrollment

  return (
    <Card className="h-full">
      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-50">
            <span className="text-4xl font-bold text-primary-200">{course.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <EnrollmentStatusBadge status={enrollment.status} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{course.teacher.name}</p>
        {enrollment.status === 'approved' && (
          <>
            <ProgressBar value={enrollment.progress} max={100} size="sm" showValue className="mb-3" />
            <Link to={`/student/learn/${enrollment.id}`}>
              <Button size="sm" fullWidth leftIcon={<PlayCircle className="w-4 h-4" />}>
                {enrollment.progress > 0 ? 'Continue' : 'Start Learning'}
              </Button>
            </Link>
          </>
        )}
        {enrollment.status === 'completed' && (
          <ProgressBar value={100} max={100} size="sm" variant="success" showValue />
        )}
      </div>
    </Card>
  )
}

export default EnrolledCourseCard
