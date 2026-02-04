import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  X, BookOpen, Search, BarChart3, Bell, 
  PlusCircle, ClipboardList, Users, 
  LayoutDashboard, Building2, CheckCircle 
} from 'lucide-react'
import clsx from 'clsx'
import useAuthStore from '../../stores/authStore'

const studentNav = [
  { to: '/my-courses', icon: BookOpen, label: 'My Courses' },
  { to: '/courses', icon: Search, label: 'Browse Courses' },
  { to: '/progress', icon: BarChart3, label: 'My Progress' },
  { to: '/announcements', icon: Bell, label: 'Announcements' },
]

const teacherNav = [
  { to: '/my-courses', icon: BookOpen, label: 'My Courses' },
  { to: '/courses/new', icon: PlusCircle, label: 'Create Course' },
  { to: '/grading', icon: ClipboardList, label: 'Grading' },
  { to: '/students', icon: Users, label: 'My Students' },
  { to: '/announcements', icon: Bell, label: 'Announcements' },
]

const adminNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/schools', icon: Building2, label: 'Schools' },
  { to: '/courses', icon: BookOpen, label: 'All Courses' },
  { to: '/admin/reviews', icon: CheckCircle, label: 'Review Courses' },
  { to: '/announcements', icon: Bell, label: 'Announcements' },
]

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { user } = useAuthStore()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [location.pathname])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <span className="font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)] lg:h-full lg:pt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  'min-h-[44px]',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* School info at bottom */}
        {user?.school_name && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">School</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user.school_name}</p>
          </div>
        )}
      </aside>
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Sidebar
