import client from './client'
import type { AnnouncementDetail, AnnouncementPage } from '../types'

export const announcementsApi = {
  list: async (params: { page?: number; limit?: number } = {}): Promise<AnnouncementPage> => {
    const { data } = await client.get<AnnouncementPage>('/announcements', { params })
    return data
  },
  get: async (id: string): Promise<AnnouncementDetail> => {
    const { data } = await client.get<AnnouncementDetail>(`/announcements/${id}`)
    return data
  },
  markRead: async (id: string): Promise<void> => {
    await client.post(`/announcements/${id}/read`)
  },
}
