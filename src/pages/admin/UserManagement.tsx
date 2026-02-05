import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  useAdminUsers, 
  useCreateUser, 
  useDeactivateUser, 
  useActivateUser,
  useResetPassword,
  type AdminUser,
  type AdminUsersFilters
} from '../../features/admin/hooks/useAdminUsers'
import { useBulkImport } from '../../features/admin/hooks/useBulkImport'
import { useSchools } from '../../features/admin/hooks/useSchools'
import UserTable from '../../features/admin/components/UserTable'
import AddUserModal from '../../features/admin/components/AddUserModal'
import BulkImportModal from '../../features/admin/components/BulkImportModal'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import SearchBar from '../../components/ui/SearchBar'
import Select from '../../components/ui/Select'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { UserPlus, Upload, Users, Copy, Check } from 'lucide-react'

type RoleTab = 'all' | 'school_student' | 'school_teacher'

export default function UserManagement() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'
  
  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleTab, setRoleTab] = useState<RoleTab>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [schoolFilter, setSchoolFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  
  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [bulkImportOpen, setBulkImportOpen] = useState(false)
  const [userToDeactivate, setUserToDeactivate] = useState<AdminUser | null>(null)
  const [userToActivate, setUserToActivate] = useState<AdminUser | null>(null)
  const [passwordResetResult, setPasswordResetResult] = useState<{ user: AdminUser; password: string } | null>(null)
  const [copied, setCopied] = useState(false)
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])
  
  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, roleTab, statusFilter, schoolFilter])
  
  // Queries & Mutations
  const filters: AdminUsersFilters = {
    search: debouncedSearch,
    role: roleTab === 'all' ? undefined : roleTab,
    status: statusFilter === 'all' ? undefined : statusFilter,
    schoolId: isSuperAdmin ? (schoolFilter === 'all' ? undefined : schoolFilter) : undefined,
    page,
    perPage: 10,
  }
  
  const { data: usersData, isLoading } = useAdminUsers(filters)
  const { data: schools } = useSchools()
  const createUser = useCreateUser()
  const deactivateUser = useDeactivateUser()
  const activateUser = useActivateUser()
  const resetPassword = useResetPassword()
  const bulkImport = useBulkImport()
  
  const tabs = [
    { id: 'all', label: 'All Users' },
    { id: 'school_student', label: 'Students' },
    { id: 'school_teacher', label: 'Teachers' },
  ]
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]
  
  const schoolOptions = [
    { value: 'all', label: 'All Schools' },
    ...(schools?.map(s => ({ value: s.id, label: s.name })) || []),
  ]
  
  const handleCreateUser = async (data: Parameters<typeof createUser.mutateAsync>[0]) => {
    const result = await createUser.mutateAsync(data)
    return { tempPassword: result.tempPassword }
  }
  
  const handleDeactivate = async () => {
    if (!userToDeactivate) return
    await deactivateUser.mutateAsync(userToDeactivate.id)
    setUserToDeactivate(null)
  }
  
  const handleActivate = async () => {
    if (!userToActivate) return
    await activateUser.mutateAsync(userToActivate.id)
    setUserToActivate(null)
  }
  
  const handleResetPassword = async (userToReset: AdminUser) => {
    const result = await resetPassword.mutateAsync(userToReset.id)
    setPasswordResetResult({ user: userToReset, password: result.tempPassword })
  }
  
  const handleCopyPassword = () => {
    if (passwordResetResult) {
      navigator.clipboard.writeText(passwordResetResult.password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage users {isSuperAdmin ? 'across all schools' : 'in your school'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setBulkImportOpen(true)} leftIcon={<Upload className="w-4 h-4" />}>
            Bulk Import
          </Button>
          <Button onClick={() => setAddModalOpen(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
            Add User
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <Tabs
          tabs={tabs}
          activeTab={roleTab}
          onChange={(id) => setRoleTab(id as RoleTab)}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-64">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name or email..."
            />
          </div>
          {isSuperAdmin && (
            <Select
              value={schoolFilter}
              onChange={setSchoolFilter}
              options={schoolOptions}
              className="w-full sm:w-40"
            />
          )}
          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as typeof statusFilter)}
            options={statusOptions}
            className="w-full sm:w-32"
          />
        </div>
      </div>
      
      {/* Users Table */}
      <Card>
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-64" />
          </div>
        ) : usersData?.users && usersData.users.length > 0 ? (
          <>
            <UserTable
              users={usersData.users}
              onEdit={(u) => console.log('Edit user:', u)}
              onDeactivate={setUserToDeactivate}
              onActivate={setUserToActivate}
              onResetPassword={handleResetPassword}
              showSchool={isSuperAdmin}
            />
            {usersData.pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={usersData.pagination.page}
                  totalPages={usersData.pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title={debouncedSearch ? 'No users found' : 'No users yet'}
              description={debouncedSearch ? 'Try adjusting your search or filters' : 'Add your first user to get started'}
              actionLabel={!debouncedSearch ? 'Add User' : undefined}
              onAction={!debouncedSearch ? () => setAddModalOpen(true) : undefined}
            />
          </div>
        )}
      </Card>
      
      {/* Add User Modal */}
      <AddUserModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreateUser}
        schools={schools}
        isSuperAdmin={isSuperAdmin}
        defaultSchoolId={user?.schoolId || undefined}
        loading={createUser.isPending}
      />
      
      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={bulkImportOpen}
        onClose={() => {
          setBulkImportOpen(false)
          bulkImport.clearParsedRows()
        }}
        parsedRows={bulkImport.parsedRows}
        onFileUpload={bulkImport.handleFileUpload}
        onImport={bulkImport.importUsers}
        onDownloadTemplate={bulkImport.downloadTemplate}
        isImporting={bulkImport.isImporting}
      />
      
      {/* Deactivate Confirmation */}
      <ConfirmDialog
        isOpen={!!userToDeactivate}
        onClose={() => setUserToDeactivate(null)}
        onConfirm={handleDeactivate}
        title="Deactivate User"
        message={`Are you sure you want to deactivate ${userToDeactivate?.name}? They will no longer be able to log in.`}
        confirmLabel="Deactivate"
        variant="danger"
        loading={deactivateUser.isPending}
      />
      
      {/* Activate Confirmation */}
      <ConfirmDialog
        isOpen={!!userToActivate}
        onClose={() => setUserToActivate(null)}
        onConfirm={handleActivate}
        title="Activate User"
        message={`Are you sure you want to reactivate ${userToActivate?.name}?`}
        confirmLabel="Activate"
        loading={activateUser.isPending}
      />
      
      {/* Password Reset Result */}
      <Modal
        isOpen={!!passwordResetResult}
        onClose={() => setPasswordResetResult(null)}
        title="Password Reset"
      >
        {passwordResetResult && (
          <div className="space-y-4">
            <Alert variant="success">
              Password reset successfully for {passwordResetResult.user.name}
            </Alert>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Temporary Password</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={passwordResetResult.password}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono bg-gray-50"
                />
                <Button variant="secondary" onClick={handleCopyPassword}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Share this password securely with the user.</p>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setPasswordResetResult(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
