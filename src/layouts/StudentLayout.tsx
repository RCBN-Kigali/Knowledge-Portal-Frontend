import { Outlet, useLocation, Link } from 'react-router-dom'
import { Home, Search, Bell, User, BookOpen, Library, Compass } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '../api/notifications'

const navItems = [
  { path: '/student', icon: Home, label: 'Home', exact: true },
  { path: '/student/search', icon: Search, label: 'Search' },
  { path: '/student/explore', icon: Compass, label: 'Explore' },
  { path: '/student/library', icon: Library, label: 'Library' },
  { path: '/student/my-learning', icon: BookOpen, label: 'Learning' },
  { path: '/student/notifications', icon: Bell, label: 'Notifications', badgeKey: 'unread' as const },
  { path: '/student/profile', icon: User, label: 'Profile' },
]

const bottomNavItems = navItems.filter((i) => ['/student', '/student/search', '/student/notifications', '/student/profile'].includes(i.path))

export default function StudentLayout() {
  const location = useLocation()

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 60_000,
  })

  const isActive = (path: string, exact?: boolean) => exact ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            const badge = item.badgeKey === 'unread' ? unreadCount ?? 0 : 0
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[64px] transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 mb-1 ${active ? 'fill-current' : ''}`} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
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

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
        <div className="p-6">
          <h1 className="font-semibold text-2xl">LearnHub</h1>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            const badge = item.badgeKey === 'unread' ? unreadCount ?? 0 : 0
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                      {badge}
                    </span>
                  )}
                </div>
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </div>
  )
}
