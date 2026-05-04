import client from './client'
import type { NotificationPage } from '../types'

export const notificationsApi = {
  list: async (params: { filter?: 'unread'; page?: number; limit?: number } = {}): Promise<NotificationPage> => {
    const { data } = await client.get<NotificationPage>('/notifications', { params })
    return data
  },
  unreadCount: async (): Promise<number> => {
    const { data } = await client.get<{ unread_count: number }>('/notifications/unread-count')
    return data.unread_count
  },
  markRead: async (id: string): Promise<void> => {
    await client.post(`/notifications/${id}/read`)
  },
  markAllRead: async (): Promise<void> => {
    await client.post('/notifications/read-all')
  },
}
