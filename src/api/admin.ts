import client from './client'
import type { Content } from '../types'

export interface AdminStats {
  pending_approvals: number
  pending_content: number
  total_teachers: number
  active_teachers: number
  total_students: number
  total_content: number
  published_content: number
  draft_content: number
}

export interface TeacherPublic {
  id: string
  email: string
  name: string
  school: string | null
  subjects: string[] | null
  is_active: boolean
  approval_status: 'pending' | 'approved' | 'rejected' | null
  created_at: string
}

export interface ApprovalsResponse {
  total: number
  pending: TeacherPublic[]
}

export interface PendingContentPage {
  page: number
  limit: number
  total: number
  items: Content[]
}

export interface AddTeacherInput {
  email: string
  name: string
  school: string
  subjects?: string[]
  password_generated?: boolean
  password?: string | null
}

export interface CreateAnnouncementInput {
  title: string
  content: string
  priority: 'normal' | 'high'
}

export interface AnnouncementDetailDTO {
  id: string
  title: string
  content: string
  priority: 'normal' | 'high'
  created_by: string
  created_at: string
  is_read: boolean
}

export const adminApi = {
  stats: async (): Promise<AdminStats> => {
    const { data } = await client.get<AdminStats>('/admin/stats')
    return data
  },
  approvals: async (): Promise<ApprovalsResponse> => {
    const { data } = await client.get<ApprovalsResponse>('/admin/approvals')
    return data
  },
  approveTeacher: async (userId: string): Promise<TeacherPublic> => {
    const { data } = await client.post<TeacherPublic>(`/admin/approvals/${userId}/approve`)
    return data
  },
  rejectTeacher: async (userId: string): Promise<TeacherPublic> => {
    const { data } = await client.post<TeacherPublic>(`/admin/approvals/${userId}/reject`)
    return data
  },
  listTeachers: async (params: {
    page?: number
    limit?: number
    filter?: 'active' | 'deactivated' | 'all'
  } = {}): Promise<TeacherPublic[]> => {
    const { data } = await client.get<TeacherPublic[]>('/admin/teachers', { params })
    return data
  },
  toggleTeacher: async (teacherId: string): Promise<TeacherPublic> => {
    const { data } = await client.patch<TeacherPublic>(`/admin/teachers/${teacherId}/toggle`)
    return data
  },
  addTeacher: async (input: AddTeacherInput): Promise<TeacherPublic> => {
    const { data } = await client.post<TeacherPublic>('/admin/teachers', input)
    return data
  },
  createAnnouncement: async (input: CreateAnnouncementInput): Promise<AnnouncementDetailDTO> => {
    const { data } = await client.post<AnnouncementDetailDTO>('/announcements', input)
    return data
  },
  deleteAnnouncement: async (id: string): Promise<void> => {
    await client.delete(`/announcements/${id}`)
  },
  // ─── Content review (new approval workflow) ────────────────────────────
  pendingContent: async (
    params: { page?: number; limit?: number } = {},
  ): Promise<PendingContentPage> => {
    const { data } = await client.get<PendingContentPage>('/admin/content/pending', { params })
    return data
  },
  approveContent: async (contentId: string): Promise<Content> => {
    const { data } = await client.post<Content>(`/admin/content/${contentId}/approve`)
    return data
  },
  rejectContent: async (contentId: string): Promise<Content> => {
    const { data } = await client.post<Content>(`/admin/content/${contentId}/reject`)
    return data
  },
}
