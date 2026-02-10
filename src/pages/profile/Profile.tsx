import { useState, type FormEvent } from 'react'
import { User, Lock, Mail, Building2, Shield } from 'lucide-react'
import { Card, Input, Button, Avatar, Badge, Alert } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'

const ROLE_LABELS: Record<string, string> = {
  school_student: 'Student',
  school_teacher: 'Teacher',
  independent_teacher: 'Independent Teacher',
  school_admin: 'School Admin',
  super_admin: 'Super Admin',
}

const ROLE_VARIANTS: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'gray'> = {
  school_student: 'primary',
  school_teacher: 'success',
  independent_teacher: 'success',
  school_admin: 'warning',
  super_admin: 'danger',
}

function Profile() {
  const { user, updateProfile, changePassword } = useAuth()

  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess(false)

    if (!firstName.trim() || !lastName.trim()) {
      setProfileError('First name and last name are required')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setProfileError('Please enter a valid email address')
      return
    }

    setProfileLoading(true)
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
      })
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch {
      setProfileError('Failed to update profile. Please try again.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (!currentPassword) {
      setPasswordError('Please enter your current password')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    setPasswordLoading(true)
    try {
      await changePassword(currentPassword, newPassword)
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your account information</p>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name || 'User'} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={ROLE_VARIANTS[user?.role || ''] || 'gray'} size="sm">
                {ROLE_LABELS[user?.role || ''] || user?.role}
              </Badge>
              {user?.schoolName && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {user.schoolName}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Information Form */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" /> Profile Information
          </h2>
        </Card.Header>
        <Card.Body>
          {profileSuccess && <Alert variant="success" className="mb-4">Profile updated successfully!</Alert>}
          {profileError && <Alert variant="error" className="mb-4">{profileError}</Alert>}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 min-h-[44px]">
                  <Shield className="w-4 h-4 text-gray-400" />
                  {ROLE_LABELS[user?.role || ''] || user?.role}
                </div>
              </div>
              {user?.schoolName && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">School</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 min-h-[44px]">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {user.schoolName}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={profileLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {/* Change Password Form */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" /> Change Password
          </h2>
        </Card.Header>
        <Card.Body>
          {passwordSuccess && <Alert variant="success" className="mb-4">Password changed successfully!</Alert>}
          {passwordError && <Alert variant="error" className="mb-4">{passwordError}</Alert>}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              helperText="Minimum 6 characters"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={passwordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Profile
