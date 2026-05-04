import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import PendingApprovals from './PendingApprovals'
import { renderWithProviders } from '../../test/test-utils'
import { seedContent, seedUser, state } from '../../test/msw-server'

const adminAuth = () => {
  const u = seedUser({ id: 'admin-1', role: 'admin', name: 'A', email: 'a@test.example' })
  return {
    token: u.id,
    user: { id: u.id, email: u.email, name: u.name, role: u.role as 'admin' },
  }
}

describe('PendingApprovals (content review)', () => {
  it('lists content awaiting admin review with subject + grade metadata', async () => {
    seedContent({
      id: 'pending-1',
      title: 'Photosynthesis review me',
      status: 'pending',
      subject: 'Science',
      grade_level: 'Grade 9',
      hashtags: ['Biology'],
    })

    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText('Photosynthesis review me')).toBeInTheDocument()
    expect(screen.getByText('Science')).toBeInTheDocument()
    expect(screen.getByText('Grade 9')).toBeInTheDocument()
    expect(screen.getByText('#Biology')).toBeInTheDocument()
  })

  it('approves pending content and sets status to published', async () => {
    const user = userEvent.setup()
    seedContent({ id: 'p1', title: 'Approve me', status: 'pending' })

    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText('Approve me')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^approve$/i }))
    await user.click(screen.getByRole('button', { name: /^confirm$/i }))

    await waitFor(() => {
      expect(state.contents.get('p1')?.status).toBe('published')
    })
  })

  it('rejects pending content and sets status to rejected', async () => {
    const user = userEvent.setup()
    seedContent({ id: 'p2', title: 'Reject me', status: 'pending' })

    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText('Reject me')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^reject$/i }))
    await user.click(screen.getByRole('button', { name: /^confirm$/i }))

    await waitFor(() => {
      expect(state.contents.get('p2')?.status).toBe('rejected')
    })
  })

  it('shows empty state when no content is pending', async () => {
    seedContent({ id: 'pub', title: 'Already public', status: 'published' })

    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText(/all caught up/i)).toBeInTheDocument()
    expect(screen.queryByText('Already public')).not.toBeInTheDocument()
  })

  it('filters by search query', async () => {
    const user = userEvent.setup()
    seedContent({ id: 'm1', title: 'Math One', status: 'pending', subject: 'Math' })
    seedContent({ id: 'b1', title: 'Biology Basics', status: 'pending', subject: 'Science' })

    renderWithProviders(<PendingApprovals />, { authAs: adminAuth() })

    expect(await screen.findByText('Math One')).toBeInTheDocument()
    expect(screen.getByText('Biology Basics')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/search by title/i), 'biology')

    expect(screen.getByText('Biology Basics')).toBeInTheDocument()
    expect(screen.queryByText('Math One')).not.toBeInTheDocument()
  })
})
