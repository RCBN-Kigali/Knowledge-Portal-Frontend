import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
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

    const created = Array.from(state.users.values()).find(
      (u) => u.email === 'newstudent@test.example'
    )
    expect(created?.role).toBe('student')
  })

  it('shows an error if the email is already registered', async () => {
    const user = userEvent.setup()

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

  it('shows a hint that teachers cannot self-register', () => {
    renderWithProviders(<Signup />, { initialEntries: ['/signup'] })

    expect(
      screen.getByText(/teacher accounts are created by your school administrator/i)
    ).toBeInTheDocument()

    // The teacher option is gone — there's no "Teacher" toggle button.
    expect(screen.queryByRole('button', { name: /^teacher$/i })).not.toBeInTheDocument()
  })
})
