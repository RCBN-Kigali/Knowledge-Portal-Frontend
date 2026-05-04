import { Outlet, useLocation, Link } from 'react-router-dom'
import { Home, Search, Bell, User, GraduationCap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '../api/notifications'

const navItems = [
  { path: '/student', icon: Home, label: 'Home' },
  { path: '/student/search', icon: Search, label: 'Search' },
  { path: '/student/notifications', icon: Bell, label: 'Notifications', badgeKey: 'unread' as const },
  { path: '/student/profile', icon: User, label: 'Profile' },
]

export default function StudentLayout() {
  const location = useLocation()

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 60_000,
  })

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 lg:ml-64">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const badge = item.badgeKey === 'unread' ? unreadCount ?? 0 : 0
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[64px] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                      {badge}
                    </span>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
        <div className="p-6">
          <Link to="/student" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-semibold">Knowledge Portal</h1>
              <p className="text-xs text-muted-foreground">GS Paysannat L</p>
            </div>
          </Link>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              const badge = item.badgeKey === 'unread' ? unreadCount ?? 0 : 0
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="flex-1">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </div>
  )
}
