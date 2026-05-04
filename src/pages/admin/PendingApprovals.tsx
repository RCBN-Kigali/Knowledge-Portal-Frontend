import { useState } from 'react'
import { Search, Check, X, FileText, Play, Headphones, Calendar, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { adminApi } from '../../api/admin'
import { format } from 'date-fns'
import type { Content, ContentType } from '../../types'

function getContentIcon(type: ContentType) {
  switch (type) {
    case 'video':
      return Play
    case 'audio':
      return Headphones
    case 'article':
      return FileText
  }
}

export default function PendingApprovals() {
  const qc = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmModal, setConfirmModal] = useState<{
    content: Content
    action: 'approve' | 'reject'
  } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'pending'],
    queryFn: () => adminApi.pendingContent({ limit: 50 }),
  })

  const approveMut = useMutation({
    mutationFn: (id: string) => adminApi.approveContent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] })
      setConfirmModal(null)
    },
  })
  const rejectMut = useMutation({
    mutationFn: (id: string) => adminApi.rejectContent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] })
      setConfirmModal(null)
    },
  })

  const items = data?.items ?? []
  const filtered = searchQuery.trim()
    ? items.filter((c) => {
        const q = searchQuery.toLowerCase()
        return (
          c.title.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.grade_level.toLowerCase().includes(q)
        )
      })
    : items

  const onConfirm = () => {
    if (!confirmModal) return
    if (confirmModal.action === 'approve') approveMut.mutate(confirmModal.content.id)
    else rejectMut.mutate(confirmModal.content.id)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Content Approvals</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review content submitted by teachers before it appears to students
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted text-foreground">
              <span className="font-bold">{items.length}</span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, subject, or grade…"
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
        ) : filtered.length === 0 && items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="mb-2 font-medium">All caught up!</h3>
            <p className="text-muted-foreground">
              No content waiting for review.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">No matches</h3>
            <p className="text-muted-foreground">Try a different search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const Icon = getContentIcon(item.content_type)
              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1 line-clamp-2">{item.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3 flex-wrap">
                          <Badge variant="secondary" className="bg-muted border-0 text-xs">
                            {item.subject}
                          </Badge>
                          <span>{item.grade_level}</span>
                          <span className="capitalize">{item.content_type}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Submitted {format(new Date(item.created_at), 'PPP')}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}
                        {item.hashtags && item.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.hashtags.slice(0, 5).map((tag) => (
                              <Badge
                                key={String(tag)}
                                variant="secondary"
                                className="text-xs bg-primary/10 text-primary border-0"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:items-end lg:w-44">
                      <Link
                        to={`/student/content/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-sm w-full"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Link>
                      <button
                        onClick={() => setConfirmModal({ content: item, action: 'approve' })}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all w-full"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setConfirmModal({ content: item, action: 'reject' })}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all w-full"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
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
              {confirmModal.action === 'approve' ? 'Publish this content?' : 'Reject this content?'}
            </h3>
            <p className="text-center text-muted-foreground mb-2 line-clamp-2">
              {confirmModal.content.title}
            </p>
            <p className="text-center text-sm text-muted-foreground mb-6">
              {confirmModal.action === 'approve'
                ? 'It will become visible to all students immediately.'
                : 'The teacher will see this in their dashboard with a Rejected badge and can resubmit.'}
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
