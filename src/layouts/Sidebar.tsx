import { NavLink, useNavigate } from 'react-router-dom'
import type { ComponentType } from 'react'
import {
  LayoutDashboard, BookOpen, Users, School, Settings, BarChart3,
  FileText, CheckSquare, GraduationCap, UserPlus, Bell, BookMarked, X, LogOut
} from 'lucide-react'
import clsx from 'clsx'
import { Avatar, Button } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import type { UserRole } from '../types'

interface NavItem {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
  roles: UserRole[]
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'school_admin', 'school_teacher', 'school_student', 'independent_teacher'] },
    ],
  },
  {
    title: 'Learning',
    items: [
      { label: 'Browse Courses', to: '/student/courses', icon: BookOpen, roles: ['school_student'] },
      { label: 'My Enrollments', to: '/student/enrollments', icon: GraduationCap, roles: ['school_student'] },
      { label: 'My Progress', to: '/student/progress', icon: BarChart3, roles: ['school_student'] },
      { label: 'Announcements', to: '/student/announcements', icon: Bell, roles: ['school_student'] },
    ],
  },
  {
    title: 'Teaching',
    items: [
      { label: 'My Courses', to: '/teacher/courses', icon: BookOpen, roles: ['school_teacher', 'independent_teacher'] },
      { label: 'Create Course', to: '/teacher/courses/new', icon: FileText, roles: ['school_teacher', 'independent_teacher'] },
      { label: 'My Students', to: '/teacher/students', icon: Users, roles: ['school_teacher', 'independent_teacher'] },
      { label: 'Submissions', to: '/teacher/submissions', icon: CheckSquare, roles: ['school_teacher', 'independent_teacher'] },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'User Management', to: '/admin/users', icon: Users, roles: ['school_admin'] },
      { label: 'Course Approvals', to: '/admin/courses', icon: CheckSquare, roles: ['school_admin'] },
      { label: 'School Settings', to: '/admin/settings', icon: Settings, roles: ['school_admin'] },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'All Schools', to: '/superadmin/schools', icon: School, roles: ['super_admin'] },
      { label: 'All Users', to: '/superadmin/users', icon: Users, roles: ['super_admin'] },
      { label: 'Analytics', to: '/superadmin/analytics', icon: BarChart3, roles: ['super_admin'] },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const { hasRole } = usePermissions()
  const navigate = useNavigate()

  const filteredNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasRole(item.roles)),
    }))
    .filter((section) => section.items.length > 0)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col transform transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Logo & Close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Knowledge Portal</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {filteredNavigation.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
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
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.schoolName || user?.role.replace(/_/g, ' ')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="justify-start text-gray-600 hover:text-danger-600 hover:bg-danger-50"
          >
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
