import { Link } from 'react-router-dom'
import { Users, MoreVertical, Edit, Eye, Trash2, Send, BarChart3 } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Dropdown from '../../../components/ui/Dropdown'
import CourseStatusBadge from './CourseStatusBadge'
import type { TeacherCourse } from '../../../types'

export interface TeacherCourseCardProps {
  course: TeacherCourse
  onDelete?: () => void
}

function CourseCard({ course, onDelete }: TeacherCourseCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link to={`/teacher/courses/${course.id}/edit`} className="block">
            <h3 className="font-semibold text-gray-900 truncate hover:text-primary-600">
              {course.title}
            </h3>
          </Link>
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            <CourseStatusBadge status={course.status} />
            <Badge variant={course.visibility === 'public' ? 'primary' : 'gray'} size="sm">
              {course.visibility === 'public' ? 'Public' : 'Private'}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {course.studentCount || 0}
            </span>
            <span>{course.moduleCount || 0} modules</span>
          </div>
          {course.status === 'rejected' && course.rejectionReason && (
            <p className="text-sm text-danger-600 mt-2 bg-danger-50 px-2 py-1 rounded">
              {course.rejectionReason}
            </p>
          )}
        </div>
        <Dropdown>
          <Dropdown.Trigger>
            <button className="p-1 rounded hover:bg-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Menu align="right">
            <Dropdown.Item>
              <Link to={`/teacher/courses/${course.id}/edit`} className="flex items-center gap-2 w-full">
                <Edit className="w-4 h-4" /> Edit
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link to={`/teacher/courses/${course.id}/analytics`} className="flex items-center gap-2 w-full">
                <BarChart3 className="w-4 h-4" /> Analytics
              </Link>
            </Dropdown.Item>
            {course.status === 'draft' && (
              <Dropdown.Item>
                <button className="flex items-center gap-2 w-full text-left">
                  <Send className="w-4 h-4" /> Submit for Review
                </button>
              </Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item>
              <button onClick={onDelete} className="flex items-center gap-2 w-full text-left text-danger-600">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Card>
  )
}

export default CourseCard
