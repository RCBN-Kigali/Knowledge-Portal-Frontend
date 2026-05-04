import { Link } from 'react-router-dom'
import { BookOpen, Library as LibraryIcon, TrendingUp, ArrowLeft } from 'lucide-react'

const sections = [
  {
    path: '/student/courses',
    icon: BookOpen,
    label: 'My Courses',
    description: 'View all your enrolled courses',
    color: 'from-primary to-primary/80',
  },
  {
    path: '/student/library',
    icon: LibraryIcon,
    label: 'Library',
    description: 'Resources and saved content',
    color: 'from-secondary to-secondary/80',
  },
  {
    path: '/student/progress',
    icon: TrendingUp,
    label: 'Progress',
    description: 'Track your learning journey',
    color: 'from-accent to-accent/80',
  },
] as const

export default function MyLearning() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/student/profile"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to profile</span>
          </Link>
          <h2 className="text-xl font-semibold">My Learning</h2>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Link
              key={section.path}
              to={section.path}
              className={`block bg-gradient-to-br ${section.color} text-white rounded-2xl p-6 transition-all hover:shadow-lg active:scale-[0.98]`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-xl font-semibold">{section.label}</h3>
                  <p className="text-sm opacity-90">{section.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
