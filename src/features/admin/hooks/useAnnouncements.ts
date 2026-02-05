import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'

export interface Announcement {
  id: string
  title: string
  content: string
  audience: {
    type: 'all' | 'school' | 'role'
    schoolIds?: string[]
    schoolNames?: string[]
    roles?: string[]
  }
  priority: 'low' | 'normal' | 'high'
  status: 'published' | 'draft' | 'scheduled'
  authorId: string
  authorName: string
  createdAt: string
  publishedAt?: string
  scheduledFor?: string
}

export interface AnnouncementFilters {
  status?: 'published' | 'draft' | 'scheduled'
  schoolId?: string
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Welcome to the New Semester',
    content: 'We are excited to welcome you to the new semester. Please check your course enrollments and make sure all your information is up to date. If you have any questions, please contact your school administrator.',
    audience: { type: 'all' },
    priority: 'high',
    status: 'published',
    authorId: 'admin-1',
    authorName: 'Admin User',
    createdAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'Teacher Professional Development Workshop',
    content: 'All teachers are invited to attend the professional development workshop next Friday. Topics will include modern teaching methodologies and digital tools for the classroom.',
    audience: { type: 'role', roles: ['school_teacher', 'independent_teacher'] },
    priority: 'normal',
    status: 'published',
    authorId: 'admin-1',
    authorName: 'Admin User',
    createdAt: '2024-01-14T09:00:00Z',
    publishedAt: '2024-01-14T09:00:00Z',
  },
  {
    id: 'ann-3',
    title: 'System Maintenance Notice',
    content: 'The platform will undergo scheduled maintenance this Sunday from 2-4 AM EAT. Please save your work before this time. We apologize for any inconvenience.',
    audience: { type: 'all' },
    priority: 'high',
    status: 'scheduled',
    authorId: 'super-admin',
    authorName: 'Super Admin',
    createdAt: '2024-01-13T14:00:00Z',
    scheduledFor: '2024-01-20T02:00:00Z',
  },
  {
    id: 'ann-4',
    title: 'New Course Categories Available',
    content: 'We have added new course categories including Environmental Science and Digital Skills. Teachers can now create courses in these categories.',
    audience: { type: 'role', roles: ['school_teacher'] },
    priority: 'normal',
    status: 'draft',
    authorId: 'admin-1',
    authorName: 'Admin User',
    createdAt: '2024-01-12T11:00:00Z',
  },
  {
    id: 'ann-5',
    title: 'Student Progress Reports',
    content: 'End of term progress reports are now available. Students can view their reports in the Progress section of their dashboard.',
    audience: { type: 'role', roles: ['school_student'] },
    priority: 'normal',
    status: 'published',
    authorId: 'admin-1',
    authorName: 'Admin User',
    createdAt: '2024-01-10T15:00:00Z',
    publishedAt: '2024-01-10T15:00:00Z',
  },
]

export function useAnnouncements(filters?: AnnouncementFilters) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['adminAnnouncements', user?.role, user?.schoolId, filters],
    queryFn: async (): Promise<Announcement[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      let announcements = [...MOCK_ANNOUNCEMENTS]
      
      // Filter by status
      if (filters?.status) {
        announcements = announcements.filter(a => a.status === filters.status)
      }
      
      // School admin sees only their school's announcements
      if (user?.role === 'school_admin' && filters?.schoolId) {
        announcements = announcements.filter(a => 
          a.audience.type === 'all' || 
          (a.audience.type === 'school' && a.audience.schoolIds?.includes(filters.schoolId!))
        )
      }
      
      // Sort by creation date, newest first
      announcements.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      return announcements
    },
    enabled: user?.role === 'school_admin' || user?.role === 'super_admin',
  })
}

export interface CreateAnnouncementData {
  title: string
  content: string
  audience: Announcement['audience']
  priority: 'low' | 'normal' | 'high'
  status: 'published' | 'draft' | 'scheduled'
  scheduledFor?: string
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (data: CreateAnnouncementData): Promise<Announcement> => {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newAnnouncement: Announcement = {
        id: 'ann-' + Math.random().toString(36).substr(2, 9),
        title: data.title,
        content: data.content,
        audience: data.audience,
        priority: data.priority,
        status: data.status,
        authorId: user?.id || '',
        authorName: user?.name || 'Admin',
        createdAt: new Date().toISOString(),
        publishedAt: data.status === 'published' ? new Date().toISOString() : undefined,
        scheduledFor: data.scheduledFor,
      }
      return newAnnouncement
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
    },
  })
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAnnouncementData> }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
    },
  })
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (announcementId: string) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return announcementId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
    },
  })
}
