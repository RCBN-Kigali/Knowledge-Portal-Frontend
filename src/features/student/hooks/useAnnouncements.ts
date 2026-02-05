import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Announcement } from '../../../types'

// Mock announcements data
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Welcome to the New Semester!',
    content: 'We are excited to welcome all students back to the Knowledge Portal. This semester brings new courses, improved features, and exciting learning opportunities. Make sure to check out the new courses in Technology and Agriculture categories.',
    authorName: 'Admin Team',
    authorAvatarUrl: '',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Mathematics Course Update',
    content: 'New practice problems have been added to Chapter 5 of Introduction to Mathematics. These additional exercises will help you prepare for the upcoming quiz. Please complete them before the assessment date.',
    authorName: 'Prof. Uwimana',
    authorAvatarUrl: '',
    courseName: 'Introduction to Mathematics',
    courseId: 'course-1',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-3',
    title: 'Library Hours Extended',
    content: 'Great news! The school library will now be open until 8 PM on weekdays to support your studies. Take advantage of this extended time for research and group study sessions.',
    authorName: 'School Admin',
    authorAvatarUrl: '',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-4',
    title: 'Biology Lab Session Reminder',
    content: 'Remember that we have a practical lab session this Friday at 2 PM. Please bring your lab notebooks and safety equipment. We will be studying cell division under the microscope.',
    authorName: 'Dr. Mugabo',
    authorAvatarUrl: '',
    courseName: 'Biology Fundamentals',
    courseId: 'course-2',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-5',
    title: 'English Essay Competition',
    content: 'We are organizing an essay writing competition open to all students. The topic is "The Future of Education in Rwanda." Submissions are due by the end of the month. Winners will receive certificates and prizes!',
    authorName: 'Mrs. Nyirahabimana',
    authorAvatarUrl: '',
    courseName: 'English Language Skills',
    courseId: 'course-3',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-6',
    title: 'System Maintenance Notice',
    content: 'The Knowledge Portal will undergo scheduled maintenance this Sunday from 2 AM to 6 AM. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience.',
    authorName: 'Technical Team',
    authorAvatarUrl: '',
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-7',
    title: 'New Computer Lab Opening',
    content: 'We are pleased to announce the opening of a new computer lab on campus! The lab features 30 new computers with high-speed internet access. It will be available for all students starting next week.',
    authorName: 'School Admin',
    authorAvatarUrl: '',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Store read status in memory (in real app, this would be in the backend)
let announcementReadStatus: Record<string, boolean> = {
  'ann-2': true,
  'ann-4': true,
  'ann-6': true,
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async (): Promise<Announcement[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))

      return MOCK_ANNOUNCEMENTS.map(ann => ({
        ...ann,
        isRead: announcementReadStatus[ann.id] ?? ann.isRead,
      })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },
  })
}

export function useMarkAnnouncementRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (announcementId: string) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200))
      announcementReadStatus[announcementId] = true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
