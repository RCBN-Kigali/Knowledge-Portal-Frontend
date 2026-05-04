import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Play, Headphones, FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { discoveryApi } from '../../api/discovery'
import { Skeleton } from '../../components/ui/skeleton'
import type { ContentType } from '../../types'

function getContentIcon(type: ContentType) {
  switch (type) {
    case 'video': return Play
    case 'audio': return Headphones
    case 'article': return FileText
  }
}

export default function CareerExplorer() {
  const [subject, setSubject] = useState<string>('Career')
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: discoveryApi.categories,
  })
  const { data: feed, isLoading } = useQuery({
    queryKey: ['explore', subject],
    queryFn: () => discoveryApi.explore({ subject, limit: 20 }),
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary" />
            Explore
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(categoriesData?.categories ?? []).map((cat) => (
              <button
                key={cat}
                onClick={() => setSubject(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex-shrink-0 border ${
                  subject === cat
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : feed && feed.items.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {feed.items.map((item) => {
              const Icon = getContentIcon(item.content_type)
              return (
                <Link
                  key={item.id}
                  to={`/student/content/${item.id}`}
                  className="block bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2 mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.subject} · {item.grade_level}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="font-medium mb-1">Nothing to explore here yet</h3>
            <p className="text-muted-foreground">Try a different category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
