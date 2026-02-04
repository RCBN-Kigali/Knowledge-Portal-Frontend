import client from './client'

export const authApi = {
  login: async (email, password) => {
    const response = await client.post('/auth/login', { email, password })
    return response.data
  },

  refresh: async (refreshToken) => {
    const response = await client.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  getMe: async () => {
    const response = await client.get('/auth/me')
    return response.data
  },

  logout: async () => {
    try {
      await client.post('/auth/logout')
    } catch (error) {
      // Ignore logout errors - we'll clear local state anyway
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await client.put('/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
    return response.data
  },
}

export default authApi
