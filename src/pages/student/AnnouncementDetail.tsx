import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Megaphone } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { announcementsApi } from '../../api/announcements'
import { Skeleton } from '../../components/ui/skeleton'
import { format } from 'date-fns'

export default function AnnouncementDetail() {
  const { announcementId = '' } = useParams<{ announcementId: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['announcement', announcementId],
    queryFn: () => announcementsApi.get(announcementId),
    enabled: !!announcementId,
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/student/announcements" className="p-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="font-medium">Announcement</h2>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {isLoading || !data ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-32 w-full mt-4" />
          </div>
        ) : (
          <article className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                data.priority === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'
              }`}>
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold mb-1">{data.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(data.created_at), 'PPP')}
                </p>
              </div>
              {data.priority === 'high' && (
                <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full flex-shrink-0">
                  High priority
                </span>
              )}
            </div>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
              {data.content}
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
