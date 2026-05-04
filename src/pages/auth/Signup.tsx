import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User as UserIcon, GraduationCap, Lock, Eye, EyeOff, Mail, BookOpen, UserCog } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types'

export default function Signup() {
  const navigate = useNavigate()
  const { register, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState<Exclude<UserRole, 'admin'>>('student')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(formData.email, formData.password, formData.name, accountType)
      if (accountType === 'student') {
        await login(formData.email, formData.password)
        navigate('/student', { replace: true })
      } else {
        // Teachers are created in 'pending' status; backend rejects login until approval.
        navigate('/teacher/pending', { replace: true })
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
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
            <h1 className="mb-2 text-2xl font-semibold">Create Your Account</h1>
            <p className="text-muted-foreground">Join the learning community</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setAccountType('student')}
                className={`p-4 rounded-xl border transition-all ${
                  accountType === 'student'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                <BookOpen className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Student</div>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('teacher')}
                className={`p-4 rounded-xl border transition-all ${
                  accountType === 'teacher'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                <UserCog className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Teacher</div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-11 h-12 bg-input-background border-border rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 pr-11 h-12 bg-input-background border-border rounded-xl"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-60 mt-6"
              >
                <span className="text-lg">{submitting ? 'Creating account...' : 'Create Account'}</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
