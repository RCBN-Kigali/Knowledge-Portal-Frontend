import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import DiscoveryHome from './DiscoveryHome'
import { renderWithProviders } from '../../test/test-utils'
import { seedContent, seedUser } from '../../test/msw-server'

const studentAuth = () => {
  const u = seedUser({ id: 'student-1', role: 'student', name: 'S', email: 's@test.example' })
  return {
    token: u.id,
    user: { id: u.id, email: u.email, name: u.name, role: u.role as 'student' },
  }
}

describe('DiscoveryHome', () => {
  it('renders content cards from the discovery feed', async () => {
    seedContent({ id: 'c1', title: 'Photosynthesis', subject: 'Science' })
    seedContent({ id: 'c2', title: 'Linear Equations', subject: 'Math' })

    renderWithProviders(<DiscoveryHome />, { authAs: studentAuth() })

    expect(await screen.findByText('Photosynthesis')).toBeInTheDocument()
    expect(screen.getByText('Linear Equations')).toBeInTheDocument()
  })

  it('filters the feed when a category chip is clicked', async () => {
    const user = userEvent.setup()
    seedContent({ id: 'c1', title: 'Photosynthesis', subject: 'Science' })
    seedContent({ id: 'c2', title: 'Linear Equations', subject: 'Math' })

    renderWithProviders(<DiscoveryHome />, { authAs: studentAuth() })

    expect(await screen.findByText('Photosynthesis')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Math' }))

    await waitFor(() => {
      expect(screen.queryByText('Photosynthesis')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Linear Equations')).toBeInTheDocument()
  })

  it('shows the empty state when there are no items', async () => {
    renderWithProviders(<DiscoveryHome />, { authAs: studentAuth() })

    expect(await screen.findByText(/no content found/i)).toBeInTheDocument()
  })
})
