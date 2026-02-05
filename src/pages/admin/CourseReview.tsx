import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourseForReview, useApproveCourse, useRejectCourse } from '../../features/admin/hooks/useCourseApprovals'
import RejectionModal from '../../features/admin/components/RejectionModal'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Skeleton from '../../components/ui/Skeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Alert from '../../components/ui/Alert'
import { ArrowLeft, Check, X, Clock, BookOpen, FileQuestion, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react'

export default function CourseReview() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  
  const { data: course, isLoading } = useCourseForReview(courseId)
  const approveCourse = useApproveCourse()
  const rejectCourse = useRejectCourse()
  
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]))
  
  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedModules(newExpanded)
  }
  
  const handleApprove = async () => {
    if (!courseId) return
    await approveCourse.mutateAsync(courseId)
    setApproveConfirmOpen(false)
    navigate('/admin/approvals')
  }
  
  const handleReject = async (reason: string) => {
    if (!courseId) return
    await rejectCourse.mutateAsync({ courseId, reason })
    navigate('/admin/approvals')
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }
  
  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
        <Button variant="secondary" onClick={() => navigate('/admin/approvals')} className="mt-4">
          Back to Approvals
        </Button>
      </div>
    )
  }
  
  const isPending = course.status === 'pending'
  
  // Mock syllabus data since we don't have full course content
  const mockModules = [
    {
      title: 'Introduction',
      description: 'Getting started with the course',
      lessons: [
        { title: 'Welcome and Overview', type: 'lecture' },
        { title: 'Course Objectives', type: 'lecture' },
        { title: 'Introduction Quiz', type: 'quiz' },
      ]
    },
    {
      title: 'Core Concepts',
      description: 'Fundamental principles and theories',
      lessons: [
        { title: 'Basic Principles', type: 'lecture' },
        { title: 'Advanced Theory', type: 'lecture' },
        { title: 'Practical Application', type: 'assignment' },
        { title: 'Knowledge Check', type: 'quiz' },
      ]
    },
    {
      title: 'Practical Skills',
      description: 'Hands-on exercises and projects',
      lessons: [
        { title: 'Exercise 1', type: 'assignment' },
        { title: 'Exercise 2', type: 'assignment' },
        { title: 'Final Project', type: 'assignment' },
      ]
    },
  ]
  
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <BookOpen className="w-4 h-4" />
      case 'quiz': return <FileQuestion className="w-4 h-4" />
      case 'assignment': return <ClipboardList className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }
  
  const getLessonColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'text-blue-600 bg-blue-100'
      case 'quiz': return 'text-purple-600 bg-purple-100'
      case 'assignment': return 'text-amber-600 bg-amber-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/approvals')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Review</h1>
          <p className="text-gray-600">Review course content before approval</p>
        </div>
      </div>
      
      {/* Status Banner */}
      {course.status !== 'pending' && (
        <Alert variant={course.status === 'approved' ? 'success' : 'warning'}>
          This course has already been {course.status}.
          {course.rejectionReason && (
            <p className="mt-1"><strong>Reason:</strong> {course.rejectionReason}</p>
          )}
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Info */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold">Course Information</h2>
            </Card.Header>
            <Card.Body>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="gray">{course.category}</Badge>
                <Badge variant="gray">{course.difficulty}</Badge>
                <Badge variant={course.visibility === 'public' ? 'primary' : 'gray'}>
                  {course.visibility}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t">
                <Avatar name={course.teacher.name} size="md" />
                <div>
                  <p className="font-medium text-gray-900">{course.teacher.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={course.teacher.type === 'independent' ? 'success' : 'gray'} size="sm">
                      {course.teacher.type === 'independent' ? 'Independent Teacher' : 'School Teacher'}
                    </Badge>
                    {course.teacher.schoolName && (
                      <span className="text-sm text-gray-500">{course.teacher.schoolName}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {/* Syllabus */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Syllabus</h2>
                <span className="text-sm text-gray-500">
                  {course.moduleCount} modules · {course.lessonCount} lessons
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {mockModules.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(index)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">Module {index + 1}: {module.title}</h4>
                        <p className="text-sm text-gray-500">{module.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{module.lessons.length} lessons</span>
                        {expandedModules.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {expandedModules.has(index) && (
                      <div className="p-4 space-y-2">
                        {module.lessons.map((lesson, lIndex) => (
                          <div key={lIndex} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${getLessonColor(lesson.type)}`}>
                              {getLessonIcon(lesson.type)}
                            </div>
                            <span className="text-gray-900">{lesson.title}</span>
                            <Badge variant="gray" size="sm" className="capitalize">{lesson.type}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          
          {/* Review History */}
          {course.reviewHistory && course.reviewHistory.length > 0 && (
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold">Review History</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {course.reviewHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        entry.action === 'approved' ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'
                      }`}>
                        {entry.action === 'approved' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{entry.action}</p>
                        <p className="text-sm text-gray-500">by {entry.by} on {new Date(entry.date).toLocaleDateString()}</p>
                        {entry.reason && <p className="text-sm text-gray-600 mt-1">{entry.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
        
        {/* Action Panel - 1 column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <Card.Header>
                <h2 className="font-semibold">Review Actions</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {isPending ? (
                    <>
                      <Button
                        fullWidth
                        onClick={() => setApproveConfirmOpen(true)}
                        leftIcon={<Check className="w-4 h-4" />}
                      >
                        Approve Course
                      </Button>
                      <Button
                        fullWidth
                        variant="danger"
                        onClick={() => setRejectModalOpen(true)}
                        leftIcon={<X className="w-4 h-4" />}
                      >
                        Reject Course
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Badge 
                        variant={course.status === 'approved' ? 'success' : 'danger'} 
                        size="sm"
                        className="capitalize"
                      >
                        {course.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-2">
                        This course has already been reviewed
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Modules</span>
                      <span className="font-medium">{course.moduleCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lessons</span>
                      <span className="font-medium">{course.lessonCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Submitted</span>
                      <span className="font-medium">{new Date(course.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Approve Confirmation */}
      <ConfirmDialog
        isOpen={approveConfirmOpen}
        onClose={() => setApproveConfirmOpen(false)}
        onConfirm={handleApprove}
        title="Approve Course"
        message={`Are you sure you want to approve "${course.title}"? It will become visible to students.`}
        confirmLabel="Approve"
        loading={approveCourse.isPending}
      />
      
      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onReject={handleReject}
        loading={rejectCourse.isPending}
        courseTitle={course.title}
      />
    </div>
  )
}
