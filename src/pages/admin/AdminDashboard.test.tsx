import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import AdminDashboard from './AdminDashboard'
import { renderWithProviders } from '../../test/test-utils'
import { seedContent, seedUser } from '../../test/msw-server'

const adminAuth = () => {
  const u = seedUser({ id: 'admin-1', role: 'admin', name: 'A', email: 'a@test.example' })
  return {
    token: u.id,
    user: { id: u.id, email: u.email, name: u.name, role: u.role as 'admin' },
  }
}

describe('AdminDashboard', () => {
  it('renders live stats from /admin/stats', async () => {
    // 2 students, 1 approved teacher, 2 published content, 1 pending content,
    // 1 draft.
    seedUser({ role: 'student' })
    seedUser({ role: 'student' })
    seedUser({ id: 'approved-t', role: 'teacher', approval_status: 'approved' })
    seedContent({ teacher_id: 'approved-t', status: 'published' })
    seedContent({ teacher_id: 'approved-t', status: 'published' })
    seedContent({ teacher_id: 'approved-t', status: 'pending' })
    seedContent({ teacher_id: 'approved-t', status: 'draft' })

    renderWithProviders(<AdminDashboard />, { authAs: adminAuth() })

    await screen.findAllByText('2', undefined, { timeout: 3000 })
    expect(screen.getAllByText('Pending Reviews').length).toBeGreaterThan(0)
    expect(screen.getByText('Total Students')).toBeInTheDocument()
    expect(screen.getByText('Active Content')).toBeInTheDocument()
    // 2 students, 2 published — both render "2".
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(2)
  })

  it('shows zeros when there is no data', async () => {
    renderWithProviders(<AdminDashboard />, { authAs: adminAuth() })

    await screen.findAllByText('0', undefined, { timeout: 3000 })
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3)
  })
})
