import client from './client'
import type { CommentItem, CommentPage, TeacherInboxPage } from '../types'

export const commentsApi = {
  list: async (contentId: string, params: { page?: number; limit?: number } = {}): Promise<CommentPage> => {
    const { data } = await client.get<CommentPage>(`/content/${contentId}/comments`, { params })
    return data
  },
  create: async (contentId: string, text: string): Promise<CommentItem> => {
    const { data } = await client.post<CommentItem>(`/content/${contentId}/comments`, { text })
    return data
  },
  remove: async (commentId: string): Promise<void> => {
    await client.delete(`/comments/${commentId}`)
  },
  inbox: async (params: { filter?: 'unread' | 'all'; page?: number; limit?: number } = {}): Promise<TeacherInboxPage> => {
    const { data } = await client.get<TeacherInboxPage>('/teachers/comments', { params })
    return data
  },
  reply: async (commentId: string, text: string): Promise<CommentItem> => {
    const { data } = await client.post<CommentItem>(`/comments/${commentId}/replies`, { text })
    return data
  },
}
