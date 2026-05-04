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

    const publish = screen.getByRole('button', { name: /publish content/i }) as HTMLButtonElement
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

    await user.click(screen.getByText(/pick a grade/i).closest("button")!)
    await user.click(await screen.findByRole('option', { name: 'Junior Secondary 2' }))

    // Article body.
    const body = screen.getByPlaceholderText(/write your article content here/i)
    await user.type(body, 'Article body text.')

    const publish = screen.getByRole('button', { name: /publish content/i })
    await waitFor(() => expect((publish as HTMLButtonElement).disabled).toBe(false))
    await user.click(publish)

    await waitFor(() => expect(screen.getByText('My Content')).toBeInTheDocument())

    const created = Array.from(state.contents.values()).find((c) => c.title === 'New Article')
    expect(created).toBeDefined()
    expect(created!.status).toBe('published')
    expect(created!.subject).toBe('Math')
    expect(created!.grade_level).toBe('Junior Secondary 2')
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

    await user.click(screen.getByText(/pick a grade/i).closest("button")!)
    await user.click(await screen.findByRole('option', { name: 'Senior 4' }))

    await user.type(screen.getByPlaceholderText(/write your article content here/i), 'WIP')

    await user.click(screen.getByRole('button', { name: /save as draft/i }))

    await waitFor(() => expect(screen.getByText('My Content')).toBeInTheDocument())
    const created = Array.from(state.contents.values()).find((c) => c.title === 'Draft article')
    expect(created!.status).toBe('draft')
  })

  it('manages hashtags as add/remove chips', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UploadContent />, { authAs: teacherAuth() })

    const tagInput = screen.getByPlaceholderText(/type hashtag and press enter/i)
    await user.type(tagInput, 'Algebra{Enter}')
    await user.type(tagInput, 'Grade9{Enter}')

    expect(screen.getByText('#Algebra')).toBeInTheDocument()
    expect(screen.getByText('#Grade9')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /remove algebra/i }))

    expect(screen.queryByText('#Algebra')).not.toBeInTheDocument()
    expect(screen.getByText('#Grade9')).toBeInTheDocument()
  })
})
