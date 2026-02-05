import { NavLink } from 'react-router-dom'
import type { ComponentType } from 'react'
import { LayoutDashboard, BookOpen, FileText, User } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../hooks/useAuth'

interface MobileNavItem {
  name: string
  path: string
  icon: ComponentType<{ className?: string }>
}

const mobileNavItems: Record<string, MobileNavItem[]> = {
  student: [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Tasks', path: '/assignments', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ],
  teacher: [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Tasks', path: '/assignments', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ],
  admin: [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Users', path: '/users', icon: User },
    { name: 'Profile', path: '/profile', icon: User },
  ],
}

function MobileNav() {
  const { user } = useAuth()
  const role = user?.role || 'student'
  const navItems = mobileNavItems[role] || mobileNavItems.student

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px]',
                isActive ? 'text-primary-600' : 'text-gray-500'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
