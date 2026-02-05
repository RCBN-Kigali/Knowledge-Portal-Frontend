import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'

// Mock users for development
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'jean@paysannat.edu.rw': {
    password: 'password123',
    user: {
      id: '1',
      email: 'jean@paysannat.edu.rw',
      name: 'Jean Baptiste',
      firstName: 'Jean',
      lastName: 'Baptiste',
      role: 'school_student',
      schoolId: 'school-1',
      schoolName: 'Paysannat Main Campus',
      permissions: ['view_courses', 'enroll_courses'],
    },
  },
  'marie@paysannat-east.edu.rw': {
    password: 'password123',
    user: {
      id: '2',
      email: 'marie@paysannat-east.edu.rw',
      name: 'Marie Claire',
      firstName: 'Marie',
      lastName: 'Claire',
      role: 'school_student',
      schoolId: 'school-2',
      schoolName: 'Paysannat Eastern',
      permissions: ['view_courses', 'enroll_courses'],
    },
  },
  'teacher@paysannat.edu.rw': {
    password: 'password123',
    user: {
      id: '3',
      email: 'teacher@paysannat.edu.rw',
      name: 'Prof. Uwimana',
      firstName: 'Alice',
      lastName: 'Uwimana',
      role: 'school_teacher',
      schoolId: 'school-1',
      schoolName: 'Paysannat Main Campus',
      permissions: ['view_courses', 'create_courses', 'manage_students'],
    },
  },
  'admin@paysannat.edu.rw': {
    password: 'password123',
    user: {
      id: '4',
      email: 'admin@paysannat.edu.rw',
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      role: 'school_admin',
      schoolId: 'school-1',
      schoolName: 'Paysannat Main Campus',
      permissions: ['manage_school', 'manage_teachers', 'manage_students', 'approve_courses'],
    },
  },
  'superadmin@rcbn.edu.rw': {
    password: 'password123',
    user: {
      id: '5',
      email: 'superadmin@rcbn.edu.rw',
      name: 'Super Admin',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      schoolId: null,
      schoolName: undefined,
      permissions: ['manage_all_schools', 'manage_all_users', 'approve_public_courses', 'manage_announcements'],
    },
  },
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User>
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
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)
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
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setError(null)
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockUser = MOCK_USERS[email.toLowerCase()]
    
    if (!mockUser || mockUser.password !== password) {
      setIsLoading(false)
      setError('Invalid email or password')
      throw new Error('Invalid credentials')
    }
    
    persistUser(mockUser.user)
    setIsLoading(false)
    return mockUser.user
  }, [persistUser])

  const register = useCallback(async (_email: string, _password: string, _name: string) => {
    setError('Registration is disabled. Contact your school administrator.')
    throw new Error('Registration disabled')
  }, [])

  const logout = useCallback(async () => {
    persistUser(null)
  }, [persistUser])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        register,
        logout,
        checkAuth,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
