import { useParams, useNavigate } from 'react-router-dom'
import { useSchoolDetail } from '../../features/admin/hooks/useSchools'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { ArrowLeft, Users, GraduationCap, BookOpen, Mail, Phone, MapPin } from 'lucide-react'

export default function SchoolDetail() {
  const { schoolId } = useParams()
  const navigate = useNavigate()
  const { data: school, isLoading } = useSchoolDetail(schoolId)
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }
  
  if (!school) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">School not found</p>
        <Button variant="secondary" onClick={() => navigate('/superadmin/schools')} className="mt-4">
          Back to Schools
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/superadmin/schools')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
          <p className="text-gray-600">School Details</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{school.studentCount}</p>
                <p className="text-sm text-gray-500">Students</p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{school.teacherCount}</p>
                <p className="text-sm text-gray-500">Teachers</p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{school.courseCount}</p>
                <p className="text-sm text-gray-500">Courses</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Info */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Header>
              <h2 className="font-semibold">School Information</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {school.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-gray-900">{school.location}</p>
                    </div>
                  </div>
                )}
                {school.adminEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Admin Email</p>
                      <p className="text-gray-900">{school.adminEmail}</p>
                    </div>
                  </div>
                )}
                {school.adminPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Admin Phone</p>
                      <p className="text-gray-900">{school.adminPhone}</p>
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar name={school.adminName || 'Admin'} size="sm" />
                    <span className="text-gray-900">{school.adminName}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        {/* Recent Teachers */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Teachers</h2>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => navigate(`/superadmin/users?school=${schoolId}&role=school_teacher`)}
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {school.teachers && school.teachers.length > 0 ? (
                <div className="space-y-3">
                  {school.teachers.map(teacher => (
                    <div key={teacher.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Avatar name={teacher.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900">{teacher.name}</p>
                          <p className="text-sm text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{teacher.courseCount} courses</p>
                        <Badge variant={teacher.status === 'active' ? 'success' : 'gray'} size="sm">
                          {teacher.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No teachers in this school</p>
              )}
            </Card.Body>
          </Card>
          
          {/* Recent Courses */}
          <Card className="mt-6">
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Recent Courses</h2>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => navigate(`/superadmin/approvals?school=${schoolId}`)}
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {school.recentCourses && school.recentCourses.length > 0 ? (
                <div className="space-y-3">
                  {school.recentCourses.map(course => (
                    <div key={course.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900">{course.title}</p>
                        <p className="text-sm text-gray-500">by {course.teacherName}</p>
                      </div>
                      <Badge 
                        variant={
                          course.status === 'approved' ? 'success' : 
                          course.status === 'pending' ? 'warning' : 'danger'
                        } 
                        size="sm"
                      >
                        {course.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No courses from this school</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}
