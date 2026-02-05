import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Checkbox from '../../../components/ui/Checkbox'
import type { UserRole } from '../../../types'
import type { School } from '../hooks/useSchools'
import { Copy, Check } from 'lucide-react'

export interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; email: string; role: UserRole; schoolId?: string; sendWelcomeEmail: boolean }) => Promise<{ tempPassword: string }>
  schools?: School[]
  isSuperAdmin?: boolean
  defaultSchoolId?: string
  loading?: boolean
}

function AddUserModal({ isOpen, onClose, onSubmit, schools = [], isSuperAdmin = false, defaultSchoolId, loading }: AddUserModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('school_student')
  const [schoolId, setSchoolId] = useState(defaultSchoolId || '')
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
  const [tempPassword, setTempPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')

  const roleOptions = isSuperAdmin
    ? [
        { value: 'school_student', label: 'Student' },
        { value: 'school_teacher', label: 'Teacher' },
        { value: 'school_admin', label: 'School Admin' },
        { value: 'independent_teacher', label: 'Independent Teacher' },
      ]
    : [
        { value: 'school_student', label: 'Student' },
        { value: 'school_teacher', label: 'Teacher' },
      ]

  const schoolOptions = [
    { value: '', label: 'Select school...' },
    ...schools.map(s => ({ value: s.id, label: s.name })),
  ]

  const needsSchool = role !== 'independent_teacher' && role !== 'super_admin'

  const handleSubmit = async () => {
    const result = await onSubmit({
      name,
      email,
      role,
      schoolId: needsSchool ? (schoolId || defaultSchoolId) : undefined,
      sendWelcomeEmail,
    })
    setTempPassword(result.tempPassword)
    setStep('success')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setRole('school_student')
    setSchoolId(defaultSchoolId || '')
    setSendWelcomeEmail(true)
    setTempPassword('')
    setStep('form')
    onClose()
  }

  const isValid = name.trim() && email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    (!needsSchool || schoolId || defaultSchoolId)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={step === 'form' ? 'Add New User' : 'User Created'}>
      {step === 'form' ? (
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
          <Select
            label="Role"
            value={role}
            onChange={(val) => setRole(val as UserRole)}
            options={roleOptions}
          />
          {isSuperAdmin && needsSchool && (
            <Select
              label="School"
              value={schoolId}
              onChange={setSchoolId}
              options={schoolOptions}
              required
            />
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={sendWelcomeEmail}
              onChange={(e) => setSendWelcomeEmail(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Send welcome email with login credentials</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!isValid} loading={loading}>
              Create User
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-success-50 text-success-700 p-4 rounded-lg">
            <p className="font-medium">User created successfully!</p>
            <p className="text-sm mt-1">{name} ({email})</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <div className="flex gap-2">
              <Input value={tempPassword} readOnly className="font-mono" />
              <Button variant="secondary" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {sendWelcomeEmail
                ? "This password has been sent to the user's email."
                : 'Share this password securely with the user.'}
            </p>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default AddUserModal
