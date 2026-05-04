import client from './client'
import type { Content } from '../types'

export const contentApi = {
  get: async (contentId: string): Promise<Content> => {
    const { data } = await client.get<Content>(`/content/${contentId}`)
    return data
  },
}
