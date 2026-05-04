import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import TeacherDashboard from './TeacherDashboard'
import { renderWithProviders } from '../../test/test-utils'
import { seedContent, seedUser } from '../../test/msw-server'

const teacherAuth = () => {
  const u = seedUser({
    id: 'teacher-1',
    role: 'teacher',
    name: 'Dr. Test',
    email: 'tt@test.example',
    approval_status: 'approved',
    subjects: ['Math'],
  })
  return {
    token: u.id,
    user: { id: u.id, email: u.email, name: u.name, role: u.role as 'teacher' },
  }
}

describe('TeacherDashboard', () => {
  it("lists the teacher's own content with status badges", async () => {
    seedContent({
      id: 'c1',
      teacher_id: 'teacher-1',
      title: 'Published Lesson',
      status: 'published',
    })
    seedContent({
      id: 'c2',
      teacher_id: 'teacher-1',
      title: 'Draft Lesson',
      status: 'draft',
    })

    renderWithProviders(<TeacherDashboard />, { authAs: teacherAuth() })

    expect(await screen.findByText('Published Lesson')).toBeInTheDocument()
    expect(screen.getByText('Draft Lesson')).toBeInTheDocument()
    expect(screen.getByText(/^published$/i)).toBeInTheDocument()
    expect(screen.getByText(/^draft$/i)).toBeInTheDocument()
  })

  it('filters by content type when a type chip is clicked', async () => {
    const user = userEvent.setup()
    seedContent({
      id: 'c1',
      teacher_id: 'teacher-1',
      title: 'Article One',
      content_type: 'article',
    })
    seedContent({
      id: 'c2',
      teacher_id: 'teacher-1',
      title: 'Video One',
      content_type: 'video',
    })

    renderWithProviders(<TeacherDashboard />, { authAs: teacherAuth() })
    expect(await screen.findByText('Article One')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Articles' }))

    expect(screen.getByText('Article One')).toBeInTheDocument()
    expect(screen.queryByText('Video One')).not.toBeInTheDocument()
  })

  it('shows the empty state when the teacher has no content', async () => {
    renderWithProviders(<TeacherDashboard />, { authAs: teacherAuth() })

    expect(await screen.findByText(/no content yet/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /upload your first lesson/i })
    ).toBeInTheDocument()
  })
})
