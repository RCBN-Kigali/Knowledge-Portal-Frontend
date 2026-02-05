import { create } from 'zustand'
import { authApi } from '../api/auth'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  refreshAccessToken: () => Promise<string>
  setUser: (user: User) => void
  clearError: () => void
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const { user, accessToken, refreshToken } = await authApi.login(email, password)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      set({ user, isAuthenticated: true, isLoading: false, error: null })
      return { success: true }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please try again.'
      set({ user: null, isAuthenticated: false, isLoading: false, error: message })
      return { success: false, error: message }
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      set({ user: null, isAuthenticated: false, isLoading: false, error: null })
    }
  },

  checkAuth: async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      set({ isLoading: false, isAuthenticated: false })
      return
    }

    try {
      const user = await authApi.getMe()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          await get().refreshAccessToken()
          const user = await authApi.getMe()
          set({ user, isAuthenticated: true, isLoading: false })
          return
        } catch {
          // refresh failed
        }
      }
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) throw new Error('No refresh token available')

    const { accessToken, refreshToken: newRefreshToken } = await authApi.refresh(refreshToken)
    localStorage.setItem('accessToken', accessToken)
    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken)
    return accessToken
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}))

export default useAuthStore
