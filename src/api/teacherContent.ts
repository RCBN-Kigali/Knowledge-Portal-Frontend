import client from './client'
import type { Content, ExternalLink } from '../types'

export interface TeacherContentUploadInput {
  title: string
  description?: string
  content_type: 'video' | 'audio' | 'article'
  subject: string
  grade_level: string
  duration_minutes?: number | null
  hashtags?: string[]
  external_links?: ExternalLink[]
  publish?: boolean
  file?: File | null
}

export interface TeacherContentUpdateInput {
  title?: string
  description?: string
  hashtags?: string[]
  external_links?: ExternalLink[]
  // Teachers may transition content to 'draft' or 'pending'. Admin
  // endpoints handle 'published' and 'rejected'.
  status?: 'draft' | 'pending'
  subject?: string
  grade_level?: string
  duration_minutes?: number | null
}

export const teacherContentApi = {
  list: async (params: { page?: number; limit?: number } = {}): Promise<Content[]> => {
    const { data } = await client.get<Content[]>('/teachers/content', { params })
    return data
  },

  get: async (contentId: string): Promise<Content> => {
    const { data } = await client.get<Content>(`/teachers/content/${contentId}`)
    return data
  },

  create: async (input: TeacherContentUploadInput): Promise<Content> => {
    const fd = new FormData()
    fd.append('title', input.title)
    fd.append('description', input.description ?? '')
    fd.append('content_type', input.content_type)
    fd.append('subject', input.subject)
    fd.append('grade_level', input.grade_level)
    if (input.duration_minutes != null) fd.append('duration_minutes', String(input.duration_minutes))
    if (input.hashtags) fd.append('hashtags', input.hashtags.join(','))
    fd.append('external_links', JSON.stringify(input.external_links ?? []))
    fd.append('publish', String(input.publish ?? false))
    if (input.file) fd.append('file', input.file)
    const { data } = await client.post<Content>('/teachers/content', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  update: async (contentId: string, input: TeacherContentUpdateInput): Promise<Content> => {
    const { data } = await client.patch<Content>(`/teachers/content/${contentId}`, input)
    return data
  },

  remove: async (contentId: string): Promise<void> => {
    await client.delete(`/teachers/content/${contentId}`)
  },
}
