import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import PendingApprovals from './PendingApprovals'
import { renderWithProviders } from '../../test/test-utils'
import { seedUser, state } from '../../test/msw-server'

const adminAuth = () => {
  const u = seedUser({ id: 'admin-1', role: 'admin', name: 'A', email: 'a@test.example' })
  return {
    token: u.id,
    user: { id: u.id, email: u.email, name: u.name, role: u.role as 'admin' },
  }
}

describe('PendingApprovals', () => {
  it('lists pending teacher applications with their school and subjects', async () => {
    seedUser({
      id: 'pending-1',
      role: 'teacher',
      name: 'Claudine Uwimana',
      email: 'c@test.example',
      school: 'Paysannat L B',
      subjects: ['Mathematics'],
      approval_status: 'pending',
      is_active: false,
    })

    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText('Claudine Uwimana')).toBeInTheDocument()
    expect(screen.getByText('Paysannat L B')).toBeInTheDocument()
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
  })

  it('approves a teacher and removes them from the list', async () => {
    const user = userEvent.setup()
    seedUser({
      id: 'pending-1',
      role: 'teacher',
      name: 'To Approve',
      email: 't1@test.example',
      school: 'Paysannat L A',
      subjects: ['Mathematics'],
      approval_status: 'pending',
      is_active: false,
    })

    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText('To Approve')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /approve/i }))
    // Confirmation modal -> click confirm.
    await user.click(screen.getByRole('button', { name: /^confirm$/i }))

    await waitFor(() => {
      expect(state.users.get('pending-1')?.approval_status).toBe('approved')
      expect(state.users.get('pending-1')?.is_active).toBe(true)
    })
  })

  it('shows the empty state when no teachers are pending', async () => {
    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText(/all caught up/i)).toBeInTheDocument()
  })

  it('filters the list with the search box', async () => {
    const user = userEvent.setup()
    seedUser({
      id: 'pending-1',
      role: 'teacher',
      name: 'Alice Anderson',
      email: 'a@test.example',
      school: 'Paysannat L A',
      subjects: ['Math'],
      approval_status: 'pending',
      is_active: false,
    })
    seedUser({
      id: 'pending-2',
      role: 'teacher',
      name: 'Bob Brown',
      email: 'b@test.example',
      school: 'Paysannat L B',
      subjects: ['English'],
      approval_status: 'pending',
      is_active: false,
    })

    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText('Alice Anderson')).toBeInTheDocument()
    expect(screen.getByText('Bob Brown')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/search by name/i), 'alice')

    expect(screen.getByText('Alice Anderson')).toBeInTheDocument()
    expect(screen.queryByText('Bob Brown')).not.toBeInTheDocument()
  })
})
