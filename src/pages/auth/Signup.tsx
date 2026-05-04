import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, School, GraduationCap, Lock, Eye, EyeOff, Mail } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { useAuth } from '../../hooks/useAuth'

const schools = [
  'Paysannat L A',
  'Paysannat L B',
  'Paysannat L C',
  'Paysannat L D',
  'Paysannat L E',
]

const grades = [
  { value: 'primary-1', label: 'Primary 1' },
  { value: 'primary-2', label: 'Primary 2' },
  { value: 'primary-3', label: 'Primary 3' },
  { value: 'primary-4', label: 'Primary 4' },
  { value: 'primary-5', label: 'Primary 5' },
  { value: 'primary-6', label: 'Primary 6' },
  { value: 'primary-7', label: 'Primary 7' },
  { value: 'junior-1', label: 'Junior Secondary 1' },
  { value: 'junior-2', label: 'Junior Secondary 2' },
  { value: 'junior-3', label: 'Junior Secondary 3' },
  { value: 'senior-1', label: 'Senior Secondary 1' },
  { value: 'senior-2', label: 'Senior Secondary 2' },
  { value: 'senior-3', label: 'Senior Secondary 3' },
  { value: 'senior-4', label: 'Senior 4' },
  { value: 'senior-5', label: 'Senior 5' },
  { value: 'senior-6', label: 'Senior 6' },
]

export default function Signup() {
  const navigate = useNavigate()
  const { register, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    grade: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'student',
        school: formData.school || null,
        subjects: null,
      })
      await login(formData.email, formData.password)
      navigate('/student', { replace: true })
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
            <h1 className="mb-2 text-2xl font-semibold">Join Knowledge Portal</h1>
            <p className="text-muted-foreground">Create your free student account</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Create Student Account</h2>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12 bg-input-background border-border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                  <Select
                    value={formData.school}
                    onValueChange={(value) => setFormData({ ...formData, school: value })}
                  >
                    <SelectTrigger className="pl-11 h-12 bg-input-background border-border rounded-xl">
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade / Class</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })}
                  >
                    <SelectTrigger className="pl-11 h-12 bg-input-background border-border rounded-xl">
                      <SelectValue placeholder="Select your grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
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
                <p className="text-xs text-muted-foreground mt-1">Use at least 8 characters</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-60 mt-6"
              >
                <span className="text-lg">
                  {submitting ? 'Creating account…' : 'Join Now'}
                </span>
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

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Are you a teacher? Teacher accounts are created by your school
                administrator. Please contact them for access.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By joining, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  )
}
