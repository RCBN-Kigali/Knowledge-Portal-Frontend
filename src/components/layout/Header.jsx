import { useState } from 'react'
import PropTypes from 'prop-types'
import { Menu, Bell, LogOut, User, Lock, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Dropdown, Badge } from '../ui'
import useAuthStore from '../../stores/authStore'

export function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'primary',
      teacher: 'success',
      student: 'gray',
    }
    return variants[role] || 'gray'
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">
              Knowledge Portal
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications - hidden for now */}
          {/* <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
          </button> */}

          {/* User menu */}
          <Dropdown>
            <Dropdown.Trigger className="flex items-center gap-3 pl-3 pr-2 py-1.5 hover:bg-gray-50 rounded-lg border-0 bg-transparent">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Avatar name={user?.full_name} src={user?.profile_image} size="sm" />
            </Dropdown.Trigger>

            <Dropdown.Menu align="right" className="w-56">
              {/* User info on mobile */}
              <div className="px-4 py-3 border-b border-gray-200 sm:hidden">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <Badge variant={getRoleBadge(user?.role)} size="sm" className="mt-1 capitalize">
                  {user?.role}
                </Badge>
              </div>

              <Dropdown.Item onClick={() => navigate('/profile')} icon={<User className="w-4 h-4" />}>
                My Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/change-password')} icon={<Lock className="w-4 h-4" />}>
                Change Password
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} icon={<LogOut className="w-4 h-4" />} className="text-danger-600 hover:bg-danger-50">
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
}

export default Header
