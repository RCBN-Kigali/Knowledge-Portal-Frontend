import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Send } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { Skeleton } from '../../components/ui/skeleton'
import { commentsApi } from '../../api/comments'
import { formatDistanceToNow } from 'date-fns'
import type { TeacherInboxItem } from '../../types'

function initialsOf(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TeacherComments() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [replyText, setReplyText] = useState<Record<string, string>>({})

  const { data, isLoading } = useQuery({
    queryKey: ['teacher-inbox', filter],
    queryFn: () => commentsApi.inbox({ filter, limit: 100 }),
  })

  const replyMut = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => commentsApi.reply(id, text),
    onSuccess: (_, { id }) => {
      setReplyText((prev) => ({ ...prev, [id]: '' }))
      qc.invalidateQueries({ queryKey: ['teacher-inbox'] })
    },
  })

  const grouped = useMemo(() => {
    if (!data) return []
    const map = new Map<string, { contentId: string; title: string; items: TeacherInboxItem[] }>()
    for (const item of data.items) {
      // Skip teacher replies in the top-level inbox grouping; they appear nested.
      const key = item.content_id
      if (!map.has(key)) {
        map.set(key, {
          contentId: item.content_id,
          title: item.content_title ?? 'Untitled',
          items: [],
        })
      }
      map.get(key)!.items.push(item)
    }
    return Array.from(map.values())
  }, [data])

  const totalUnread = data?.items.filter((i) => i.is_unread).length ?? 0

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <MessageCircle className="w-6 h-6" />
              Comments
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl border transition-all text-sm ${
                  filter === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-xl border transition-all text-sm flex items-center gap-2 ${
                  filter === 'unread'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                <span>Unread</span>
                {totalUnread > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      filter === 'unread'
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {totalUnread}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <Skeleton key={i} className="h-44 w-full rounded-2xl" />)}
          </div>
        ) : grouped.length > 0 ? (
          <div className="space-y-8">
            {grouped.map((group) => (
              <div key={group.contentId}>
                <Link
                  to={`/teacher/content/${group.contentId}/edit`}
                  className="flex items-start gap-3 mb-4 p-4 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="line-clamp-1 font-semibold">{group.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {group.items.length} comment{group.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </Link>

                <div className="space-y-4 sm:pl-4">
                  {group.items.map((c) => {
                    const isReply = c.parent_comment_id !== null
                    if (isReply) return null // replies render under their parent below
                    const replies = group.items.filter((r) => r.parent_comment_id === c.id)
                    return (
                      <div
                        key={c.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          c.is_unread ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
                        }`}
                      >
                        <div className="flex gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 text-accent-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {initialsOf(c.user_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-medium">{c.user_name ?? 'User'}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                              </span>
                              {c.is_unread && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                            <p className="text-muted-foreground whitespace-pre-wrap">{c.text}</p>
                          </div>
                        </div>

                        {replies.map((r) => (
                          <div key={r.id} className="ml-13 pl-4 border-l-2 border-primary/20 mb-3">
                            <div className="flex items-start gap-2 text-sm">
                              <span className="font-medium text-primary">You:</span>
                              <p className="text-muted-foreground whitespace-pre-wrap">{r.text}</p>
                            </div>
                          </div>
                        ))}

                        <div className="ml-13 flex gap-2">
                          <Input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText[c.id] || ''}
                            onChange={(e) => setReplyText({ ...replyText, [c.id]: e.target.value })}
                            className="flex-1 h-10 bg-input-background border-border text-sm"
                            onKeyDown={(e) => {
                              const text = (replyText[c.id] || '').trim()
                              if (e.key === 'Enter' && text) {
                                e.preventDefault()
                                replyMut.mutate({ id: c.id, text })
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              const text = (replyText[c.id] || '').trim()
                              if (text) replyMut.mutate({ id: c.id, text })
                            }}
                            disabled={!replyText[c.id]?.trim() || replyMut.isPending}
                            className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            aria-label="Send reply"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">
              {filter === 'unread' ? 'No unread comments' : 'No comments yet'}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'unread' ? "You're all caught up!" : 'Comments from students will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
