import { create } from 'zustand'
import { authApi } from '../api/auth'

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  // Actions
  login: async (email, password) => {
    const data = await authApi.login(email, password)
    
    const { access_token, refresh_token, user } = data

    // Persist tokens
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('user', JSON.stringify(user))

    set({
      user,
      accessToken: access_token,
      refreshToken: refresh_token,
      isAuthenticated: true,
      isLoading: false,
    })

    return user
  },

  logout: () => {
    // Call API logout (fire and forget)
    authApi.logout()

    // Clear local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  refreshAccessToken: async () => {
    const refreshToken = get().refreshToken || localStorage.getItem('refresh_token')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const data = await authApi.refresh(refreshToken)
    const { access_token } = data

    localStorage.setItem('access_token', access_token)

    set({ accessToken: access_token })

    return access_token
  },

  checkAuth: async () => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const storedUser = localStorage.getItem('user')

    if (!accessToken || !refreshToken) {
      set({ isLoading: false, isAuthenticated: false })
      return false
    }

    // Set tokens from storage
    set({
      accessToken,
      refreshToken,
      user: storedUser ? JSON.parse(storedUser) : null,
    })

    try {
      // Validate token by fetching current user
      const data = await authApi.getMe()
      const user = data.user || data

      localStorage.setItem('user', JSON.stringify(user))

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      })

      return true
    } catch (error) {
      // Token invalid, try refresh
      try {
        await get().refreshAccessToken()
        const data = await authApi.getMe()
        const user = data.user || data

        localStorage.setItem('user', JSON.stringify(user))

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })

        return true
      } catch (refreshError) {
        // Refresh failed, clear auth
        get().logout()
        return false
      }
    }
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))

export default useAuthStore
