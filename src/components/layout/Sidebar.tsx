import { NavLink } from 'react-router-dom'
import type { ComponentType } from 'react'
import {
  LayoutDashboard, BookOpen, FolderOpen, Users, Building2,
  BarChart3, Settings, ClipboardList, X,
  Megaphone, CheckSquare, UserPlus, TrendingUp
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../hooks/useAuth'

interface NavItem {
  name: string
  path: string
  icon: ComponentType<{ className?: string }>
  end?: boolean
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems: Record<string, NavItem[]> = {
  school_student: [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard, end: true },
    { name: 'Browse Courses', path: '/student/courses', icon: BookOpen },
    { name: 'My Enrollments', path: '/student/enrollments', icon: FolderOpen },
    { name: 'My Progress', path: '/student/progress', icon: TrendingUp },
    { name: 'Announcements', path: '/student/announcements', icon: Megaphone },
  ],
  school_teacher: [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard, end: true },
    { name: 'My Courses', path: '/teacher/courses', icon: BookOpen },
    { name: 'Students', path: '/teacher/students', icon: Users },
    { name: 'Submissions', path: '/teacher/submissions', icon: ClipboardList },
  ],
  independent_teacher: [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard, end: true },
    { name: 'My Courses', path: '/teacher/courses', icon: BookOpen },
    { name: 'Students', path: '/teacher/students', icon: Users },
    { name: 'Submissions', path: '/teacher/submissions', icon: ClipboardList },
  ],
  school_admin: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, end: true },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Course Approvals', path: '/admin/approvals', icon: CheckSquare },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ],
  super_admin: [
    { name: 'Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard, end: true },
    { name: 'Schools', path: '/superadmin/schools', icon: Building2 },
    { name: 'User Management', path: '/superadmin/users', icon: Users },
    { name: 'Independent Teachers', path: '/superadmin/teachers', icon: UserPlus },
    { name: 'Course Approvals', path: '/superadmin/approvals', icon: CheckSquare },
    { name: 'Announcements', path: '/superadmin/announcements', icon: Megaphone },
    { name: 'Analytics', path: '/superadmin/analytics', icon: BarChart3 },
  ],
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth()
  const role = user?.role || 'school_student'
  const navItems = navigationItems[role] || navigationItems.school_student

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {/* Settings at bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
