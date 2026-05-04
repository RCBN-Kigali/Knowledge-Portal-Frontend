import { useState } from 'react'
import { Search, Play, Headphones, FileText, Heart, Megaphone, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '../../components/ui/badge'
import { discoveryApi } from '../../api/discovery'
import { announcementsApi } from '../../api/announcements'
import { Skeleton } from '../../components/ui/skeleton'
import type { Content, ContentType } from '../../types'

const categoryStyle: Record<string, string> = {
  all: 'bg-muted text-foreground',
  science: 'bg-secondary/20 text-secondary border-secondary/30',
  math: 'bg-primary/20 text-primary border-primary/30',
  english: 'bg-purple-100 text-purple-700 border-purple-300',
  history: 'bg-amber-100 text-amber-700 border-amber-300',
  career: 'bg-rose-100 text-rose-700 border-rose-300',
}

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
  // Map subjects/types to evocative emoji per Figma's visual language.
  const subj = content.subject?.toLowerCase() ?? ''
  if (subj.includes('biology') || content.title.toLowerCase().includes('photosynth')) return '🌿'
  if (subj.includes('math') || content.title.toLowerCase().includes('equation')) return '📐'
  if (subj.includes('english') || content.title.toLowerCase().includes('essay')) return '✍️'
  if (subj.includes('history')) return '🏛️'
  if (subj.includes('chemistry')) return '⚗️'
  if (subj.includes('physics')) return '⚛️'
  if (subj.includes('career')) return '💼'
  if (subj.includes('geography') || content.title.toLowerCase().includes('water')) return '💧'
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

function formatDuration(content: Content): string | null {
  if (content.content_type === 'article') {
    // Approximate read time from description length (200 wpm).
    const words = content.description.trim().split(/\s+/).length
    const minutes = Math.max(1, Math.round(words / 200))
    return `${minutes} min read`
  }
  if (content.duration_minutes == null) return null
  const m = Math.floor(content.duration_minutes)
  const s = Math.round((content.duration_minutes - m) * 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function DiscoveryHome() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAnnouncementBanner, setShowAnnouncementBanner] = useState(true)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: discoveryApi.categories,
  })

  const { data: feed, isLoading } = useQuery({
    queryKey: ['feed', selectedCategory],
    queryFn: () =>
      discoveryApi.feed({
        category: selectedCategory === 'all' ? undefined : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1),
        limit: 20,
      }),
  })

  const { data: announcements } = useQuery({
    queryKey: ['announcements', 'banner'],
    queryFn: () => announcementsApi.list({ limit: 1 }),
  })

  const topAnnouncement = announcements?.items.find((a) => !a.is_read)

  const categories = [
    { id: 'all', label: 'All' },
    ...(categoriesData?.categories ?? []).map((c) => ({ id: c.toLowerCase(), label: c })),
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          <h2 className="text-xl font-semibold">Discover</h2>

          <Link to="/student/search" className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <div className="pl-11 h-12 bg-input-background border border-border rounded-xl flex items-center text-muted-foreground">
              Search lessons, topics, careers...
            </div>
          </Link>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {categories.map((category) => {
              const tone = categoryStyle[category.id] ?? 'bg-muted text-foreground'
              const active = selectedCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex-shrink-0 border ${
                    active
                      ? `${tone} shadow-sm`
                      : 'bg-card border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Content Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Announcement Banner */}
        {showAnnouncementBanner && topAnnouncement && (
          <div className="mb-6 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1 truncate">{topAnnouncement.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{topAnnouncement.content_preview}</p>
            </div>
            <Link
              to={`/student/announcements/${topAnnouncement.id}`}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl hover:shadow-md transition-all flex-shrink-0 text-sm font-medium"
            >
              Read
            </Link>
            <button
              onClick={() => setShowAnnouncementBanner(false)}
              className="w-8 h-8 rounded-lg hover:bg-secondary/10 flex items-center justify-center flex-shrink-0 text-muted-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        ) : feed && feed.items.length > 0 ? (
          <div className="space-y-4">
            {feed.items.map((item) => {
              const Icon = getContentIcon(item.content_type)
              const duration = formatDuration(item)
              const thumb = thumbnailFor(item)
              return (
                <Link
                  key={item.id}
                  to={`/student/content/${item.id}`}
                  className="block w-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all active:scale-[0.99] text-left"
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-5xl sm:text-6xl">
                        {thumb}
                      </div>
                      <div
                        className={`absolute top-2 right-2 w-8 h-8 rounded-lg ${getTypeColor(
                          item.content_type
                        )} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {duration && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {duration}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="mb-2 line-clamp-2 font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.subject} · {item.grade_level}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {item.hashtags?.slice(0, 3).map((tag) => (
                            <Badge
                              key={String(tag)}
                              variant="secondary"
                              className="text-xs bg-muted border-0"
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
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="mb-2 font-medium">No content found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
