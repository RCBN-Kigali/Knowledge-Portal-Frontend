import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { authApi, type RegisterPayload } from '../api/auth'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../api/client'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps { children: ReactNode }

function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as User } catch { return null }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(readStoredUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Re-hydrate via /auth/me on mount when an access token is present.
  useEffect(() => {
    if (!localStorage.getItem(ACCESS_TOKEN_KEY)) return
    let cancelled = false
    authApi.me()
      .then((fresh) => {
        if (cancelled) return
        localStorage.setItem(USER_KEY, JSON.stringify(fresh))
        setUser(fresh)
      })
      .catch(() => { /* 401 will be handled by interceptor */ })
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setError(null)
    setIsLoading(true)
    try {
      const tokens = await authApi.login(email, password)
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
      localStorage.setItem(USER_KEY, JSON.stringify(tokens.user))
      setUser(tokens.user)
      return tokens.user
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const msg = typeof detail === 'string' ? detail : 'Invalid email or password'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (payload: RegisterPayload): Promise<User> => {
    setError(null)
    setIsLoading(true)
    try {
      return await authApi.register(payload)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const msg = typeof detail === 'string' ? detail : 'Registration failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user, error,
      login, register, logout, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
