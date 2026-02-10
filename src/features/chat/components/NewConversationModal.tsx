import { useMemo } from 'react'
import { MessageSquare } from 'lucide-react'
import Modal from '../../../components/ui/Modal'
import { Avatar, EmptyState, Spinner } from '../../../components/ui'
import { useAuth } from '../../../hooks/useAuth'
import { useEnrollments } from '../../student/hooks/useEnrollments'
import { useEnrolledStudents, useIndependentTeacherStudents } from '../../teacher/hooks/useTeacherStudents'
import { useCreateConversation, MOCK_CONVERSATIONS } from '../hooks/useChat'
import type { Conversation } from '../../../types'

interface Recipient {
  id: string
  name: string
  courseId: string
  courseName: string
  role: 'student' | 'teacher'
}

interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onConversationReady: (conversation: Conversation) => void
}

function NewConversationModal({ isOpen, onClose, onConversationReady }: NewConversationModalProps) {
  const { user } = useAuth()
  const createConversation = useCreateConversation()

  const isStudent = user?.role === 'school_student'
  const isSchoolTeacher = user?.role === 'school_teacher'
  const isIndependentTeacher = user?.role === 'independent_teacher'

  // Student data: enrolled courses with teachers
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments()

  // School teacher data: enrolled students
  const { data: enrolledStudents, isLoading: enrolledLoading } = useEnrolledStudents()

  // Independent teacher data: students from various schools
  const { data: independentStudents, isLoading: independentLoading } = useIndependentTeacherStudents()

  const isLoading = enrollmentsLoading || enrolledLoading || independentLoading

  const recipients: Recipient[] = useMemo(() => {
    if (!user) return []

    if (isStudent && enrollments) {
      // Extract unique teacher+course combos from enrollments
      return enrollments
        .filter(e => e.status === 'approved' && e.course?.teacher)
        .map(e => ({
          id: e.course.teacher.id,
          name: e.course.teacher.name,
          courseId: e.courseId,
          courseName: e.course.title,
          role: 'teacher' as const,
        }))
    }

    if (isSchoolTeacher && enrolledStudents) {
      // Flatten: each student-course combo is a separate recipient row
      return enrolledStudents.flatMap(s =>
        s.enrolledCourses.map(c => ({
          id: s.id,
          name: s.name,
          courseId: c.id,
          courseName: c.title,
          role: 'student' as const,
        }))
      )
    }

    if (isIndependentTeacher && independentStudents) {
      return independentStudents.map(s => ({
        id: s.id,
        name: s.name,
        courseId: s.courseId,
        courseName: s.courseName,
        role: 'student' as const,
      }))
    }

    return []
  }, [user, isStudent, isSchoolTeacher, isIndependentTeacher, enrollments, enrolledStudents, independentStudents])

  // Filter out recipients that already have a conversation
  const availableRecipients = useMemo(() => {
    if (!user) return recipients

    return recipients.filter(r => {
      return !MOCK_CONVERSATIONS.some(c => {
        if (c.courseId !== r.courseId) return false

        if (isStudent) {
          // In mock data, participantId is the teacher, student is in messages
          const studentId = c.messages.find(m => m.senderId !== c.participantId)?.senderId || ''
          return c.participantId === r.id && studentId === user.id
        }

        // Teacher: participantId is the teacher (us), student is found in messages
        const studentId = c.messages.find(m => m.senderId !== c.participantId)?.senderId || ''
        return c.participantId === user.id && studentId === r.id
      })
    })
  }, [recipients, user, isStudent])

  const handleSelect = async (recipient: Recipient) => {
    try {
      const conversation = await createConversation.mutateAsync({
        participantId: recipient.id,
        participantName: recipient.name,
        participantRole: recipient.role,
        courseId: recipient.courseId,
        courseName: recipient.courseName,
      })
      onConversationReady(conversation)
      onClose()
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Message" size="md">
      <p className="text-sm text-gray-500 mb-4">
        {isStudent
          ? 'Select a course teacher to start a conversation with.'
          : 'Select a student to start a conversation with.'}
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : availableRecipients.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No new conversations available"
          description={
            isStudent
              ? 'You already have conversations with all your course teachers.'
              : 'You already have conversations with all your students.'
          }
        />
      ) : (
        <div className="divide-y divide-gray-100 -mx-6">
          {availableRecipients.map((r, idx) => (
            <button
              key={`${r.id}-${r.courseId}-${idx}`}
              onClick={() => handleSelect(r)}
              disabled={createConversation.isPending}
              className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Avatar name={r.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                <p className="text-xs text-primary-600 truncate">{r.courseName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default NewConversationModal
