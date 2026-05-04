import client from './client'
import type { EngagementState } from '../types'

export const engagementApi = {
  get: async (contentId: string): Promise<EngagementState> => {
    const { data } = await client.get<EngagementState>(`/content/${contentId}/engagement`)
    return data
  },
  like: async (contentId: string): Promise<EngagementState> => {
    const { data } = await client.post<EngagementState>(`/content/${contentId}/like`)
    return data
  },
  dislike: async (contentId: string): Promise<EngagementState> => {
    const { data } = await client.post<EngagementState>(`/content/${contentId}/dislike`)
    return data
  },
}
