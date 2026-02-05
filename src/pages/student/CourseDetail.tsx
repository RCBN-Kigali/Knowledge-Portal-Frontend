import { useParams, Link, useNavigate } from 'react-router-dom'
import { Clock, Users, BookOpen, Star, ArrowLeft, PlayCircle } from 'lucide-react'
import { Button, Card, Badge, Tabs, Avatar, ProgressBar, Alert, Skeleton } from '../../components/ui'
import { usePublicCourse } from '../../features/student/hooks/usePublicCourse'
import { useEnrollments } from '../../features/student/hooks/useEnrollments'
import { useEnroll } from '../../features/student/hooks/useCourses'
import SyllabusNav from '../../features/student/components/SyllabusNav'
import { useState, useMemo } from 'react'
import type { Lesson } from '../../types'

const difficultyColors: Record<string, 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
}

function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: course, isLoading: courseLoading } = usePublicCourse(id)
  const { data: enrollments } = useEnrollments()
  const enrollMutation = useEnroll()
  const [activeTab, setActiveTab] = useState('overview')

  const enrollment = useMemo(() => {
    return enrollments?.find(e => e.courseId === id)
  }, [enrollments, id])

  const handleEnroll = async () => {
    if (id) {
      try {
        await enrollMutation.mutateAsync(id)
        // After successful enrollment, navigate to learning interface
        // We'll need to get the new enrollment ID from the response
      } catch {
        // Error handled by mutation
      }
    }
  }

  if (courseLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rectangular" height="200px" />
        <Skeleton variant="text" lines={4} />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
        <Link to="/student/courses"><Button variant="ghost" className="mt-4">Back to Courses</Button></Link>
      </div>
    )
  }

  const isEnrolled = !!enrollment

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'syllabus', label: 'Syllabus', count: course.modules?.length },
    { id: 'teacher', label: 'Teacher' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/student/courses" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <Badge variant="primary" size="sm">{course.category.replace('_', ' ')}</Badge>
              <Badge variant={difficultyColors[course.difficulty]} size="sm">{course.difficulty}</Badge>
              {!course.isPublic && <Badge variant="gray" size="sm">School Only</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.studentCount} students</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.lessonCount} lessons</span>
              {course.rating != null && <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {course.rating.toFixed(1)}</span>}
            </div>
            <div className="flex items-center gap-2">
              <Avatar name={course.teacher.name} src={course.teacher.avatarUrl} size="sm" />
              <span className="text-sm text-gray-600">{course.teacher.name}</span>
            </div>
          </div>
          <div className="lg:w-72 flex-shrink-0">
            <Card className="p-4">
              {isEnrolled ? (
                <div className="space-y-3">
                  <Badge variant="success" size="md" className="w-full justify-center">Enrolled</Badge>
                  <ProgressBar value={enrollment.progress} max={100} size="sm" showValue />
                  <Link to={`/student/learn/${enrollment.id}`}>
                    <Button fullWidth leftIcon={<PlayCircle className="w-4 h-4" />}>
                      {enrollment.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button fullWidth onClick={handleEnroll} loading={enrollMutation.isPending}>
                    Enroll Now
                  </Button>
                  {enrollMutation.isSuccess && <Alert variant="success">Enrolled successfully!</Alert>}
                  {enrollMutation.isError && <Alert variant="error">Failed to enroll. Try again.</Alert>}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
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
        )}

        {activeTab === 'syllabus' && course.modules && (
          <div className="space-y-4">
            {course.modules.map((mod, i) => (
              <Card key={mod.id} className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">Module {i + 1}: {mod.title}</h4>
                <ul className="space-y-2">
                  {mod.lessons.map(lesson => (
                    <li key={lesson.id} className="flex items-center gap-2 text-sm text-gray-600 pl-4">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      {lesson.title}
                      {lesson.durationMinutes && <span className="text-gray-400 ml-auto">{lesson.durationMinutes}min</span>}
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
                {course.teacher.schoolName && <p className="text-sm text-gray-500">{course.teacher.schoolName}</p>}
                {course.teacher.bio && <p className="text-gray-600 mt-2">{course.teacher.bio}</p>}
                {course.teacher.courseCount != null && <p className="text-sm text-gray-500 mt-2">{course.teacher.courseCount} courses</p>}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CourseDetail
