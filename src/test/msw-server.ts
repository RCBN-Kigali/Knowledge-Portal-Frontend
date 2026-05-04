import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const API = 'http://test.local'

/**
 * Stateful in-memory backend for MSW. Tests can read/write this directly to set
 * up scenarios. Reset between tests via ``resetState`` in setup.
 */
export const state = {
  users: new Map<string, any>(),
  contents: new Map<string, any>(),
  comments: new Map<string, any[]>(), // keyed by contentId
  notifications: new Map<string, any[]>(), // keyed by userId
  announcements: [] as any[],
  pendingTeachers: [] as any[],
  // Track current user (the bearer token is the user id for simplicity).
  loggedInAs: null as string | null,
}

export function resetState() {
  state.users.clear()
  state.contents.clear()
  state.comments.clear()
  state.notifications.clear()
  state.announcements = []
  state.pendingTeachers = []
  state.loggedInAs = null
}

function userFromAuthHeader(req: Request): any | null {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const id = auth.slice(7)
  return state.users.get(id) ?? null
}

export const handlers = [
  // ─── Auth ────────────────────────────────────────────────────────────
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    const user = Array.from(state.users.values()).find((u) => u.email === body.email)
    if (!user || user.password !== body.password) {
      return HttpResponse.json({ detail: 'Invalid credentials' }, { status: 401 })
    }
    if (user.role === 'teacher' && user.approval_status !== 'approved') {
      return HttpResponse.json({ detail: 'Teacher account not approved' }, { status: 401 })
    }
    state.loggedInAs = user.id
    return HttpResponse.json({
      access_token: user.id,
      refresh_token: `refresh-${user.id}`,
      token_type: 'bearer',
      expires_in: 3600,
      user: publicUser(user),
    })
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as any
    if (Array.from(state.users.values()).some((u) => u.email === body.email)) {
      return HttpResponse.json({ detail: 'Email already registered' }, { status: 400 })
    }
    const user = {
      id: `user-${state.users.size + 1}`,
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role,
      school: body.school ?? null,
      subjects: body.subjects ?? null,
      is_active: body.role !== 'teacher',
      approval_status: body.role === 'teacher' ? 'pending' : null,
      created_at: new Date().toISOString(),
    }
    state.users.set(user.id, user)
    if (user.role === 'teacher') state.pendingTeachers.push(user)
    return HttpResponse.json(publicUser(user), { status: 201 })
  }),

  http.get(`${API}/auth/me`, ({ request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    return HttpResponse.json(publicUser(me))
  }),

  http.post(`${API}/auth/logout`, () => HttpResponse.json({ ok: true })),

  // ─── Discovery ───────────────────────────────────────────────────────
  http.get(`${API}/discover/feed`, ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const limit = Number(url.searchParams.get('limit') ?? 20)
    let items = Array.from(state.contents.values()).filter((c) => c.status === 'published')
    if (category) items = items.filter((c) => c.subject === category)
    return HttpResponse.json({
      page: 1,
      limit,
      total: items.length,
      items: items.slice(0, limit),
    })
  }),

  http.get(`${API}/categories`, () =>
    HttpResponse.json({ categories: ['Science', 'Math', 'English', 'History', 'Career'] })
  ),

  http.get(`${API}/trending`, () =>
    HttpResponse.json({
      trending_searches: ['photosynthesis', 'algebra'],
      trending_content: Array.from(state.contents.values()).slice(0, 3),
    })
  ),

  http.get(`${API}/search`, ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').toLowerCase()
    const items = Array.from(state.contents.values()).filter(
      (c) =>
        c.status === 'published' &&
        (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    )
    return HttpResponse.json({
      page: 1,
      limit: 20,
      total: items.length,
      items,
    })
  }),

  http.get(`${API}/explore`, () =>
    HttpResponse.json({ page: 1, limit: 20, total: 0, items: [] })
  ),

  // ─── Content + engagement + comments ─────────────────────────────────
  http.get(`${API}/content/:id`, ({ params }) => {
    const c = state.contents.get(params.id as string)
    if (!c || c.status !== 'published') {
      return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    }
    c.views_count = (c.views_count ?? 0) + 1
    return HttpResponse.json(c)
  }),

  http.post(`${API}/content/:id/like`, ({ params, request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    const c = state.contents.get(params.id as string)
    if (!c) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    c.user_vote = c.user_vote === 'like' ? null : 'like'
    c.likes_count = c.user_vote === 'like' ? (c.likes_count ?? 0) + 1 : Math.max(0, (c.likes_count ?? 0) - 1)
    if (c.user_vote === 'like' && c.dislikes_count > 0 && c._priorVote === 'dislike') {
      c.dislikes_count -= 1
    }
    return HttpResponse.json({
      content_id: c.id,
      likes_count: c.likes_count,
      dislikes_count: c.dislikes_count,
      user_vote: c.user_vote,
    })
  }),

  http.post(`${API}/content/:id/dislike`, ({ params, request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    const c = state.contents.get(params.id as string)
    if (!c) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    c.user_vote = c.user_vote === 'dislike' ? null : 'dislike'
    c.dislikes_count = c.user_vote === 'dislike' ? (c.dislikes_count ?? 0) + 1 : Math.max(0, (c.dislikes_count ?? 0) - 1)
    return HttpResponse.json({
      content_id: c.id,
      likes_count: c.likes_count ?? 0,
      dislikes_count: c.dislikes_count,
      user_vote: c.user_vote,
    })
  }),

  http.get(`${API}/content/:id/engagement`, ({ params, request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    const c = state.contents.get(params.id as string)
    if (!c) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    return HttpResponse.json({
      content_id: c.id,
      likes_count: c.likes_count ?? 0,
      dislikes_count: c.dislikes_count ?? 0,
      user_vote: c.user_vote ?? null,
    })
  }),

  http.get(`${API}/content/:id/comments`, ({ params }) => {
    const items = state.comments.get(params.id as string) ?? []
    return HttpResponse.json({
      page: 1,
      limit: items.length,
      total: items.length,
      items,
    })
  }),

  http.post(`${API}/content/:id/comments`, async ({ params, request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    const body = (await request.json()) as { text: string }
    const cid = params.id as string
    const list = state.comments.get(cid) ?? []
    const comment = {
      id: `comment-${list.length + 1}`,
      content_id: cid,
      user_id: me.id,
      user_name: me.name,
      user_role: me.role,
      text: body.text,
      parent_comment_id: null,
      is_unread: true,
      created_at: new Date().toISOString(),
    }
    list.push(comment)
    state.comments.set(cid, list)
    return HttpResponse.json(comment, { status: 201 })
  }),

  // ─── Announcements ───────────────────────────────────────────────────
  http.get(`${API}/announcements`, () =>
    HttpResponse.json({
      page: 1,
      limit: state.announcements.length,
      total: state.announcements.length,
      items: state.announcements,
    })
  ),

  // ─── Notifications ───────────────────────────────────────────────────
  http.get(`${API}/notifications`, ({ request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    const items = state.notifications.get(me.id) ?? []
    return HttpResponse.json({
      unread_count: items.filter((n) => !n.is_read).length,
      total: items.length,
      items,
    })
  }),

  http.get(`${API}/notifications/unread-count`, ({ request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ unread_count: 0 })
    const items = state.notifications.get(me.id) ?? []
    return HttpResponse.json({ unread_count: items.filter((n) => !n.is_read).length })
  }),

  // ─── Teacher content ─────────────────────────────────────────────────
  http.get(`${API}/teachers/content`, ({ request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    if (me.role !== 'teacher') return HttpResponse.json({ detail: 'Forbidden' }, { status: 403 })
    return HttpResponse.json(
      Array.from(state.contents.values()).filter((c) => c.teacher_id === me.id)
    )
  }),

  http.post(`${API}/teachers/content`, async ({ request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    if (me.role !== 'teacher') return HttpResponse.json({ detail: 'Forbidden' }, { status: 403 })
    const fd = await request.formData()
    const id = `content-${state.contents.size + 1}`
    const item = {
      id,
      title: fd.get('title') as string,
      description: (fd.get('description') as string) ?? '',
      content_type: fd.get('content_type') as string,
      file_url: null,
      teacher_id: me.id,
      subject: fd.get('subject') as string,
      grade_level: fd.get('grade_level') as string,
      duration_minutes: null,
      hashtags: ((fd.get('hashtags') as string) ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      external_links: JSON.parse((fd.get('external_links') as string) ?? '[]'),
      status: fd.get('publish') === 'true' ? 'published' : 'draft',
      views_count: 0,
      likes_count: 0,
      dislikes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    state.contents.set(id, item)
    return HttpResponse.json(item, { status: 201 })
  }),

  // ─── Admin ───────────────────────────────────────────────────────────
  http.get(`${API}/admin/stats`, ({ request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    if (me.role !== 'admin') return HttpResponse.json({ detail: 'Forbidden' }, { status: 403 })
    const teachers = Array.from(state.users.values()).filter((u) => u.role === 'teacher')
    const students = Array.from(state.users.values()).filter((u) => u.role === 'student')
    const content = Array.from(state.contents.values())
    return HttpResponse.json({
      pending_approvals: teachers.filter((t) => t.approval_status === 'pending').length,
      total_teachers: teachers.length,
      active_teachers: teachers.filter((t) => t.is_active && t.approval_status === 'approved').length,
      total_students: students.length,
      total_content: content.length,
      published_content: content.filter((c) => c.status === 'published').length,
      draft_content: content.filter((c) => c.status === 'draft').length,
    })
  }),

  http.get(`${API}/admin/approvals`, ({ request }) => {
    const me = userFromAuthHeader(request)
    if (!me) return HttpResponse.json({ detail: 'Unauthenticated' }, { status: 401 })
    if (me.role !== 'admin') return HttpResponse.json({ detail: 'Forbidden' }, { status: 403 })
    const pending = Array.from(state.users.values()).filter(
      (u) => u.role === 'teacher' && u.approval_status === 'pending'
    )
    return HttpResponse.json({ total: pending.length, pending: pending.map(publicUser) })
  }),

  http.post(`${API}/admin/approvals/:id/approve`, ({ params }) => {
    const u = state.users.get(params.id as string)
    if (!u) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    u.approval_status = 'approved'
    u.is_active = true
    return HttpResponse.json(publicUser(u))
  }),

  http.post(`${API}/admin/approvals/:id/reject`, ({ params }) => {
    const u = state.users.get(params.id as string)
    if (!u) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    u.approval_status = 'rejected'
    u.is_active = false
    return HttpResponse.json(publicUser(u))
  }),

  http.get(`${API}/admin/teachers`, ({ request }) => {
    const teachers = Array.from(state.users.values())
      .filter((u) => u.role === 'teacher')
      .map(publicUser)
    return HttpResponse.json(teachers)
  }),
]

function publicUser(u: any) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    is_active: u.is_active,
    school: u.school ?? null,
    subjects: u.subjects ?? null,
    approval_status: u.approval_status ?? null,
    created_at: u.created_at,
  }
}

export const server = setupServer(...handlers)

// ─── Builders ────────────────────────────────────────────────────────────

export function seedUser(overrides: Partial<any> = {}) {
  const id = overrides.id ?? `user-${state.users.size + 1}`
  const user = {
    id,
    email: overrides.email ?? `${id}@portal.example`,
    password: overrides.password ?? 'password123',
    name: overrides.name ?? 'Test User',
    role: overrides.role ?? 'student',
    school: overrides.school ?? null,
    subjects: overrides.subjects ?? null,
    is_active: overrides.is_active ?? true,
    approval_status: overrides.approval_status ?? (overrides.role === 'teacher' ? 'approved' : null),
    created_at: overrides.created_at ?? new Date().toISOString(),
  }
  state.users.set(id, user)
  return user
}

export function seedContent(overrides: Partial<any> = {}) {
  const id = overrides.id ?? `content-${state.contents.size + 1}`
  const c = {
    id,
    title: overrides.title ?? 'Sample lesson',
    description: overrides.description ?? 'Description body.',
    content_type: overrides.content_type ?? 'article',
    file_url: overrides.file_url ?? null,
    teacher_id: overrides.teacher_id ?? 'user-1',
    subject: overrides.subject ?? 'Science',
    grade_level: overrides.grade_level ?? 'Grade 9',
    duration_minutes: overrides.duration_minutes ?? null,
    hashtags: overrides.hashtags ?? ['Test'],
    external_links: overrides.external_links ?? [],
    status: overrides.status ?? 'published',
    views_count: overrides.views_count ?? 0,
    likes_count: overrides.likes_count ?? 0,
    dislikes_count: overrides.dislikes_count ?? 0,
    comments_count: overrides.comments_count ?? 0,
    created_at: overrides.created_at ?? new Date().toISOString(),
    updated_at: overrides.updated_at ?? new Date().toISOString(),
  }
  state.contents.set(id, c)
  return c
}
