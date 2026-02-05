import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import type { School } from '../hooks/useSchools'
import { Users, BookOpen, GraduationCap, MapPin } from 'lucide-react'

export interface SchoolCardProps {
  school: School
}

function SchoolCard({ school }: SchoolCardProps) {
  return (
    <Link to={`/superadmin/schools/${school.id}`}>
      <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{school.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4" />
              {school.location}
            </div>
          </div>
          <Badge variant={school.status === 'active' ? 'success' : 'gray'} size="sm" dot>
            {school.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
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
  )
}

export default SchoolCard
