import { Link } from 'react-router-dom'
import { Megaphone, Bell, LogOut, Mail } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'

export default function Profile() {
  const { user, logout } = useAuth()
  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground capitalize mt-1">{user.role}</p>
          </div>
        </div>

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

        <Button variant="outline" className="w-full" onClick={() => logout()}>
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </div>
    </div>
  )
}
