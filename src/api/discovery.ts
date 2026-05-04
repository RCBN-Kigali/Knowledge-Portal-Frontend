import client from './client'
import type { CategoriesResponse, FeedPage, TrendingResponse } from '../types'

export const discoveryApi = {
  feed: async (params: { page?: number; limit?: number; category?: string; sort?: string } = {}): Promise<FeedPage> => {
    const { data } = await client.get<FeedPage>('/discover/feed', { params })
    return data
  },
  search: async (params: { q: string; page?: number; limit?: number }): Promise<FeedPage> => {
    const { data } = await client.get<FeedPage>('/search', { params })
    return data
  },
  explore: async (params: { career?: string; subject?: string; page?: number; limit?: number } = {}): Promise<FeedPage> => {
    const { data } = await client.get<FeedPage>('/explore', { params })
    return data
  },
  trending: async (): Promise<TrendingResponse> => {
    const { data } = await client.get<TrendingResponse>('/trending')
    return data
  },
  categories: async (): Promise<CategoriesResponse> => {
    const { data } = await client.get<CategoriesResponse>('/categories')
    return data
  },
}
