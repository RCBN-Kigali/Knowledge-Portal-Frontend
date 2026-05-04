import client from './client'
import type { TokenResponse, User, UserRole } from '../types'

export interface RegisterPayload {
  email: string
  password: string
  name: string
  role: UserRole
  school?: string | null
  subjects?: string[] | null
}

export const authApi = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const { data } = await client.post<TokenResponse>('/auth/login', { email, password })
    return data
  },
  register: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await client.post<User>('/auth/register', payload)
    return data
  },
  logout: async (): Promise<void> => {
    try {
      await client.post('/auth/logout')
    } catch {
      /* stateless logout */
    }
  },
  me: async (): Promise<User> => {
    const { data } = await client.get<User>('/auth/me')
    return data
  },
}
