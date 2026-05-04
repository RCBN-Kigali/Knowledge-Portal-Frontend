import { useState } from 'react'
import { Search, Play, Headphones, FileText, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '../../components/ui/badge'
import { discoveryApi } from '../../api/discovery'
import { Skeleton } from '../../components/ui/skeleton'
import type { Content, ContentType } from '../../types'

const categoryStyle: Record<string, string> = {
  All: 'bg-muted text-foreground',
  Science: 'bg-secondary/20 text-secondary border-secondary/30',
  Math: 'bg-primary/20 text-primary border-primary/30',
  English: 'bg-purple-100 text-purple-700 border-purple-300',
  History: 'bg-amber-100 text-amber-700 border-amber-300',
  Career: 'bg-rose-100 text-rose-700 border-rose-300',
}

function getContentIcon(type: ContentType) {
  switch (type) {
    case 'video': return Play
    case 'audio': return Headphones
    case 'article': return FileText
  }
}

function getTypeColor(type: ContentType) {
  switch (type) {
    case 'video': return 'bg-primary text-primary-foreground'
    case 'audio': return 'bg-accent text-accent-foreground'
    case 'article': return 'bg-secondary text-secondary-foreground'
  }
}

function formatDuration(content: Content): string | null {
  if (content.content_type === 'article') return null
  if (content.duration_minutes == null) return null
  const m = Math.floor(content.duration_minutes)
  const s = Math.round((content.duration_minutes - m) * 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function DiscoveryHome() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: discoveryApi.categories,
  })

  const { data: feed, isLoading } = useQuery({
    queryKey: ['feed', selectedCategory],
    queryFn: () => discoveryApi.feed({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      limit: 20,
    }),
  })

  const categories = ['All', ...(categoriesData?.categories ?? [])]

  return (
    <div className="min-h-screen bg-background">
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
              const active = selectedCategory === category
              const tone = categoryStyle[category] ?? 'bg-muted text-foreground'
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex-shrink-0 border ${
                    active ? `${tone} shadow-sm` : 'bg-card border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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
              return (
                <Link
                  key={item.id}
                  to={`/student/content/${item.id}`}
                  className="block w-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-5xl sm:text-6xl">
                        {item.content_type === 'video' ? '🎬' : item.content_type === 'audio' ? '🎧' : '📄'}
                      </div>
                      <div className={`absolute top-2 right-2 w-8 h-8 rounded-lg ${getTypeColor(item.content_type)} flex items-center justify-center shadow-md`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {duration && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{duration}</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="mb-2 line-clamp-2 font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.subject} · {item.grade_level}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {item.hashtags?.slice(0, 3).map((tag) => (
                            <Badge key={tag as string} variant="secondary" className="text-xs bg-muted border-0">
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
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">🔍</div>
            <h3 className="mb-2 font-medium">No content yet</h3>
            <p className="text-muted-foreground">Check back soon — teachers are adding new lessons.</p>
          </div>
        )}
      </div>
    </div>
  )
}
