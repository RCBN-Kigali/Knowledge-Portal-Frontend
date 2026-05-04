import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { adminApi, type TeacherPublic } from '../../api/admin'
import { format } from 'date-fns'

type FilterStatus = 'all' | 'active' | 'deactivated'

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TeacherManagement() {
  const qc = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [confirmModal, setConfirmModal] = useState<{
    teacher: TeacherPublic
    action: 'activate' | 'deactivate'
  } | null>(null)

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['admin', 'teachers', filterStatus],
    queryFn: () => adminApi.listTeachers({ filter: filterStatus, limit: 100 }),
  })

  const toggleMut = useMutation({
    mutationFn: (id: string) => adminApi.toggleTeacher(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] })
      setConfirmModal(null)
    },
  })

  // For accurate counts in the tabs, fetch the unfiltered list separately.
  const { data: allTeachers } = useQuery({
    queryKey: ['admin', 'teachers', 'all'],
    queryFn: () => adminApi.listTeachers({ filter: 'all', limit: 500 }),
  })

  const activeCount = (allTeachers ?? []).filter((t) => t.is_active).length
  const deactivatedCount = (allTeachers ?? []).filter((t) => !t.is_active).length
  const totalCount = (allTeachers ?? []).length

  const filtered = useMemo(() => {
    if (!teachers) return []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return teachers
    return teachers.filter(
      (t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
    )
  }, [teachers, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Teacher Management</h2>
            <Link
              to="/admin/teachers/add"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Teacher</span>
            </Link>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-input-background border-border"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {(
              [
                { id: 'all' as FilterStatus, label: `All (${totalCount})` },
                { id: 'active' as FilterStatus, label: `Active (${activeCount})` },
                { id: 'deactivated' as FilterStatus, label: `Deactivated (${deactivatedCount})` },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-5 py-2 rounded-xl border flex-shrink-0 transition-all ${
                  filterStatus === f.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {initialsOf(teacher.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 font-medium truncate">{teacher.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2 truncate">{teacher.email}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {(teacher.subjects ?? []).map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary border-0"
                        >
                          {subject}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        · Joined {format(new Date(teacher.created_at), 'MMM yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() =>
                        setConfirmModal({
                          teacher,
                          action: teacher.is_active ? 'deactivate' : 'activate',
                        })
                      }
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        teacher.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      aria-label={teacher.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          teacher.is_active ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <p className="text-xs text-center mt-1 text-muted-foreground">
                      {teacher.is_active ? 'Active' : 'Deactivated'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">No teachers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <div
              className={`w-12 h-12 rounded-full ${
                confirmModal.action === 'deactivate'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600'
              } flex items-center justify-center mx-auto mb-4`}
            >
              {confirmModal.action === 'deactivate' ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </div>
            <h3 className="text-center mb-2 font-semibold text-lg">
              {confirmModal.action === 'deactivate' ? 'Deactivate Teacher?' : 'Activate Teacher?'}
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              {confirmModal.action === 'deactivate'
                ? "Their content will be hidden from students and they won't be able to log in."
                : 'This teacher will be able to log in and their content will be visible to students.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-6 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => toggleMut.mutate(confirmModal.teacher.id)}
                disabled={toggleMut.isPending}
                className={`flex-1 px-6 py-3 rounded-xl transition-all disabled:opacity-50 ${
                  confirmModal.action === 'deactivate'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {toggleMut.isPending ? 'Working…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
