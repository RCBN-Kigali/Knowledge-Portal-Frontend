import client from './client'
import type { CommentItem, CommentPage } from '../types'

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
}
