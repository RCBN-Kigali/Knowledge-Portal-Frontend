import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useAuth } from '../../hooks/useAuth'
import { roleHome } from '../../routes/roleHome'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(formData.email, formData.password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from !== '/login' ? from : roleHome(user.role), { replace: true })
    } catch (err: any) {
      const msg = err?.message || 'Login failed'
      // Backend returns "Teacher account not approved" for pending teachers.
      if (msg.toLowerCase().includes('teacher') && msg.toLowerCase().includes('not approved')) {
        navigate('/teacher/pending', { replace: true })
        return
      }
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-4 hover:scale-105 transition-transform">
                <GraduationCap className="w-9 h-9" />
              </div>
            </Link>
            <h1 className="mb-2 text-2xl font-semibold">Welcome Back!</h1>
            <p className="text-muted-foreground">Log in to continue your learning journey</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Log In</h2>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12 bg-input-background border-border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 pr-11 h-12 bg-input-background border-border rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-60 mt-6"
              >
                <span className="text-lg">{isLoading ? 'Signing in...' : 'Log In'}</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
