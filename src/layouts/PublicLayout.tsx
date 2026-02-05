import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'
import { Button } from '../components/ui'
import Footer from './Footer'

function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Courses', to: '/courses' },
    { label: 'About', to: '/about' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Knowledge Portal</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-600 hover:text-primary-600 font-medium text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop auth button */}
            <div className="hidden md:flex items-center">
              <Link to="/login">
                <Button variant="primary">Login</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Login</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PublicLayout
