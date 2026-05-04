import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../context/AuthContext'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../api/client'

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  queryClient?: QueryClient
  /** Pre-authenticate by writing token + user to localStorage. */
  authAs?: {
    token: string
    user: {
      id: string
      email: string
      name: string
      role: 'student' | 'teacher' | 'admin'
      [key: string]: any
    }
  }
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const queryClient = options.queryClient ?? makeQueryClient()

  if (options.authAs) {
    localStorage.setItem(ACCESS_TOKEN_KEY, options.authAs.token)
    localStorage.setItem(REFRESH_TOKEN_KEY, `refresh-${options.authAs.token}`)
    localStorage.setItem(USER_KEY, JSON.stringify(options.authAs.user))
  }

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MemoryRouter initialEntries={options.initialEntries ?? ['/']}>
            {children}
          </MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}
