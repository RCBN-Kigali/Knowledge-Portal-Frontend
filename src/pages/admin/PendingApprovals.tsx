import { useMemo, useState } from 'react'
import { Search, Check, X, Mail, School, BookOpen } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { adminApi, type TeacherPublic } from '../../api/admin'
import { format } from 'date-fns'

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function PendingApprovals() {
  const qc = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmModal, setConfirmModal] = useState<{
    teacher: TeacherPublic
    action: 'approve' | 'reject'
  } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'approvals'],
    queryFn: adminApi.approvals,
  })

  const approveMut = useMutation({
    mutationFn: (id: string) => adminApi.approveTeacher(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] })
      setConfirmModal(null)
    },
  })
  const rejectMut = useMutation({
    mutationFn: (id: string) => adminApi.rejectTeacher(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] })
      setConfirmModal(null)
    },
  })

  const teachers = data?.pending ?? []
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return teachers
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        (t.school?.toLowerCase().includes(q) ?? false)
    )
  }, [teachers, searchQuery])

  const onConfirm = () => {
    if (!confirmModal) return
    if (confirmModal.action === 'approve') approveMut.mutate(confirmModal.teacher.id)
    else rejectMut.mutate(confirmModal.teacher.id)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Pending Approvals</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review and approve teacher applications
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600">
              <span className="font-bold">{teachers.length}</span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-input-background border-border"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <Skeleton key={i} className="h-44 w-full rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 && teachers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="mb-2 font-medium">All caught up!</h3>
            <p className="text-muted-foreground">
              No pending teacher applications at the moment
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-lg font-semibold flex-shrink-0">
                      {initialsOf(teacher.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 font-semibold">{teacher.name}</h4>
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                        {teacher.school && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <School className="w-4 h-4 flex-shrink-0" />
                            <span>{teacher.school}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="w-4 h-4 flex-shrink-0" />
                          <span>Applied {format(new Date(teacher.created_at), 'PPP')}</span>
                        </div>
                      </div>
                      {teacher.subjects && teacher.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {teacher.subjects.map((subject) => (
                            <Badge
                              key={subject}
                              variant="secondary"
                              className="text-xs bg-primary/10 text-primary border-0"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 lg:flex-col lg:items-end">
                    <button
                      onClick={() => setConfirmModal({ teacher, action: 'approve' })}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => setConfirmModal({ teacher, action: 'reject' })}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <div
              className={`w-12 h-12 rounded-full ${
                confirmModal.action === 'approve'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              } flex items-center justify-center mx-auto mb-4`}
            >
              {confirmModal.action === 'approve' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </div>
            <h3 className="text-center mb-2 font-semibold text-lg">
              {confirmModal.action === 'approve' ? 'Approve Teacher Application?' : 'Reject Teacher Application?'}
            </h3>
            <p className="text-center text-muted-foreground mb-2">{confirmModal.teacher.name}</p>
            <p className="text-center text-sm text-muted-foreground mb-6">
              {confirmModal.action === 'approve'
                ? 'This teacher will be able to log in and create content for students.'
                : 'This teacher will be notified that their application was not approved.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-6 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={approveMut.isPending || rejectMut.isPending}
                className={`flex-1 px-6 py-3 rounded-xl transition-all disabled:opacity-50 ${
                  confirmModal.action === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {approveMut.isPending || rejectMut.isPending ? 'Working…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
