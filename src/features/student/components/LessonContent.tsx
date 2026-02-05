import LectureViewer from './LectureViewer'
import QuizPlayer from './QuizPlayer'
import AssignmentSubmission from './AssignmentSubmission'
import type { Lesson, Quiz, Assignment, AssignmentSubmission as SubmissionType, QuizAttempt, QuizAnswer } from '../../../types'

interface LessonContentProps {
  lesson: Lesson
  quiz?: Quiz
  assignment?: Assignment
  existingSubmission?: SubmissionType
  quizResult?: QuizAttempt
  onCompleteLesson: () => void
  onSubmitQuiz: (answers: QuizAnswer[]) => void
  onSubmitAssignment: (data: { text?: string; file?: File }) => void
  isCompletingLesson: boolean
  isSubmittingQuiz: boolean
  isSubmittingAssignment: boolean
}

function LessonContent({
  lesson,
  quiz,
  assignment,
  existingSubmission,
  quizResult,
  onCompleteLesson,
  onSubmitQuiz,
  onSubmitAssignment,
  isCompletingLesson,
  isSubmittingQuiz,
  isSubmittingAssignment,
}: LessonContentProps) {
  switch (lesson.type) {
    case 'lecture':
      return (
        <LectureViewer
          lesson={lesson}
          isCompleting={isCompletingLesson}
          onComplete={onCompleteLesson}
        />
      )
    case 'quiz':
      if (!quiz) return <div className="text-gray-500">Loading quiz...</div>
      return (
        <QuizPlayer
          quiz={quiz}
          onSubmit={onSubmitQuiz}
          isSubmitting={isSubmittingQuiz}
          result={quizResult}
        />
      )
    case 'assignment':
      if (!assignment) return <div className="text-gray-500">Loading assignment...</div>
      return (
        <AssignmentSubmission
          assignment={assignment}
          existingSubmission={existingSubmission}
          onSubmit={onSubmitAssignment}
          isSubmitting={isSubmittingAssignment}
        />
      )
    default:
      return <div className="text-gray-500">Unknown lesson type</div>
  }
}

export default LessonContent
