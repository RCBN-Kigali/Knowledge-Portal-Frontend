import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import ContentReview from './ContentReview'
import { renderWithProviders } from '../../test/test-utils'
import { seedContent, seedUser, state } from '../../test/msw-server'

const adminAuth = () => {
  const u = seedUser({ id: 'admin-1', role: 'admin', name: 'A', email: 'a@test.example' })
  return {
    token: u.id,
    user: { id: u.id, email: u.email, name: u.name, role: u.role as 'admin' },
  }
}

function setup(contentId: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/admin/approvals/:contentId" element={<ContentReview />} />
      <Route path="/admin/approvals" element={<div>Reviews list</div>} />
    </Routes>,
    { authAs: adminAuth(), initialEntries: [`/admin/approvals/${contentId}`] },
  )
}

describe('ContentReview (admin preview)', () => {
  it('renders pending content with title, body, tags, and decision buttons', async () => {
    seedContent({
      id: 'c1',
      title: 'Photosynthesis review',
      description: 'Plants make food using sunlight.\n\n## How it works\n\nGreen.',
      status: 'pending',
      content_type: 'article',
      hashtags: ['Biology', 'Plants'],
    })

    setup('c1')

    expect(
      await screen.findByRole('heading', { name: /photosynthesis review/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Plants make food using sunlight.')).toBeInTheDocument()
    expect(screen.getByText('#Biology')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /approve & publish/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^reject$/i })).toBeInTheDocument()
  })

  it('approves and navigates back to the reviews list', async () => {
    const user = userEvent.setup()
    seedContent({ id: 'c1', title: 'To approve', status: 'pending' })

    setup('c1')

    await user.click(await screen.findByRole('button', { name: /approve & publish/i }))
    await user.click(screen.getByRole('button', { name: /^confirm$/i }))

    await waitFor(() => {
      expect(screen.getByText('Reviews list')).toBeInTheDocument()
    })
    expect(state.contents.get('c1')?.status).toBe('published')
  })

  it('rejects and navigates back', async () => {
    const user = userEvent.setup()
    seedContent({ id: 'c1', title: 'To reject', status: 'pending' })

    setup('c1')

    await user.click(await screen.findByRole('button', { name: /^reject$/i }))
    await user.click(screen.getByRole('button', { name: /^confirm$/i }))

    await waitFor(() => {
      expect(screen.getByText('Reviews list')).toBeInTheDocument()
    })
    expect(state.contents.get('c1')?.status).toBe('rejected')
  })

  it('shows a non-pending notice instead of decision buttons for already-decided content', async () => {
    seedContent({ id: 'c1', title: 'Already published', status: 'published' })

    setup('c1')

    expect(
      await screen.findByText(/no longer pending review/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /approve & publish/i })).not.toBeInTheDocument()
  })
})
