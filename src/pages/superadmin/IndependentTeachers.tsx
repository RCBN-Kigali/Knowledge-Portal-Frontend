import { useState, useEffect } from 'react'
import { 
  useIndependentTeachers, 
  useAddIndependentTeacher, 
  useUpdateTeacherStatus,
  type IndependentTeacher 
} from '../../features/admin/hooks/useIndependentTeachers'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import SearchBar from '../../components/ui/SearchBar'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Pagination from '../../components/ui/Pagination'
import { UserPlus, Users, MoreVertical, Check, X, Eye, BookOpen } from 'lucide-react'

type StatusTab = 'all' | 'pending' | 'approved' | 'rejected'

export default function IndependentTeachers() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusTab, setStatusTab] = useState<StatusTab>('all')
  const [page, setPage] = useState(1)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [viewTeacher, setViewTeacher] = useState<IndependentTeacher | null>(null)
  const [teacherToApprove, setTeacherToApprove] = useState<IndependentTeacher | null>(null)
  const [teacherToReject, setTeacherToReject] = useState<IndependentTeacher | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  
  // Form state for adding new teacher
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', bio: '' })
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])
  
  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusTab])
  
  const { data: teachersData, isLoading } = useIndependentTeachers({
    search: debouncedSearch,
    status: statusTab === 'all' ? undefined : statusTab,
    page,
    perPage: 10,
  })
  
  const addTeacher = useAddIndependentTeacher()
  const updateStatus = useUpdateTeacherStatus()
  
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ]
  
  const handleAddTeacher = async () => {
    await addTeacher.mutateAsync(newTeacher)
    setNewTeacher({ name: '', email: '', bio: '' })
    setAddModalOpen(false)
  }
  
  const handleApprove = async () => {
    if (!teacherToApprove) return
    await updateStatus.mutateAsync({ teacherId: teacherToApprove.id, status: 'approved' })
    setTeacherToApprove(null)
  }
  
  const handleReject = async () => {
    if (!teacherToReject) return
    await updateStatus.mutateAsync({ 
      teacherId: teacherToReject.id, 
      status: 'rejected',
      reason: rejectionReason 
    })
    setTeacherToReject(null)
    setRejectionReason('')
  }
  
  const getStatusVariant = (status: string): 'warning' | 'success' | 'danger' | 'gray' => {
    switch (status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'danger'
      default: return 'gray'
    }
  }
  
  const isValidForm = newTeacher.name.trim() && newTeacher.email.trim() && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newTeacher.email)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Independent Teachers</h1>
          <p className="text-gray-600 mt-1">
            Manage independent teachers who create public courses
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
          Add Teacher
        </Button>
      </div>
      
      {/* Info Banner */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-primary-800">
          Independent teachers are not affiliated with any school. Their courses require Super Admin approval before becoming public.
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={tabs}
          activeTab={statusTab}
          onChange={(id) => setStatusTab(id as StatusTab)}
        />
        <div className="w-full sm:w-64">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search teachers..."
          />
        </div>
      </div>
      
      {/* Teachers List */}
      <Card>
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-64" />
          </div>
        ) : teachersData?.teachers && teachersData.teachers.length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {teachersData.teachers.map(teacher => (
                <div key={teacher.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar name={teacher.name} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{teacher.name}</h3>
                          <Badge variant={getStatusVariant(teacher.status)} size="sm" className="capitalize">
                            {teacher.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{teacher.email}</p>
                        {teacher.bio && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{teacher.bio}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {teacher.courseCount} courses
                          </span>
                          <span>Applied: {new Date(teacher.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setMenuOpen(menuOpen === teacher.id ? null : teacher.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {menuOpen === teacher.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => { setViewTeacher(teacher); setMenuOpen(null); }}
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          {teacher.status === 'pending' && (
                            <>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                onClick={() => { setTeacherToApprove(teacher); setMenuOpen(null); }}
                              >
                                <Check className="w-4 h-4" /> Approve
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-2"
                                onClick={() => { setTeacherToReject(teacher); setMenuOpen(null); }}
                              >
                                <X className="w-4 h-4" /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {teachersData.pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={teachersData.pagination.page}
                  totalPages={teachersData.pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title={debouncedSearch ? 'No teachers found' : 'No independent teachers'}
              description={debouncedSearch ? 'Try adjusting your search' : 'Add your first independent teacher'}
              actionLabel={!debouncedSearch ? 'Add Teacher' : undefined}
              onAction={!debouncedSearch ? () => setAddModalOpen(true) : undefined}
            />
          </div>
        )}
      </Card>
      
      {/* Add Teacher Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false)
          setNewTeacher({ name: '', email: '', bio: '' })
        }}
        title="Add Independent Teacher"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter teacher's name"
            required
          />
          <Input
            label="Email"
            type="email"
            value={newTeacher.email}
            onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
            required
          />
          <Textarea
            label="Bio"
            value={newTeacher.bio}
            onChange={(e) => setNewTeacher(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Brief description of the teacher's background (optional)"
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTeacher} disabled={!isValidForm} loading={addTeacher.isPending}>
              Add Teacher
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* View Teacher Modal */}
      <Modal
        isOpen={!!viewTeacher}
        onClose={() => setViewTeacher(null)}
        title="Teacher Details"
      >
        {viewTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewTeacher.name} size="lg" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{viewTeacher.name}</h3>
                <p className="text-gray-500">{viewTeacher.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-y">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={getStatusVariant(viewTeacher.status)} className="capitalize mt-1">
                  {viewTeacher.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Courses</p>
                <p className="font-medium">{viewTeacher.courseCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Applied</p>
                <p className="font-medium">{new Date(viewTeacher.appliedAt).toLocaleDateString()}</p>
              </div>
              {viewTeacher.approvedAt && (
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="font-medium">{new Date(viewTeacher.approvedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            {viewTeacher.bio && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Bio</p>
                <p className="text-gray-900">{viewTeacher.bio}</p>
              </div>
            )}
            
            {viewTeacher.rejectionReason && (
              <div className="bg-danger-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-danger-700">Rejection Reason</p>
                <p className="text-danger-600">{viewTeacher.rejectionReason}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              {viewTeacher.status === 'pending' && (
                <>
                  <Button variant="danger" onClick={() => { setViewTeacher(null); setTeacherToReject(viewTeacher); }}>
                    Reject
                  </Button>
                  <Button onClick={() => { setViewTeacher(null); setTeacherToApprove(viewTeacher); }}>
                    Approve
                  </Button>
                </>
              )}
              {viewTeacher.status !== 'pending' && (
                <Button onClick={() => setViewTeacher(null)}>Close</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
      
      {/* Approve Confirmation */}
      <ConfirmDialog
        isOpen={!!teacherToApprove}
        onClose={() => setTeacherToApprove(null)}
        onConfirm={handleApprove}
        title="Approve Teacher"
        message={`Are you sure you want to approve ${teacherToApprove?.name} as an independent teacher? They will be able to create and publish public courses.`}
        confirmLabel="Approve"
        loading={updateStatus.isPending}
      />
      
      {/* Reject Modal */}
      <Modal
        isOpen={!!teacherToReject}
        onClose={() => {
          setTeacherToReject(null)
          setRejectionReason('')
        }}
        title="Reject Teacher Application"
      >
        {teacherToReject && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a reason for rejecting {teacherToReject.name}'s application.
            </p>
            <Textarea
              label="Rejection Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              rows={3}
              required
            />
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setTeacherToReject(null)}>Cancel</Button>
              <Button 
                variant="danger" 
                onClick={handleReject} 
                disabled={!rejectionReason.trim()}
                loading={updateStatus.isPending}
              >
                Reject Application
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
