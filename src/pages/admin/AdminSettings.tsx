import { User, LogOut, Bell, Shield } from 'lucide-react'
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

export default function AdminSettings() {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-xl font-semibold flex-shrink-0">
              {initialsOf(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="mb-1 font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <h3 className="px-6 py-4 border-b border-border font-semibold">Admin Settings</h3>
          <div className="divide-y divide-border">
            <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors text-left">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <span>Profile Settings</span>
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
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span>Security Settings</span>
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
