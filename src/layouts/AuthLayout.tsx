import { Outlet } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Knowledge Portal</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Paysannat L School. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout
