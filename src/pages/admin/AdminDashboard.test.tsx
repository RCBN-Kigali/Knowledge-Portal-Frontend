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
    // 2 students, 1 approved teacher, 1 pending teacher, 2 published, 1 draft.
    seedUser({ role: 'student' })
    seedUser({ role: 'student' })
    seedUser({ id: 'approved-t', role: 'teacher', approval_status: 'approved' })
    seedUser({
      id: 'pending-t',
      role: 'teacher',
      approval_status: 'pending',
      is_active: false,
    })
    seedContent({ teacher_id: 'approved-t', status: 'published' })
    seedContent({ teacher_id: 'approved-t', status: 'published' })
    seedContent({ teacher_id: 'approved-t', status: 'draft' })

    renderWithProviders(<AdminDashboard />, { authAs: adminAuth() })

    // Wait for stats to render (multiple "2"s appear once loaded).
    await screen.findAllByText('2', undefined, { timeout: 3000 })
    expect(screen.getAllByText('Pending Approvals').length).toBeGreaterThan(0)
    expect(screen.getByText('Total Students')).toBeInTheDocument()
    expect(screen.getByText('Active Content')).toBeInTheDocument()
    // 2 students, 2 published content — both stats show "2".
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(2)
  })

  it('shows zeros when there is no data', async () => {
    renderWithProviders(<AdminDashboard />, { authAs: adminAuth() })

    // Wait until '0' values render (skeletons replaced).
    await screen.findAllByText('0', undefined, { timeout: 3000 })
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(3)
  })
})
