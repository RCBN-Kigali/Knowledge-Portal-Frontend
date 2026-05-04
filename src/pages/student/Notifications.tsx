import { Link } from 'react-router-dom'
import { MessageCircle, Megaphone, Sparkles, BellOff } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../../api/notifications'
import { Skeleton } from '../../components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import type { NotificationItem } from '../../types'

function iconForType(notificationType: string) {
  if (notificationType === 'comment_reply' || notificationType.includes('comment')) {
    return { Icon: MessageCircle, tone: 'bg-primary/10 text-primary' }
  }
  if (notificationType.includes('announcement')) {
    return { Icon: Megaphone, tone: 'bg-secondary/10 text-secondary' }
  }
  return { Icon: Sparkles, tone: 'bg-accent/10 text-accent' }
}

function linkForNotification(n: NotificationItem): string | null {
  if (n.related_announcement_id) return `/student/announcements/${n.related_announcement_id}`
  if (n.related_content_id) return `/student/content/${n.related_content_id}`
  return null
}

export default function Notifications() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list({ limit: 50 }),
  })

  const markAll = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })

  const markOne = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })

  const unreadCount = data?.unread_count ?? 0

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <button
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="space-y-2">
            {data.items.map((n) => {
              const { Icon, tone } = iconForType(n.notification_type)
              const target = linkForNotification(n)
              const handleClick = () => {
                if (!n.is_read) markOne.mutate(n.id)
              }

              const Inner = (
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${tone}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-medium">{n.title}</h4>
                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )

              const className = `block p-4 rounded-2xl border transition-all hover:shadow-md text-left w-full ${
                !n.is_read ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
              }`

              return target ? (
                <Link key={n.id} to={target} onClick={handleClick} className={className}>
                  {Inner}
                </Link>
              ) : (
                <button key={n.id} onClick={handleClick} className={className}>
                  {Inner}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <BellOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  )
}
