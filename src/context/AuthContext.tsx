import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import api from '../lib/api'
import type { User, ApiError } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    // Try to load user from localStorage for offline awareness
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const persistUser = useCallback((user: User | null) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
    setUser(user)
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get<User>('/auth/me')
      persistUser(response.data)
    } catch (err) {
      persistUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [persistUser])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await api.post<User>('/auth/login', { email, password })
      persistUser(response.data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [persistUser])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await api.post<User>('/auth/register', { email, password, name })
      persistUser(response.data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [persistUser])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore logout errors
    } finally {
      persistUser(null)
    }
  }, [persistUser])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
