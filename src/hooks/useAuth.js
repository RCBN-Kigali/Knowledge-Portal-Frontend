import { useCallback } from 'react'
import useAuthStore from '../stores/authStore'

export function useAuth() {
  const store = useAuthStore()

  const login = useCallback(
    async (email, password) => {
      return store.login(email, password)
    },
    [store]
  )

  const logout = useCallback(() => {
    store.logout()
  }, [store])

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login,
    logout,
    checkAuth: store.checkAuth,
  }
}

export default useAuth
