import { Link } from 'react-router-dom'
import { Users, Star, LogIn } from 'lucide-react'
import { Card, Badge, Avatar } from '../../../components/ui'
import type { Course } from '../../../types'

const difficultyColors: Record<string, string> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
}

interface CourseCardProps {
  course: Course
  linkPrefix?: string
  showLoginBadge?: boolean
  enrollmentStatus?: 'enrolled' | 'not_enrolled'
  onEnroll?: () => void
}

function CourseCard({ course, linkPrefix = '/courses', showLoginBadge, enrollmentStatus, onEnroll }: CourseCardProps) {
  const cardContent = (
    <Card variant="interactive" className="h-full">
      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-50">
            <span className="text-4xl font-bold text-primary-200">{course.title.charAt(0)}</span>
          </div>
        )}
        {showLoginBadge && (
          <div className="absolute top-2 right-2">
            <Badge variant="gray" size="sm">
              <LogIn className="w-3 h-3 mr-1" /> Login to Enroll
            </Badge>
          </div>
        )}
        {enrollmentStatus === 'enrolled' && (
          <div className="absolute top-2 right-2">
            <Badge variant="success" size="sm">Enrolled</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <Badge variant="primary" size="sm">{course.category.replace('_', ' ')}</Badge>
          <Badge variant={difficultyColors[course.difficulty] as 'success' | 'warning' | 'danger'} size="sm">
            {course.difficulty}
          </Badge>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <Avatar name={course.teacher.name} src={course.teacher.avatarUrl} size="xs" />
          <span className="text-sm text-gray-600">{course.teacher.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {course.studentCount}
          </span>
          {course.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {course.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Card>
  )

  if (onEnroll && enrollmentStatus === 'not_enrolled') {
    return (
      <div className="h-full">
        <Link to={`${linkPrefix}/${course.id}`}>{cardContent}</Link>
      </div>
    )
  }

  return <Link to={`${linkPrefix}/${course.id}`}>{cardContent}</Link>
}

export default CourseCard
