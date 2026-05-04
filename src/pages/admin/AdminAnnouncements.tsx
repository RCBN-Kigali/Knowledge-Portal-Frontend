import { useState } from 'react'
import { Megaphone, Plus, X, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { adminApi } from '../../api/admin'
import { announcementsApi } from '../../api/announcements'
import { formatDistanceToNow } from 'date-fns'

type Priority = 'normal' | 'high'

export default function AdminAnnouncements() {
  const qc = useQueryClient()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [error, setError] = useState('')

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', 'admin'],
    queryFn: () => announcementsApi.list({ limit: 100 }),
  })

  const createMut = useMutation({
    mutationFn: () => adminApi.createAnnouncement({ title: title.trim(), content: content.trim(), priority }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
      setShowConfirmation(false)
      setShowCreateForm(false)
      setTitle('')
      setContent('')
      setPriority('normal')
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : err?.message ?? 'Failed to send')
    },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteAnnouncement(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
      setConfirmDelete(null)
    },
  })

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-background pb-24 lg:pb-0">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="mb-8 text-2xl sm:text-3xl font-semibold">New Announcement</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Title</label>
              <Input
                type="text"
                placeholder="Enter announcement title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-14 bg-input-background border-border text-base"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Message</label>
              <textarea
                placeholder="Write your announcement message here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[300px] p-4 border border-border rounded-2xl bg-input-background resize-vertical text-base"
                style={{ lineHeight: 1.6 }}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Use clear, simple language. You can use line breaks for paragraphs.
              </p>
            </div>

            <div>
              <label className="block mb-3 font-medium">Priority</label>
              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-muted transition-colors ${
                  priority === 'normal' ? 'border-primary bg-primary/5' : 'border-border'
                }`}>
                  <input
                    type="radio"
                    name="priority"
                    value="normal"
                    checked={priority === 'normal'}
                    onChange={() => setPriority('normal')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium mb-1">Normal</p>
                    <p className="text-sm text-muted-foreground">
                      Standard announcement shown in the list and on Discover.
                    </p>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-muted transition-colors ${
                  priority === 'high' ? 'border-destructive bg-destructive/5' : 'border-border'
                }`}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={priority === 'high'}
                    onChange={() => setPriority('high')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium mb-1">High priority</p>
                    <p className="text-sm text-muted-foreground">
                      Highlighted in red across student dashboards.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmation(true)}
              disabled={!title.trim() || !content.trim()}
              className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Send Announcement
            </button>
          </div>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-center mb-2 font-semibold text-lg">Send Announcement?</h3>
              <p className="text-center text-muted-foreground mb-6">
                This will be visible to all students and teachers right away.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-6 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createMut.mutate()}
                  disabled={createMut.isPending}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {createMut.isPending ? 'Sending…' : 'Send Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Megaphone className="w-6 h-6" />
            Announcements
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
        ) : announcements && announcements.items.length > 0 ? (
          <div className="space-y-3">
            {announcements.items.map((a) => (
              <div key={a.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold">{a.title}</h3>
                      <Badge
                        className={
                          a.priority === 'high'
                            ? 'bg-destructive/10 text-destructive border-0'
                            : 'bg-primary/10 text-primary border-0'
                        }
                      >
                        {a.priority === 'high' ? 'High priority' : 'Normal'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{a.content_preview}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmDelete(a.id)}
                    className="flex-shrink-0 w-9 h-9 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors"
                    aria-label="Delete announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">No announcements yet</h3>
            <p className="text-muted-foreground mb-6">Send your first announcement to keep everyone in the loop.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              New Announcement
            </button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-center mb-2 font-semibold text-lg">Delete announcement?</h3>
            <p className="text-center text-muted-foreground mb-6">
              This permanently removes the announcement from all dashboards.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-6 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMut.mutate(confirmDelete)}
                disabled={deleteMut.isPending}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
