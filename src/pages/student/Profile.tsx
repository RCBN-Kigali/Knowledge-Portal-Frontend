import { Mail, MapPin, Bell, Megaphone, LogOut, Settings, User as UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Badge } from '../../components/ui/badge'
import { useAuth } from '../../hooks/useAuth'

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

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary-foreground text-primary flex items-center justify-center text-2xl font-semibold flex-shrink-0">
              {initialsOf(user.name)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="mb-2 text-2xl font-semibold">{user.name}</h1>
              <div className="space-y-2 text-primary-foreground/90">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm break-all">{user.email}</span>
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
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">Joined {joinedDate}</Badge>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          <Link to="/student/announcements" className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">Announcements</p>
              <p className="text-sm text-muted-foreground">School-wide news</p>
            </div>
          </Link>
          <Link to="/student/notifications" className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">Replies and updates</p>
            </div>
          </Link>
        </div>

        {/* Settings */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <h3 className="px-6 py-4 border-b border-border font-semibold">Settings</h3>
          <div className="divide-y divide-border">
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors text-left">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                <span>Edit Profile</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors text-left">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span>Account Settings</span>
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
