import { Outlet, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, UserCog, Megaphone, Settings, Clock, GraduationCap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../api/admin'

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/approvals', icon: Clock, label: 'Reviews', badgeKey: 'pending' as const },
  { path: '/admin/teachers', icon: UserCog, label: 'Teachers' },
  { path: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const location = useLocation()

  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.stats,
    refetchInterval: 60_000,
  })

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 lg:ml-64">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const badge = item.badgeKey === 'pending' ? stats?.pending_content ?? 0 : 0
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[64px] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs">{item.label}</span>
                {badge > 0 && (
                  <span className="absolute top-1 right-1 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="font-semibold">Knowledge Portal</h1>
          </Link>
          <p className="text-sm text-muted-foreground mb-8 ml-13">Admin Portal</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              const badge = item.badgeKey === 'pending' ? stats?.pending_content ?? 0 : 0
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 && (
                    <span className="bg-foreground text-background text-xs px-2 py-0.5 rounded-full min-w-[24px] text-center">
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </div>
  )
}
