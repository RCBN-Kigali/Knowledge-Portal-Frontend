import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button, Input, Card, Alert } from '../../components/ui'
import type { UserRole } from '../../types'

// Role-based default redirect paths
const ROLE_REDIRECTS: Record<UserRole, string> = {
  super_admin: '/superadmin/dashboard',
  school_admin: '/admin/dashboard',
  school_teacher: '/teacher/dashboard',
  independent_teacher: '/teacher/dashboard',
  school_student: '/dashboard',
}

// Check if a path is valid for a given role
function isPathValidForRole(path: string, role: UserRole): boolean {
  // If no specific path or it's the root, use default
  if (!path || path === '/') return false
  
  // Role-specific path prefixes
  const rolePathMap: Record<UserRole, string[]> = {
    super_admin: ['/superadmin'],
    school_admin: ['/admin'],
    school_teacher: ['/teacher'],
    independent_teacher: ['/teacher'],
    school_student: ['/dashboard', '/student'],
  }
  
  const validPrefixes = rolePathMap[role] || []
  return validPrefixes.some(prefix => path.startsWith(prefix))
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, error, clearError } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setIsSubmitting(true)

    try {
      const user = await login(formData.email, formData.password)
      
      // Only use 'from' path if it's valid for the user's role
      // Otherwise, use the role-based default
      let redirectPath = ROLE_REDIRECTS[user.role] || '/dashboard'
      
      if (from && isPathValidForRole(from, user.role)) {
        redirectPath = from
      }
      
      navigate(redirectPath, { replace: true })
    } catch {
      // Error handled by context
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) clearError()
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-1">Sign in to access your courses</p>
      </div>

      {error && (
        <Alert variant="error" dismissible onDismiss={clearError} className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@school.edu.rw"
          required
          disabled={isSubmitting}
        />

        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <p>
            Don't have an account? Contact your school administrator to get access.
          </p>
        </div>
      </div>
    </Card>
  )
}

export default Login
