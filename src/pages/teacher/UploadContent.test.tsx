import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import UploadContent from './UploadContent'
import { renderWithProviders } from '../../test/test-utils'
import { seedUser, state } from '../../test/msw-server'

const teacherAuth = () => {
  const u = seedUser({
    id: 'teacher-1',
    role: 'teacher',
    name: 'Dr. Test',
    email: 't@test.example',
    approval_status: 'approved',
  })
  return {
    token: u.id,
    user: { id: u.id, email: u.email, name: u.name, role: u.role as 'teacher' },
  }
}

describe('UploadContent', () => {
  it('disables the publish button until the form is valid', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UploadContent />, { authAs: teacherAuth() })

    const publish = screen.getByRole('button', { name: /submit for review/i }) as HTMLButtonElement
    expect(publish.disabled).toBe(true)

    // Fill the easy bits.
    await user.type(screen.getByPlaceholderText(/enter content title/i), 'My Article')
    // The article content-type tile button contains an "Article" heading.
    await user.click(screen.getByRole('heading', { name: 'Article' }).closest('button')!)

    // Without subject + grade + body the button is still disabled.
    expect(publish.disabled).toBe(true)
  })

  it('publishes a new article and navigates to the dashboard', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/teacher/upload" element={<UploadContent />} />
        <Route path="/teacher/dashboard" element={<div>My Content</div>} />
      </Routes>,
      { authAs: teacherAuth(), initialEntries: ['/teacher/upload'] }
    )

    await user.type(screen.getByPlaceholderText(/enter content title/i), 'New Article')
    // The article content-type tile button contains an "Article" heading.
    await user.click(screen.getByRole('heading', { name: 'Article' }).closest('button')!)

    // Subject dropdown — open + pick.
    await user.click(screen.getByText(/pick a subject/i).closest("button")!)
    await user.click(await screen.findByRole('option', { name: 'Math' }))

    await user.click(screen.getByText(/pick a level/i).closest("button")!)
    await user.click(await screen.findByRole('option', { name: 'Intermediate' }))

    // Article body.
    const body = screen.getByPlaceholderText(/write your article content here/i)
    await user.type(body, 'Article body text.')

    const publish = screen.getByRole('button', { name: /submit for review/i })
    await waitFor(() => expect((publish as HTMLButtonElement).disabled).toBe(false))
    await user.click(publish)

    await waitFor(() => expect(screen.getByText('My Content')).toBeInTheDocument())

    const created = Array.from(state.contents.values()).find((c) => c.title === 'New Article')
    expect(created).toBeDefined()
    // New workflow: 'Submit for Review' goes to 'pending', not 'published'.
    expect(created!.status).toBe('pending')
    expect(created!.subject).toBe('Math')
    expect(created!.grade_level).toBe('Intermediate')
  })

  it('saves a draft via the Save as Draft button', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/teacher/upload" element={<UploadContent />} />
        <Route path="/teacher/dashboard" element={<div>My Content</div>} />
      </Routes>,
      { authAs: teacherAuth(), initialEntries: ['/teacher/upload'] }
    )

    await user.type(screen.getByPlaceholderText(/enter content title/i), 'Draft article')
    // The article content-type tile button contains an "Article" heading.
    await user.click(screen.getByRole('heading', { name: 'Article' }).closest('button')!)

    await user.click(screen.getByText(/pick a subject/i).closest("button")!)
    await user.click(await screen.findByRole('option', { name: 'Science' }))

    await user.click(screen.getByText(/pick a level/i).closest("button")!)
    await user.click(await screen.findByRole('option', { name: 'Advanced' }))

    await user.type(screen.getByPlaceholderText(/write your article content here/i), 'WIP')

    await user.click(screen.getByRole('button', { name: /save as draft/i }))

    await waitFor(() => expect(screen.getByText('My Content')).toBeInTheDocument())
    const created = Array.from(state.contents.values()).find((c) => c.title === 'Draft article')
    expect(created!.status).toBe('draft')
  })

  it('saves the chosen career with the content', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <Routes>
        <Route path="/teacher/upload" element={<UploadContent />} />
        <Route path="/teacher/dashboard" element={<div>My Content</div>} />
      </Routes>,
      { authAs: teacherAuth(), initialEntries: ['/teacher/upload'] }
    )

    await user.type(screen.getByPlaceholderText(/enter content title/i), 'Career Article')
    await user.click(screen.getByRole('heading', { name: 'Article' }).closest('button')!)

    await user.click(screen.getByText(/pick a subject/i).closest('button')!)
    await user.click(await screen.findByRole('option', { name: 'Science' }))

    await user.click(screen.getByText(/pick a level/i).closest('button')!)
    await user.click(await screen.findByRole('option', { name: 'Beginner' }))

    await user.click(screen.getByText(/link this content to a career/i).closest('button')!)
    await user.click(await screen.findByRole('option', { name: 'Technology & IT' }))

    await user.type(screen.getByPlaceholderText(/write your article content here/i), 'Body')
    await user.click(screen.getByRole('button', { name: /save as draft/i }))

    await waitFor(() => expect(screen.getByText('My Content')).toBeInTheDocument())
    const created = Array.from(state.contents.values()).find((c) => c.title === 'Career Article')
    expect(created!.career).toBe('technology')
  })
})
