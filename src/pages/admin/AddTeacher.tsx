import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shuffle, Copy, Check } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { adminApi, type TeacherPublic } from '../../api/admin'

const subjectOptions = [
  'Mathematics',
  'Science',
  'Biology',
  'Chemistry',
  'Physics',
  'English',
  'Literature',
  'Geography',
  'History',
  'Economics',
  'Computer Science',
  'Art',
]

const schools = ['Paysannat L A', 'Paysannat L B', 'Paysannat L C', 'Paysannat L D', 'Paysannat L E']

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let pass = ''
  for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
  return pass
}

export default function AddTeacher() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [school, setSchool] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [password, setPassword] = useState('')
  const [created, setCreated] = useState<TeacherPublic | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const createMut = useMutation({
    mutationFn: () =>
      adminApi.addTeacher({
        email: email.trim(),
        name: fullName.trim(),
        school,
        subjects,
        password_generated: false,
        password,
      }),
    onSuccess: (teacher) => {
      qc.invalidateQueries({ queryKey: ['admin'] })
      setCreated(teacher)
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : err?.message ?? 'Could not create teacher')
    },
  })

  const toggleSubject = (subject: string) => {
    setSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  const handleCreate = () => {
    setError('')
    if (!fullName.trim() || !email.trim() || !school || !password.trim() || subjects.length === 0) {
      setError('Please fill all fields and pick at least one subject.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    createMut.mutate()
  }

  const copyToClipboard = () => {
    if (!created) return
    const text = `Knowledge Portal Teacher Login\n\nEmail: ${created.email}\nPassword: ${password}\n`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <h2 className="text-xl font-semibold">Teacher Account Created</h2>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-center mb-6 font-semibold text-lg">Account Created Successfully</h3>

            <div className="bg-muted/50 border border-border rounded-2xl p-6 mb-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">{created.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email (Login)</p>
                <p className="font-medium break-all">{created.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Temporary Password</p>
                <p className="font-mono text-lg break-all">{password}</p>
              </div>
              {created.school && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">School</p>
                  <p className="font-medium">{created.school}</p>
                </div>
              )}
              {created.subjects && created.subjects.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Subjects</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {created.subjects.map((s) => (
                      <Badge key={s} variant="secondary" className="bg-primary/10 text-primary border-0">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all mb-3"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Credentials to Clipboard</span>
                </>
              )}
            </button>

            <p className="text-sm text-center text-muted-foreground mb-6">
              Share these credentials with the teacher. They should change their password after first login.
            </p>

            <button
              onClick={() => navigate('/admin/teachers')}
              className="w-full px-6 py-4 bg-card border border-border rounded-xl hover:bg-muted transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/admin/teachers" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Teachers</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="mb-8 text-2xl sm:text-3xl font-semibold">Add New Teacher</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Full Name</label>
            <Input
              type="text"
              placeholder="Enter teacher's full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-14 bg-input-background border-border text-base"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <Input
              type="email"
              placeholder="teacher@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 bg-input-background border-border text-base"
            />
            <p className="text-sm text-muted-foreground mt-2">This will be used for login</p>
          </div>

          <div>
            <label className="block mb-2 font-medium">School</label>
            <Select value={school} onValueChange={setSchool}>
              <SelectTrigger className="h-14 bg-input-background border-border">
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-3 font-medium">Subject/Specialty</label>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`px-4 py-2 rounded-xl border transition-all ${
                      subjects.includes(subject)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:bg-muted'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
            {subjects.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {subjects.length} subject{subjects.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Temporary Password</label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Click generate to create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 h-14 bg-input-background border-border text-base font-mono"
              />
              <button
                type="button"
                onClick={() => setPassword(generatePassword())}
                className="px-5 py-3 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-all flex items-center gap-2 flex-shrink-0"
              >
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Teacher should change this password after first login
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              !fullName.trim() || !email.trim() || !school || !password.trim() || subjects.length === 0 || createMut.isPending
            }
            className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {createMut.isPending ? 'Creating…' : 'Create Teacher Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
