import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Headphones, FileText, Heart, MessageCircle, Plus, MoreVertical } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { teacherContentApi } from '../../api/teacherContent'
import { formatDistanceToNow } from 'date-fns'
import type { Content, ContentType } from '../../types'

const contentTypes = [
  { id: 'all', label: 'All' },
  { id: 'video', label: 'Videos' },
  { id: 'article', label: 'Articles' },
  { id: 'audio', label: 'Audio' },
] as const

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

function getTypeColor(type: ContentType) {
  switch (type) {
    case 'video':
      return 'bg-primary text-primary-foreground'
    case 'audio':
      return 'bg-accent text-accent-foreground'
    case 'article':
      return 'bg-secondary text-secondary-foreground'
  }
}

function thumbnailFor(content: Content): string {
  const subj = content.subject?.toLowerCase() ?? ''
  if (subj.includes('biology')) return '🌿'
  if (subj.includes('math')) return '📐'
  if (subj.includes('english')) return '✍️'
  if (subj.includes('history')) return '🏛️'
  if (subj.includes('chemistry')) return '⚗️'
  if (subj.includes('physics')) return '⚛️'
  if (subj.includes('career')) return '💼'
  if (subj.includes('geography')) return '🌍'
  if (subj.includes('computer')) return '💻'
  switch (content.content_type) {
    case 'video':
      return '🎬'
    case 'audio':
      return '🎧'
    case 'article':
      return '📄'
  }
}

function statusBadge(status: string): { label: string; classes: string } {
  switch (status) {
    case 'published':
      return { label: 'Published', classes: 'bg-green-500 text-white border-0' }
    case 'pending':
      return { label: 'Pending review', classes: 'bg-amber-100 text-amber-800 border-0' }
    case 'rejected':
      return { label: 'Rejected', classes: 'bg-red-100 text-red-700 border-0' }
    case 'draft':
    default:
      return { label: 'Draft', classes: 'bg-muted text-muted-foreground border-0' }
  }
}

export default function TeacherDashboard() {
  const [selectedType, setSelectedType] = useState<(typeof contentTypes)[number]['id']>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['teacher-content', 'list'],
    queryFn: () => teacherContentApi.list({ limit: 50 }),
  })

  const filtered = (data ?? []).filter((c) => selectedType === 'all' || c.content_type === selectedType)

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="mb-4 text-xl font-semibold">My Content</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-5 py-2 rounded-xl border flex-shrink-0 transition-all ${
                  selectedType === type.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((item) => {
              const Icon = getContentIcon(item.content_type)
              const isPublished = item.status === 'published'
              const badge = statusBadge(item.status)
              return (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-5xl sm:text-6xl">
                        {thumbnailFor(item)}
                      </div>
                      <div
                        className={`absolute top-2 right-2 w-8 h-8 rounded-lg ${getTypeColor(
                          item.content_type
                        )} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge className={badge.classes}>{badge.label}</Badge>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="mb-2 line-clamp-2 font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.status === 'draft'
                            ? `Draft saved ${formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}`
                            : item.status === 'pending'
                            ? `Submitted ${formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}`
                            : item.status === 'rejected'
                            ? `Rejected ${formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}`
                            : formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {item.hashtags?.slice(0, 3).map((tag) => (
                            <Badge
                              key={String(tag)}
                              variant="secondary"
                              className="text-xs bg-primary/10 text-primary border-0"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{item.likes_count.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{item.comments_count}</span>
                          </div>
                          {isPublished && <div>{item.views_count.toLocaleString()} views</div>}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/teacher/content/${item.id}/edit`}
                      className="flex-shrink-0 w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                      aria-label="Edit content"
                    >
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">No content yet</h3>
            <p className="text-muted-foreground mb-6">Start creating content for your students</p>
            <Link
              to="/teacher/upload"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Upload your first lesson
            </Link>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Link
        to="/teacher/upload"
        className="fixed bottom-24 right-6 lg:bottom-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
        aria-label="Upload content"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  )
}
