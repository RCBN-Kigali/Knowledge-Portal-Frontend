import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  TrendingUp,
  Clock,
  X,
  Stethoscope,
  Cog,
  Laptop,
  BookOpen,
  Scale,
  Palette,
  FlaskConical,
  Calculator,
  Globe,
  Languages,
  History,
  Play,
  Headphones,
  FileText,
  Heart,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { Skeleton } from '../../components/ui/skeleton'
import { Badge } from '../../components/ui/badge'
import { discoveryApi } from '../../api/discovery'
import type { Content, ContentType } from '../../types'

const RECENT_KEY = 'kp.recentSearches'
const MAX_RECENT = 5

const careerPaths = [
  { id: 'medicine', subject: 'Career', name: 'Medicine & Healthcare', icon: Stethoscope, color: 'from-rose-400 to-pink-500', description: 'Doctors, nurses, pharmacists' },
  { id: 'engineering', subject: 'Career', name: 'Engineering', icon: Cog, color: 'from-orange-400 to-amber-500', description: 'Civil, mechanical, electrical' },
  { id: 'technology', subject: 'Career', name: 'Technology & IT', icon: Laptop, color: 'from-blue-400 to-indigo-500', description: 'Software, data, cybersecurity' },
  { id: 'teaching', subject: 'Career', name: 'Education & Teaching', icon: BookOpen, color: 'from-green-400 to-emerald-500', description: 'Teachers, professors, tutors' },
  { id: 'law', subject: 'Career', name: 'Law & Justice', icon: Scale, color: 'from-purple-400 to-violet-500', description: 'Lawyers, judges, paralegals' },
  { id: 'arts', subject: 'Career', name: 'Creative Arts', icon: Palette, color: 'from-pink-400 to-rose-500', description: 'Design, music, writing' },
]

const subjectCards = [
  { id: 'science', name: 'Science', icon: FlaskConical, color: 'bg-secondary/20 text-secondary border-secondary/30' },
  { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-primary/20 text-primary border-primary/30' },
  { id: 'english', name: 'English', icon: BookOpen, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { id: 'history', name: 'History', icon: History, color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'geography', name: 'Geography', icon: Globe, color: 'bg-teal-100 text-teal-700 border-teal-300' },
  { id: 'languages', name: 'Languages', icon: Languages, color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
]

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

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function pushRecent(term: string) {
  const list = readRecent().filter((t) => t.toLowerCase() !== term.toLowerCase())
  list.unshift(term)
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)))
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [committed, setCommitted] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recent, setRecent] = useState<string[]>(() => readRecent())

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: discoveryApi.trending,
  })

  const { data: results, isFetching } = useQuery({
    queryKey: ['search', committed],
    queryFn: () => discoveryApi.search({ q: committed }),
    enabled: committed.length > 0,
  })

  const trendingTopics = useMemo(() => {
    const fromBackend = trending?.trending_searches.map((s) => `#${s.replace(/\s+/g, '')}`) ?? []
    if (fromBackend.length >= 4) return fromBackend
    // Fall back to design-canonical hashtags so the screen never feels empty.
    return [
      ...fromBackend,
      '#Photosynthesis', '#Algebra', '#EssayWriting', '#ClimateChange',
      '#AfricanHistory', '#ProgrammingBasics', '#Chemistry', '#CareerGuidance',
      '#PublicSpeaking', '#FinancialLiteracy',
    ].slice(0, 10)
  }, [trending])

  const autoSuggestions = useMemo(() => {
    if (!searchQuery) return []
    const base = trending?.trending_content.map((c) => c.title) ?? []
    return base
      .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5)
  }, [trending, searchQuery])

  const submit = (term: string) => {
    const t = term.trim()
    if (!t) return
    setSearchQuery(t)
    setCommitted(t)
    setShowSuggestions(false)
    pushRecent(t)
    setRecent(readRecent())
  }

  const clearSearch = () => {
    setSearchQuery('')
    setCommitted('')
    setShowSuggestions(false)
  }

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY)
    setRecent([])
  }

  const isSearching = committed.length > 0

  // Update local recent state when search committed.
  useEffect(() => {
    setRecent(readRecent())
  }, [committed])

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="mb-4 text-xl font-semibold">Search</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(searchQuery)
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search lessons, topics, careers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(e.target.value.length > 0)
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              className="pl-11 pr-11 h-14 bg-input-background border-border rounded-xl text-base"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}

            {showSuggestions && autoSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                {autoSuggestions.map((suggestion, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => submit(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border last:border-0"
                  >
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {!isSearching ? (
          <>
            {/* Trending Topics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Trending Topics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => submit(topic.replace(/^#/, ''))}
                    className="px-5 py-3 bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recent.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">Recent Searches</h3>
                  </div>
                  <button onClick={clearRecent} className="text-sm text-primary hover:underline">
                    Clear all
                  </button>
                </div>
                <div className="space-y-2">
                  {recent.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => submit(term)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-left"
                    >
                      <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Explore by Career */}
            <div>
              <h3 className="mb-4 font-semibold text-lg">Explore by Career</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {careerPaths.map((career) => {
                  const Icon = career.icon
                  return (
                    <Link
                      key={career.id}
                      to={`/student/explore?career=${career.id}`}
                      className={`bg-gradient-to-br ${career.color} text-white rounded-2xl p-6 hover:shadow-lg transition-all active:scale-[0.98] group`}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1 font-semibold">{career.name}</h4>
                          <p className="text-sm opacity-90">{career.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end pt-3 border-t border-white/20">
                        <span className="text-sm opacity-90">Explore →</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Explore by Subject */}
            <div>
              <h3 className="mb-4 font-semibold text-lg">Explore by Subject</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {subjectCards.map((subject) => {
                  const Icon = subject.icon
                  return (
                    <Link
                      key={subject.id}
                      to={`/student/explore?subject=${subject.name}`}
                      className={`border rounded-2xl p-4 hover:shadow-md transition-all active:scale-[0.98] text-center ${subject.color}`}
                    >
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-current/10 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-medium">{subject.name}</h4>
                    </Link>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <SearchResults
            query={committed}
            isFetching={isFetching}
            results={results?.items ?? []}
            total={results?.total ?? 0}
            onClear={clearSearch}
          />
        )}
      </div>
    </div>
  )
}

function SearchResults({
  query,
  isFetching,
  results,
  total,
  onClear,
}: {
  query: string
  isFetching: boolean
  results: Content[]
  total: number
  onClear: () => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {isFetching ? 'Searching…' : `${total} result${total === 1 ? '' : 's'} for "${query}"`}
        </h3>
        <button onClick={onClear} className="text-sm text-muted-foreground hover:text-foreground">
          Clear search
        </button>
      </div>

      {isFetching ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-medium">No results for "{query}"</h3>
          <p className="text-muted-foreground">Try a different keyword.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((item) => {
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
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <Badge variant="secondary" className="text-xs bg-muted border-0">
                        {item.subject}
                      </Badge>
                      <span>{item.grade_level}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {item.likes_count}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
