import { NavLink } from 'react-router-dom'
import { 
  Home, BookOpen, BarChart3, Bell, MoreHorizontal,
  ClipboardList, Users, CheckCircle
} from 'lucide-react'
import clsx from 'clsx'
import useAuthStore from '../../stores/authStore'

const studentNav = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/my-courses', icon: BookOpen, label: 'Courses' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/announcements', icon: Bell, label: 'Alerts' },
]

const teacherNav = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/my-courses', icon: BookOpen, label: 'Courses' },
  { to: '/grading', icon: ClipboardList, label: 'Grading' },
  { to: '/students', icon: Users, label: 'Students' },
]

const adminNav = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/admin/reviews', icon: CheckCircle, label: 'Reviews' },
]

export function MobileNav() {
  const { user } = useAuthStore()

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminNav
      case 'teacher':
        return teacherNav
      default:
        return studentNav
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center flex-1 h-full py-2 px-1',
                'text-xs font-medium transition-colors',
                'min-w-[64px]',
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={clsx('w-6 h-6 mb-1', isActive && 'text-primary-600')} />
                <span className="truncate max-w-full">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
