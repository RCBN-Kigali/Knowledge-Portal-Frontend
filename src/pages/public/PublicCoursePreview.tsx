import { useParams, Link } from 'react-router-dom'
import { Clock, Users, BookOpen, Star, ArrowLeft, LogIn } from 'lucide-react'
import { Button, Card, Badge, Tabs, Avatar, Skeleton, Alert } from '../../components/ui'
import { usePublicCourse } from '../../features/student/hooks/usePublicCourse'
import { useState } from 'react'

const difficultyColors: Record<string, 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
}

function PublicCoursePreview() {
  const { id } = useParams<{ id: string }>()
  const { data: course, isLoading } = usePublicCourse(id)
  const [activeTab, setActiveTab] = useState('overview')

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton variant="rectangular" height="240px" className="mb-6 rounded-lg" />
        <Skeleton variant="text" lines={3} />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500">Course not found</p>
        <Link to="/courses"><Button variant="ghost" className="mt-4">Back to Courses</Button></Link>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'syllabus', label: 'Syllabus', count: course.modules?.length },
    { id: 'teacher', label: 'Teacher' },
  ]

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/courses" className="inline-flex items-center gap-1 text-primary-200 hover:text-white text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                <Badge variant="primary" size="sm">{course.category.replace('_', ' ')}</Badge>
                <Badge variant={difficultyColors[course.difficulty]} size="sm">{course.difficulty}</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-primary-100 mb-4 line-clamp-3">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-primary-200">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.studentCount} students</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.lessonCount} lessons</span>
                {course.estimatedHours && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.estimatedHours}h</span>}
                {course.rating != null && <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {course.rating.toFixed(1)}</span>}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Avatar name={course.teacher.name} src={course.teacher.avatarUrl} size="sm" />
                <span className="text-primary-100">{course.teacher.name}</span>
              </div>
            </div>
            <div className="lg:w-80 flex-shrink-0">
              <Card className="p-6">
                <Link to="/login">
                  <Button fullWidth size="lg" leftIcon={<LogIn className="w-5 h-5" />}>
                    Login to Access
                  </Button>
                </Link>
                <Alert variant="info" className="mt-4">
                  Login with your school account to enroll in this course.
                </Alert>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>{course.moduleCount} modules, {course.lessonCount} lessons</li>
                  {course.estimatedHours && <li>~{course.estimatedHours} hours to complete</li>}
                  <li>Free for all Paysannat students</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Course</h3>
                  <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
                </div>
                {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {course.whatYouLearn.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600">
                          <span className="text-success-500 mt-0.5">&#10003;</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {course.requirements && course.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {course.requirements.map((req, i) => <li key={i}>{req}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              {course.modules?.map((mod, i) => (
                <Card key={mod.id} className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Module {i + 1}: {mod.title}</h4>
                  {mod.description && <p className="text-sm text-gray-500 mb-3">{mod.description}</p>}
                  <ul className="space-y-2">
                    {mod.lessons.map(lesson => (
                      <li key={lesson.id} className="flex items-center gap-2 text-sm text-gray-600 pl-4">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        {lesson.title}
                        {lesson.durationMinutes && (
                          <span className="text-gray-400 ml-auto">{lesson.durationMinutes}min</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'teacher' && (
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Avatar name={course.teacher.name} src={course.teacher.avatarUrl} size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.teacher.name}</h3>
                  {course.teacher.schoolName && (
                    <p className="text-sm text-gray-500">{course.teacher.schoolName}</p>
                  )}
                  {course.teacher.bio && (
                    <p className="text-gray-600 mt-3">{course.teacher.bio}</p>
                  )}
                  {course.teacher.courseCount != null && (
                    <p className="text-sm text-gray-500 mt-2">{course.teacher.courseCount} courses</p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-20">
        <Link to="/login">
          <Button fullWidth leftIcon={<LogIn className="w-4 h-4" />}>
            Login to Access
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PublicCoursePreview
