import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import Login from './Login'
import { renderWithProviders } from '../../test/test-utils'
import { seedUser } from '../../test/msw-server'

describe('Login page', () => {
  it('logs in a student and redirects to /student', async () => {
    seedUser({ id: 'student-1', email: 'jean@test.example', role: 'student', name: 'Jean' })
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<div>Student Home</div>} />
      </Routes>,
      { initialEntries: ['/login'] }
    )

    await user.type(screen.getByLabelText(/email address/i), 'jean@test.example')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText('Student Home')).toBeInTheDocument()
    })
  })

  it('redirects a teacher to /teacher/dashboard after login', async () => {
    seedUser({
      id: 'teacher-1',
      email: 't@test.example',
      role: 'teacher',
      name: 'T',
      approval_status: 'approved',
    })
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teacher/dashboard" element={<div>Teacher Dashboard</div>} />
      </Routes>,
      { initialEntries: ['/login'] }
    )

    await user.type(screen.getByLabelText(/email address/i), 't@test.example')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument())
  })

  it('redirects an admin to /admin/dashboard after login', async () => {
    seedUser({ id: 'admin-1', email: 'a@test.example', role: 'admin', name: 'A' })
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
      </Routes>,
      { initialEntries: ['/login'] }
    )

    await user.type(screen.getByLabelText(/email address/i), 'a@test.example')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(screen.getByText('Admin Dashboard')).toBeInTheDocument())
  })

  it('shows an error message on bad credentials', async () => {
    seedUser({ email: 'jean@test.example', role: 'student', name: 'Jean' })
    const user = userEvent.setup()

    renderWithProviders(<Login />, { initialEntries: ['/login'] })

    await user.type(screen.getByLabelText(/email address/i), 'jean@test.example')
    await user.type(screen.getByLabelText(/password/i), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('redirects pending teachers to /teacher/pending', async () => {
    seedUser({
      id: 'pending-1',
      email: 'pending@test.example',
      role: 'teacher',
      name: 'Pending',
      approval_status: 'pending',
      is_active: false,
    })
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teacher/pending" element={<div>Awaiting approval</div>} />
      </Routes>,
      { initialEntries: ['/login'] }
    )

    await user.type(screen.getByLabelText(/email address/i), 'pending@test.example')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() =>
      expect(screen.getByText(/awaiting approval/i)).toBeInTheDocument()
    )
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />, { initialEntries: ['/login'] })

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
    expect(passwordInput.type).toBe('password')

    // The toggle is the only icon-only button in the form before submit.
    const toggle = passwordInput.parentElement!.querySelector('button[type="button"]')
    await user.click(toggle!)
    expect(passwordInput.type).toBe('text')
  })
})
