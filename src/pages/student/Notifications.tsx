import { Link } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../../api/notifications'
import { Skeleton } from '../../components/ui/skeleton'
import { Button } from '../../components/ui/button'
import { formatDistanceToNow } from 'date-fns'

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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Notifications</h2>
          {data && data.unread_count > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="space-y-2">
            {data.items.map((n) => {
              const target = n.related_announcement_id
                ? `/student/announcements/${n.related_announcement_id}`
                : n.related_content_id
                ? `/student/content/${n.related_content_id}`
                : null
              const Inner = (
                <div className={`p-4 border rounded-xl flex gap-3 ${n.is_read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'}`}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.is_read ? '' : 'font-medium'} mb-1`}>{n.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
              return target ? (
                <Link key={n.id} to={target} onClick={() => !n.is_read && markOne.mutate(n.id)} className="block">
                  {Inner}
                </Link>
              ) : (
                <button key={n.id} onClick={() => !n.is_read && markOne.mutate(n.id)} className="block w-full text-left">
                  {Inner}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up.</p>
          </div>
        )}
      </div>
    </div>
  )
}
