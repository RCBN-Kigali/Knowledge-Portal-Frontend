import { Outlet, useLocation, Link } from 'react-router-dom'
import { FileText, Upload, MessageCircle, User, GraduationCap } from 'lucide-react'

const navItems = [
  { path: '/teacher/dashboard', icon: FileText, label: 'My Content' },
  { path: '/teacher/upload', icon: Upload, label: 'Upload' },
  { path: '/teacher/comments', icon: MessageCircle, label: 'Comments' },
  { path: '/teacher/profile', icon: User, label: 'Profile' },
]

export default function TeacherLayout() {
  const location = useLocation()

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
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[64px] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
        <div className="p-6">
          <Link to="/teacher/dashboard" className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="font-semibold">Knowledge Portal</h1>
          </Link>
          <p className="text-sm text-muted-foreground mb-8 ml-13">Teacher Portal</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </div>
  )
}
