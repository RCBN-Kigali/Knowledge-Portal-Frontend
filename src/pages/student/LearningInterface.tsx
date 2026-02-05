import { useState, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Menu, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button, ProgressBar, Spinner } from '../../components/ui'
import SyllabusNav from '../../features/student/components/SyllabusNav'
import LessonContent from '../../features/student/components/LessonContent'
import { useCourseContent } from '../../features/student/hooks/useCourseContent'
import { useLesson, useCompleteLesson } from '../../features/student/hooks/useLessons'
import { useQuiz, useSubmitQuiz } from '../../features/student/hooks/useQuizzes'
import { useSubmitAssignment } from '../../features/student/hooks/useAssignments'
import { useEnrollments } from '../../features/student/hooks/useEnrollments'
import type { Lesson, Module, QuizAnswer } from '../../types'

function LearningInterface() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Get enrollment to find courseId
  const { data: enrollments } = useEnrollments()
  const enrollment = useMemo(() => enrollments?.find(e => e.id === enrollmentId), [enrollments, enrollmentId])

  const { data: courseData, isLoading: courseLoading } = useCourseContent(enrollment?.courseId)

  // Flatten all lessons for navigation
  const allLessons = useMemo(() => {
    if (!courseData?.modules) return []
    return courseData.modules.flatMap(m => m.lessons)
  }, [courseData])

  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(
    enrollment?.currentLessonId || allLessons[0]?.id
  )

  // Update current lesson when data loads
  const activeLessonId = currentLessonId || allLessons[0]?.id
  const currentIndex = allLessons.findIndex(l => l.id === activeLessonId)

  const { data: lessonData, isLoading: lessonLoading } = useLesson(activeLessonId)
  const { data: quizData } = useQuiz(lessonData?.type === 'quiz' ? activeLessonId : undefined)

  const completeLessonMutation = useCompleteLesson()
  const submitQuizMutation = useSubmitQuiz()
  const submitAssignmentMutation = useSubmitAssignment()

  const overallProgress = enrollment?.progress ?? 0

  const handleLessonSelect = useCallback((lesson: Lesson) => {
    setCurrentLessonId(lesson.id)
    setSidebarOpen(false)
  }, [])

  const goToLesson = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < allLessons.length) {
      setCurrentLessonId(allLessons[newIndex].id)
    }
  }

  const handleCompleteLesson = () => {
    if (activeLessonId) {
      completeLessonMutation.mutate(activeLessonId)
    }
  }

  const handleSubmitQuiz = (answers: QuizAnswer[]) => {
    if (quizData) {
      submitQuizMutation.mutate({ quizId: quizData.id, answers })
    }
  }

  const handleSubmitAssignment = (data: { text?: string; file?: File }) => {
    if (activeLessonId) {
      submitAssignmentMutation.mutate({ assignmentId: activeLessonId, ...data })
    }
  }

  if (courseLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!courseData || !enrollment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Course not found</p>
        <Link to="/student/enrollments"><Button variant="ghost">Back to Enrollments</Button></Link>
      </div>
    )
  }

  const currentLesson = allLessons[currentIndex]

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 lg:-m-8">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform lg:relative lg:translate-x-0 lg:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 truncate text-sm">{courseData.title}</h3>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-200">
          <ProgressBar value={overallProgress} max={100} size="sm" showValue />
        </div>
        <SyllabusNav
          modules={courseData.modules}
          currentLessonId={activeLessonId}
          onLessonSelect={handleLessonSelect}
          className="h-[calc(100%-8rem)]"
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <Link to={`/student/courses/${enrollment.courseId}`} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentLesson?.title || 'Select a lesson'}
            </p>
            <p className="text-xs text-gray-500">{currentIndex + 1} of {allLessons.length} lessons</p>
          </div>
        </div>

        {/* Lesson content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {lessonLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : lessonData ? (
            <div className="max-w-3xl mx-auto">
              <LessonContent
                lesson={lessonData}
                quiz={quizData ?? undefined}
                assignment={undefined}
                existingSubmission={undefined}
                quizResult={submitQuizMutation.data ?? undefined}
                onCompleteLesson={handleCompleteLesson}
                onSubmitQuiz={handleSubmitQuiz}
                onSubmitAssignment={handleSubmitAssignment}
                isCompletingLesson={completeLessonMutation.isPending}
                isSubmittingQuiz={submitQuizMutation.isPending}
                isSubmittingAssignment={submitAssignmentMutation.isPending}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">Select a lesson to start</div>
          )}
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToLesson('prev')}
            disabled={currentIndex <= 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-400 hidden sm:block">
            Lesson {currentIndex + 1} of {allLessons.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToLesson('next')}
            disabled={currentIndex >= allLessons.length - 1}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </main>
    </div>
  )
}

export default LearningInterface
