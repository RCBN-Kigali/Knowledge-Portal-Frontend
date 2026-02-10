import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { Conversation, Message } from '../../../types'

// Mock conversations data
// Student perspective: conversations with teachers of enrolled courses
// Teacher perspective: conversations with students in their courses
export const MOCK_CONVERSATIONS: Conversation[] = [
  // Jean (student, id: '1') <-> Prof. Uwimana (teacher, id: '3') about Math
  {
    id: 'conv-1',
    courseId: 'course-1',
    courseName: 'Introduction to Mathematics',
    participantId: '3',
    participantName: 'Prof. Uwimana',
    participantRole: 'teacher',
    lastMessage: 'Great question! The formula for solving quadratic equations is...',
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    unreadCount: 2,
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: '1',
        senderName: 'Jean Baptiste',
        text: 'Good morning Professor! I have a question about the algebra homework from Module 2.',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: '3',
        senderName: 'Prof. Uwimana',
        text: 'Good morning Jean! Of course, what do you need help with?',
        sentAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: '1',
        senderName: 'Jean Baptiste',
        text: 'I\'m struggling with problem 5 about quadratic equations. I don\'t understand how to factor x² + 5x + 6.',
        sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-4',
        conversationId: 'conv-1',
        senderId: '3',
        senderName: 'Prof. Uwimana',
        text: 'Great question! The formula for solving quadratic equations is to find two numbers that multiply to give 6 and add up to 5. Those numbers are 2 and 3, so x² + 5x + 6 = (x + 2)(x + 3).',
        sentAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
    ],
  },
  // Jean (student, id: '1') <-> Dr. Mugabo (teacher, id: 't2') about Biology
  {
    id: 'conv-2',
    courseId: 'course-2',
    courseName: 'Biology Fundamentals',
    participantId: 't2',
    participantName: 'Dr. Mugabo',
    participantRole: 'teacher',
    lastMessage: 'The lab report is due next Friday. Make sure to include your observations.',
    lastMessageAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: 'msg-5',
        conversationId: 'conv-2',
        senderId: 't2',
        senderName: 'Dr. Mugabo',
        text: 'Hello everyone, just a reminder about the upcoming lab session on cell division.',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-6',
        conversationId: 'conv-2',
        senderId: '1',
        senderName: 'Jean Baptiste',
        text: 'Thank you Dr. Mugabo! When is the lab report due?',
        sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-7',
        conversationId: 'conv-2',
        senderId: 't2',
        senderName: 'Dr. Mugabo',
        text: 'The lab report is due next Friday. Make sure to include your observations.',
        sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  // Jean (student, id: '1') <-> Mrs. Nyirahabimana (teacher, id: 't3') about English
  {
    id: 'conv-3',
    courseId: 'course-3',
    courseName: 'English Language Skills',
    participantId: 't3',
    participantName: 'Mrs. Nyirahabimana',
    participantRole: 'teacher',
    lastMessage: 'Your essay draft looks promising. Focus on strengthening your thesis statement.',
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    messages: [
      {
        id: 'msg-8',
        conversationId: 'conv-3',
        senderId: '1',
        senderName: 'Jean Baptiste',
        text: 'Hello Mrs. Nyirahabimana, I submitted my essay draft. Could you please review it?',
        sentAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-9',
        conversationId: 'conv-3',
        senderId: 't3',
        senderName: 'Mrs. Nyirahabimana',
        text: 'Your essay draft looks promising. Focus on strengthening your thesis statement.',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  // Marie (student, id: '2') <-> Prof. Uwimana (teacher, id: '3') about Math
  {
    id: 'conv-4',
    courseId: 'course-1',
    courseName: 'Introduction to Mathematics',
    participantId: '3',
    participantName: 'Prof. Uwimana',
    participantRole: 'teacher',
    lastMessage: 'Thank you Professor! That makes sense now.',
    lastMessageAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: 'msg-10',
        conversationId: 'conv-4',
        senderId: '2',
        senderName: 'Marie Claire',
        text: 'Professor, could you explain the geometry section again? I missed part of the lesson.',
        sentAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-11',
        conversationId: 'conv-4',
        senderId: '3',
        senderName: 'Prof. Uwimana',
        text: 'Of course Marie! The key concepts for geometry are points, lines, and planes. I recommend reviewing Module 3, Lesson 9 which covers the basics.',
        sentAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-12',
        conversationId: 'conv-4',
        senderId: '2',
        senderName: 'Marie Claire',
        text: 'Thank you Professor! That makes sense now.',
        sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
]

// Helper to get conversations for the current user
function getConversationsForUser(userId: string, userRole: string): Conversation[] {
  if (userRole === 'school_student') {
    // Students see conversations where they are the student participant
    // The participant shown is the teacher
    return MOCK_CONVERSATIONS
      .filter(c => c.messages.some(m => m.senderId === userId) || getStudentId(c) === userId)
      .filter(c => c.participantRole === 'teacher')
  }

  if (userRole === 'school_teacher' || userRole === 'independent_teacher') {
    // Teachers see conversations flipped: participant shown is the student
    const teacherConvs: Conversation[] = []

    for (const conv of MOCK_CONVERSATIONS) {
      if (conv.participantId !== userId) continue

      // Find the student in this conversation
      const studentMsg = conv.messages.find(m => m.senderId !== userId)
      if (!studentMsg) continue

      teacherConvs.push({
        ...conv,
        participantId: studentMsg.senderId,
        participantName: studentMsg.senderName,
        participantRole: 'student',
      })
    }

    return teacherConvs
  }

  return []
}

function getStudentId(conv: Conversation): string {
  // The student is the sender who is not the teacher (participantId)
  const studentMsg = conv.messages.find(m => m.senderId !== conv.participantId)
  return studentMsg?.senderId || ''
}

export function useConversations() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['conversations', user?.id, user?.role],
    queryFn: async (): Promise<Conversation[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))

      if (!user) return []

      return getConversationsForUser(user.id, user.role)
        .sort((a, b) => {
          const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
          const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
          return dateB - dateA
        })
    },
    enabled: !!user,
  })
}

export function useConversation(id: string | undefined) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['conversation', id, user?.id],
    queryFn: async (): Promise<Conversation | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 200))

      if (!user || !id) return undefined

      const convs = getConversationsForUser(user.id, user.role)
      return convs.find(c => c.id === id)
    },
    enabled: !!id && !!user,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ conversationId, text }: { conversationId: string; text: string }): Promise<Message> => {
      await new Promise(resolve => setTimeout(resolve, 300))

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: user?.id || '',
        senderName: user?.name || '',
        text,
        sentAt: new Date().toISOString(),
      }

      // Add to mock data
      const conv = MOCK_CONVERSATIONS.find(c => c.id === conversationId)
      if (conv) {
        conv.messages.push(newMessage)
        conv.lastMessage = text
        conv.lastMessageAt = newMessage.sentAt
      }

      return newMessage
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId] })
    },
  })
}

interface CreateConversationParams {
  participantId: string
  participantName: string
  participantRole: 'student' | 'teacher'
  courseId: string
  courseName: string
}

export function useCreateConversation() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (params: CreateConversationParams): Promise<Conversation> => {
      await new Promise(resolve => setTimeout(resolve, 200))

      // Check if conversation already exists for this course+participant
      const existing = MOCK_CONVERSATIONS.find(c => {
        if (c.courseId !== params.courseId) return false

        if (user?.role === 'school_student') {
          // Student view: participantId is the teacher
          const studentId = getStudentId(c)
          return c.participantId === params.participantId && studentId === user.id
        }

        // Teacher view: participantId is the teacher, we need to find the student
        const studentId = getStudentId(c)
        return c.participantId === user?.id && studentId === params.participantId
      })

      if (existing) {
        return existing
      }

      // Create new conversation
      // Store in teacher-perspective format (participantId = teacher)
      const newConv: Conversation = user?.role === 'school_student'
        ? {
            id: `conv-${Date.now()}`,
            courseId: params.courseId,
            courseName: params.courseName,
            participantId: params.participantId,
            participantName: params.participantName,
            participantRole: 'teacher',
            unreadCount: 0,
            messages: [],
          }
        : {
            id: `conv-${Date.now()}`,
            courseId: params.courseId,
            courseName: params.courseName,
            participantId: user?.id || '',
            participantName: user?.name || '',
            participantRole: 'teacher',
            unreadCount: 0,
            messages: [],
          }

      MOCK_CONVERSATIONS.push(newConv)

      // Return the conversation as seen by the current user
      if (user?.role === 'school_student') {
        return newConv
      }

      // For teacher, flip to show student as participant
      return {
        ...newConv,
        participantId: params.participantId,
        participantName: params.participantName,
        participantRole: 'student',
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
