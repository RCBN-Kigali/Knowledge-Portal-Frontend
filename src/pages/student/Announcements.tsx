import { Link } from 'react-router-dom'
import { Megaphone } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { announcementsApi } from '../../api/announcements'
import { Skeleton } from '../../components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

export default function Announcements() {
  const { data, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsApi.list({ limit: 50 }),
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="text-xl font-semibold">Announcements</h2>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="space-y-3">
            {data.items.map((a) => (
              <Link
                key={a.id}
                to={`/student/announcements/${a.id}`}
                className={`block p-4 border rounded-xl hover:shadow-md transition-all ${
                  a.is_read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    a.priority === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'
                  }`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`${a.is_read ? '' : 'font-medium'}`}>{a.title}</p>
                      {a.priority === 'high' && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">High</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.content_preview}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No announcements yet</h3>
            <p className="text-muted-foreground">Check back later for school news.</p>
          </div>
        )}
      </div>
    </div>
  )
}
