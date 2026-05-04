import { Link } from 'react-router-dom'
import { User, Mail, Calendar, MapPin, BookOpen, Award, Settings, ChevronRight, LogOut } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '../../components/ui/badge'
import { useAuth } from '../../hooks/useAuth'

const stats = [
  { label: 'Lessons Watched', value: '0', icon: BookOpen },
  { label: 'Achievements', value: '0', icon: Award },
  { label: 'Study Hours', value: '0', icon: Calendar },
]

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Profile() {
  const { user, logout } = useAuth()
  if (!user) return null

  const joinedDate = format(new Date(user.created_at), 'MMMM yyyy')

  const menuItems = [
    { icon: BookOpen, label: 'My Learning', action: 'learning', link: '/student/my-learning' as const, danger: false },
    { icon: Settings, label: 'Account Settings', action: 'settings', link: undefined, danger: false },
    { icon: User, label: 'Edit Profile', action: 'edit', link: undefined, danger: false },
    { icon: Award, label: 'My Achievements', action: 'achievements', link: undefined, danger: false },
  ]

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-primary-foreground text-primary flex items-center justify-center text-3xl font-semibold flex-shrink-0">
              {initialsOf(user.name)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="mb-2 text-2xl sm:text-3xl font-semibold">{user.name}</h1>
              <div className="space-y-2 text-primary-foreground/90">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.school && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user.school}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 capitalize">{user.role}</Badge>
            {user.school && (
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">{user.school}</Badge>
            )}
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">Joined {joinedDate}</Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-4 sm:p-6 text-center"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-primary" />
                <div className="text-xl sm:text-2xl font-semibold mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Learning Preferences */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="mb-4 font-semibold text-lg">Learning Preferences</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Daily Goal</span>
                <span className="text-sm text-muted-foreground">30 minutes</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Preferred Learning Time</span>
                <span className="text-sm text-muted-foreground">Afternoon</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Language</span>
                <span className="text-sm text-muted-foreground">English</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="mb-4 font-semibold text-lg">Recent Achievements</h3>
          <div className="space-y-3">
            {[
              { icon: '🔥', title: 'Week Warrior', date: 'Today' },
              { icon: '🎯', title: 'Perfect Score', date: '3 days ago' },
              { icon: '⚡', title: 'Speed Reader', date: '1 week ago' },
            ].map((a, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="text-2xl">{a.icon}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{a.title}</h4>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            const isLast = idx === menuItems.length - 1
            const className = `w-full flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50 ${
              isLast ? '' : 'border-b border-border'
            }`
            const Inner = (
              <>
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </>
            )
            return item.link ? (
              <Link key={item.action} to={item.link} className={className}>
                {Inner}
              </Link>
            ) : (
              <button key={item.action} className={className}>
                {Inner}
              </button>
            )
          })}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-4 px-6 py-4 transition-colors text-destructive hover:bg-destructive/5 border-t border-border"
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1 text-left">Log Out</span>
            <ChevronRight className="w-5 h-5 text-destructive/60" />
          </button>
        </div>
      </div>
    </div>
  )
}
