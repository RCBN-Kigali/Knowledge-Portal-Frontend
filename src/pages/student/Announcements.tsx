import { Link } from 'react-router-dom'
import { Megaphone, Calendar, ChevronRight } from 'lucide-react'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Megaphone className="w-6 h-6" />
            Announcements
          </h2>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="space-y-3">
            {data.items.map((a) => (
              <Link
                key={a.id}
                to={`/student/announcements/${a.id}`}
                className={`block p-5 rounded-2xl border transition-all hover:shadow-md ${
                  !a.is_read ? 'bg-secondary/5 border-secondary/20' : 'bg-card border-border'
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      a.priority === 'high'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    <Megaphone className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                      <h3 className="font-medium flex items-center gap-2 flex-wrap">
                        {a.title}
                        {a.priority === 'high' && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                            High priority
                          </span>
                        )}
                      </h3>
                      {!a.is_read && (
                        <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {a.content_preview}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">No announcements yet</h3>
            <p className="text-muted-foreground">Check back later for school news.</p>
          </div>
        )}
      </div>
    </div>
  )
}
