import { LogOut, Bell, HelpCircle, Settings } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { teacherContentApi } from '../../api/teacherContent'
import { format } from 'date-fns'

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TeacherProfile() {
  const { user, logout } = useAuth()
  const { data: content } = useQuery({
    queryKey: ['teacher-content', 'list'],
    queryFn: () => teacherContentApi.list({ limit: 200 }),
    enabled: !!user,
  })

  if (!user) return null

  const published = content?.filter((c) => c.status === 'published') ?? []
  const totalViews = published.reduce((s, c) => s + c.views_count, 0)
  const totalLikes = published.reduce((s, c) => s + c.likes_count, 0)
  const totalComments = published.reduce((s, c) => s + c.comments_count, 0)
  const subjectsLabel = (user.subjects?.length ?? 0) > 0 ? user.subjects!.join(', ') + ' Teacher' : 'Teacher'

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-2xl font-semibold flex-shrink-0">
              {initialsOf(user.name)}
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{subjectsLabel}</p>
              <p className="text-xs text-muted-foreground">
                Joined {format(new Date(user.created_at), 'MMMM yyyy')} · {published.length} published lesson{published.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-semibold mb-1">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold mb-1">{totalLikes.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Likes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold mb-1">{totalComments.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <h3 className="px-6 py-4 border-b border-border font-semibold">Settings</h3>
          <div className="divide-y divide-border">
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors text-left">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span>Account Settings</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors text-left">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span>Notification Preferences</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors text-left">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span>Help & Support</span>
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-card border border-border text-foreground rounded-2xl hover:bg-muted transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )
}
