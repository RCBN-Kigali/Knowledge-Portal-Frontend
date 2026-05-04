import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Headphones,
  FileText,
  Heart,
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
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { discoveryApi } from '../../api/discovery'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import type { Content, ContentType } from '../../types'

const careerData: Record<string, { name: string; icon: any; color: string; description: string; pathways: string[] }> = {
  medicine: {
    name: 'Medicine & Healthcare',
    icon: Stethoscope,
    color: 'from-rose-400 to-pink-500',
    description: 'Explore careers in medicine, nursing, pharmacy, and healthcare',
    pathways: ['Doctor', 'Nurse', 'Pharmacist', 'Dentist', 'Physiotherapist'],
  },
  engineering: {
    name: 'Engineering',
    icon: Cog,
    color: 'from-orange-400 to-amber-500',
    description: 'Discover opportunities in civil, mechanical, electrical, and chemical engineering',
    pathways: ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Chemical Engineer'],
  },
  technology: {
    name: 'Technology & IT',
    icon: Laptop,
    color: 'from-blue-400 to-indigo-500',
    description: 'Learn about software development, data science, and cybersecurity careers',
    pathways: ['Software Developer', 'Data Scientist', 'Cybersecurity Analyst', 'Web Developer'],
  },
  teaching: {
    name: 'Education & Teaching',
    icon: BookOpen,
    color: 'from-green-400 to-emerald-500',
    description: 'Become an educator and shape the next generation',
    pathways: ['Primary Teacher', 'Secondary Teacher', 'Professor', 'Education Administrator'],
  },
  law: {
    name: 'Law & Justice',
    icon: Scale,
    color: 'from-purple-400 to-violet-500',
    description: 'Pursue a career in law, justice, and legal services',
    pathways: ['Lawyer', 'Judge', 'Paralegal', 'Legal Advisor'],
  },
  arts: {
    name: 'Creative Arts',
    icon: Palette,
    color: 'from-pink-400 to-rose-500',
    description: 'Express yourself through design, music, writing, and visual arts',
    pathways: ['Graphic Designer', 'Musician', 'Writer', 'Art Director'],
  },
}

const subjectData: Record<string, { name: string; icon: any; color: string; description: string; topics: string[] }> = {
  science: {
    name: 'Science',
    icon: FlaskConical,
    color: 'from-secondary to-secondary/80',
    description: 'Explore biology, chemistry, physics, and earth science',
    topics: ['Biology', 'Chemistry', 'Physics', 'Environmental Science'],
  },
  math: {
    name: 'Mathematics',
    icon: Calculator,
    color: 'from-primary to-primary/80',
    description: 'From basic arithmetic to advanced calculus and statistics',
    topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
  },
  english: {
    name: 'English',
    icon: BookOpen,
    color: 'from-purple-400 to-purple-600',
    description: 'Improve your reading, writing, and communication skills',
    topics: ['Literature', 'Grammar', 'Creative Writing', 'Essay Writing'],
  },
  history: {
    name: 'History',
    icon: History,
    color: 'from-amber-400 to-amber-600',
    description: 'Learn about world history, civilizations, and important events',
    topics: ['World History', 'African History', 'Modern History', 'Ancient Civilizations'],
  },
  geography: {
    name: 'Geography',
    icon: Globe,
    color: 'from-teal-400 to-teal-600',
    description: 'Study places, environments, and human-environment interactions',
    topics: ['Physical Geography', 'Human Geography', 'Climate', 'Maps'],
  },
  languages: {
    name: 'Languages',
    icon: Languages,
    color: 'from-indigo-400 to-indigo-600',
    description: 'Learn new languages and improve communication skills',
    topics: ['French', 'Swahili', 'Spanish', 'Language Basics'],
  },
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

function formatDuration(content: Content): string | null {
  if (content.content_type === 'article') {
    const words = content.description.trim().split(/\s+/).length
    const minutes = Math.max(1, Math.round(words / 200))
    return `${minutes} min read`
  }
  if (content.duration_minutes == null) return null
  const m = Math.floor(content.duration_minutes)
  const s = Math.round((content.duration_minutes - m) * 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function CareerExplorer() {
  const [searchParams] = useSearchParams()
  const careerId = searchParams.get('career')
  const subjectId = searchParams.get('subject')

  const isCareer = !!careerId
  const meta = isCareer
    ? careerData[careerId ?? ''] ?? careerData.medicine
    : subjectData[(subjectId ?? '').toLowerCase()] ?? subjectData.science

  const itemsLabel = isCareer ? 'Career Pathways' : 'Topics'
  const items = isCareer ? (meta as typeof careerData.medicine).pathways : (meta as typeof subjectData.science).topics
  const Icon = meta.icon

  // Backend filters by `subject` only, so for careers we use 'Career' category;
  // for subjects we map the human label to the backend category.
  const filterSubject = isCareer ? 'Career' : subjectId ?? 'Science'

  const { data: feed, isLoading } = useQuery({
    queryKey: ['explore', filterSubject],
    queryFn: () => discoveryApi.explore({ subject: filterSubject, limit: 20 }),
  })

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/student/search"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to search</span>
          </Link>
        </div>
      </header>

      <div className={`bg-gradient-to-br ${meta.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Icon className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h1 className="mb-3 text-3xl sm:text-4xl font-semibold">{meta.name}</h1>
              <p className="text-lg opacity-90 mb-4">{meta.description}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-white font-semibold">{itemsLabel}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <div
                  key={item}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h3 className="mb-4 font-semibold text-lg">Related Lessons & Resources</h3>
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
                        {thumbnailFor(item)}
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
                            <Badge key={String(tag)} variant="secondary" className="text-xs bg-muted border-0">
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
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-muted-foreground">No related lessons yet for this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
