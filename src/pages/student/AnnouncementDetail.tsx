import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Megaphone, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { announcementsApi } from '../../api/announcements'
import { Skeleton } from '../../components/ui/skeleton'
import { format, formatDistanceToNow } from 'date-fns'

function RichText({ text }: { text: string }) {
  const blocks = useMemo(() => text.split(/\n{2,}/).filter((b) => b.trim().length > 0), [text])
  return (
    <div className="space-y-6 text-foreground" style={{ lineHeight: 1.7 }}>
      {blocks.map((para, idx) => {
        if (para.startsWith('## ')) {
          return (
            <h2 key={idx} className="mt-8 mb-4 text-2xl font-semibold text-foreground">
              {para.replace(/^##\s*/, '')}
            </h2>
          )
        }
        if (para.startsWith('### ')) {
          return (
            <h3 key={idx} className="mt-6 mb-3 text-xl font-semibold text-foreground">
              {para.replace(/^###\s*/, '')}
            </h3>
          )
        }
        if (/^\d+\.\s/.test(para)) {
          const items = para.split('\n').filter(Boolean)
          return (
            <ol key={idx} className="list-decimal list-inside space-y-2 text-muted-foreground">
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
              ))}
            </ol>
          )
        }
        if (/^[-*]\s/.test(para)) {
          const items = para.split('\n').filter(Boolean)
          return (
            <ul key={idx} className="list-disc list-inside space-y-2 text-muted-foreground">
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^[-*]\s*/, '')}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={idx} className="text-muted-foreground whitespace-pre-wrap">
            {para}
          </p>
        )
      })}
    </div>
  )
}

export default function AnnouncementDetail() {
  const { announcementId = '' } = useParams<{ announcementId: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['announcement', announcementId],
    queryFn: () => announcementsApi.get(announcementId),
    enabled: !!announcementId,
  })

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/student/announcements"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to announcements</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {isLoading || !data ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-64 w-full mt-6 rounded-2xl" />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    data.priority === 'high'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-secondary/10 text-secondary'
                  }`}
                >
                  <Megaphone className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h1 className="mb-3 text-2xl sm:text-3xl font-semibold leading-tight flex items-start gap-3 flex-wrap">
                    {data.title}
                    {data.priority === 'high' && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                        High priority
                      </span>
                    )}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(data.created_at), 'PPP')}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(data.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 lg:p-12">
              <RichText text={data.content} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
