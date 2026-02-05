import { Menu, Bell, Search } from 'lucide-react'
import { Avatar } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

interface HeaderProps {
  onMenuToggle: () => void
}

function Header({ onMenuToggle }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Search (desktop) */}
      <div className="hidden lg:flex flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* Mobile search button */}
        <button className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
          <Search className="w-5 h-5" />
        </button>

        {/* Avatar (visible only on mobile, hidden on desktop since it's in sidebar) */}
        <div className="lg:hidden">
          <Avatar name={user?.name || 'User'} size="sm" />
        </div>
      </div>
    </header>
  )
}

export default Header
