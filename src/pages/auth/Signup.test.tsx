import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import Signup from './Signup'
import { renderWithProviders } from '../../test/test-utils'
import { state } from '../../test/msw-server'

describe('Signup page', () => {
  it('registers a student and signs them in automatically', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/student" element={<div>Discovery Home</div>} />
      </Routes>,
      { initialEntries: ['/signup'] }
    )

    await user.type(screen.getByLabelText(/full name/i), 'New Student')
    await user.type(screen.getByLabelText(/email address/i), 'newstudent@test.example')
    await user.type(screen.getByLabelText(/^password$/i), 'password123')
    await user.click(screen.getByRole('button', { name: /join now/i }))

    await waitFor(() => {
      expect(screen.getByText('Discovery Home')).toBeInTheDocument()
    })

    // Confirm a user actually landed in our mock backend.
    const created = Array.from(state.users.values()).find(
      (u) => u.email === 'newstudent@test.example'
    )
    expect(created?.role).toBe('student')
  })

  it('routes a teacher signup to /teacher/pending without auto-login', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/teacher/pending" element={<div>Application pending review</div>} />
      </Routes>,
      { initialEntries: ['/signup'] }
    )

    await user.click(screen.getByRole('button', { name: /^teacher$/i }))
    await user.type(screen.getByLabelText(/full name/i), 'New Teacher')
    await user.type(screen.getByLabelText(/email address/i), 'newteacher@test.example')
    await user.type(screen.getByLabelText(/^password$/i), 'password123')

    // The subjects multi-select is required for teachers; pick at least one.
    await user.click(screen.getByRole('checkbox', { name: /mathematics/i }))

    await user.click(screen.getByRole('button', { name: /submit application/i }))

    await waitFor(() => {
      expect(screen.getByText(/application pending review/i)).toBeInTheDocument()
    })

    const created = Array.from(state.users.values()).find(
      (u) => u.email === 'newteacher@test.example'
    )
    expect(created?.role).toBe('teacher')
    expect(created?.approval_status).toBe('pending')
    expect(created?.subjects).toContain('Mathematics')
  })

  it('blocks teacher signup when no subject is selected', async () => {
    const user = userEvent.setup()

    renderWithProviders(<Signup />, { initialEntries: ['/signup'] })

    await user.click(screen.getByRole('button', { name: /^teacher$/i }))
    await user.type(screen.getByLabelText(/full name/i), 'No Subjects')
    await user.type(screen.getByLabelText(/email address/i), 'nope@test.example')
    await user.type(screen.getByLabelText(/^password$/i), 'password123')

    await user.click(screen.getByRole('button', { name: /submit application/i }))

    expect(
      screen.getByText(/please select at least one subject/i)
    ).toBeInTheDocument()
  })

  it('shows an error if the email is already registered', async () => {
    const user = userEvent.setup()

    // Pre-seed the user so signup hits the "already registered" path on first try.
    state.users.set('existing', {
      id: 'existing',
      email: 'dup@test.example',
      password: 'password123',
      name: 'Existing',
      role: 'student',
      school: null,
      subjects: null,
      is_active: true,
      approval_status: null,
      created_at: new Date().toISOString(),
    })

    renderWithProviders(<Signup />, { initialEntries: ['/signup'] })

    await user.type(screen.getByLabelText(/full name/i), 'Second')
    await user.type(screen.getByLabelText(/email address/i), 'dup@test.example')
    await user.type(screen.getByLabelText(/^password$/i), 'password123')
    await user.click(screen.getByRole('button', { name: /join now/i }))

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument()
    })
  })
})
