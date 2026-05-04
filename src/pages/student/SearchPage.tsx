import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { discoveryApi } from '../../api/discovery'
import { Skeleton } from '../../components/ui/skeleton'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [committed, setCommitted] = useState('')

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: discoveryApi.trending,
  })

  const { data: results, isFetching } = useQuery({
    queryKey: ['search', committed],
    queryFn: () => discoveryApi.search({ q: committed }),
    enabled: committed.length > 0,
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/student" className="p-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <form
            onSubmit={(e) => { e.preventDefault(); setCommitted(query.trim()) }}
            className="flex-1 relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons, topics, careers..."
              className="pl-11 h-12 bg-input-background border-border rounded-xl"
            />
          </form>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {!committed ? (
          <div>
            <h3 className="font-medium mb-3">Trending</h3>
            <div className="flex flex-wrap gap-2">
              {trending?.trending_searches.map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); setCommitted(term) }}
                  className="px-4 py-2 bg-card border border-border rounded-xl text-sm hover:bg-muted"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : isFetching ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : results && results.items.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{results.total} result{results.total === 1 ? '' : 's'}</p>
            {results.items.map((item) => (
              <Link
                key={item.id}
                to={`/student/content/${item.id}`}
                className="block bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all"
              >
                <h4 className="font-medium mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                  <span>{item.subject}</span>
                  <span>·</span>
                  <span>{item.grade_level}</span>
                  <span>·</span>
                  <span>{item.likes_count} likes</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="font-medium mb-1">No results for "{committed}"</h3>
            <p className="text-muted-foreground">Try a different keyword.</p>
          </div>
        )}
      </div>
    </div>
  )
}
