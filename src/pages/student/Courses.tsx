import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Search, Filter, BookOpen, Clock } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'

const subjects = [
  { id: 'all', label: 'All', color: 'bg-muted text-foreground' },
  { id: 'math', label: 'Math', color: 'bg-primary/10 text-primary' },
  { id: 'science', label: 'Science', color: 'bg-secondary/10 text-secondary' },
  { id: 'english', label: 'English', color: 'bg-accent/10 text-accent' },
  { id: 'history', label: 'History', color: 'bg-purple-100 text-purple-700' },
]

const courses = [
  {
    id: 'math-101',
    title: 'Mathematics Grade 7',
    subject: 'math',
    description: 'Algebra, geometry, and problem solving',
    icon: '📐',
    lessons: 24,
    students: 1250,
    duration: '8 weeks',
    progress: 65,
  },
  {
    id: 'science-101',
    title: 'Life Sciences',
    subject: 'science',
    description: 'Biology, ecosystems, and living organisms',
    icon: '🔬',
    lessons: 20,
    students: 980,
    duration: '6 weeks',
    progress: 30,
  },
  {
    id: 'english-101',
    title: 'English Language',
    subject: 'english',
    description: 'Reading, writing, and comprehension',
    icon: '📚',
    lessons: 18,
    students: 1500,
    duration: '10 weeks',
    progress: 0,
  },
  {
    id: 'history-101',
    title: 'World History',
    subject: 'history',
    description: 'Ancient civilizations to modern times',
    icon: '🌍',
    lessons: 16,
    students: 750,
    duration: '7 weeks',
    progress: 0,
  },
  {
    id: 'math-102',
    title: 'Advanced Mathematics',
    subject: 'math',
    description: 'Trigonometry and calculus basics',
    icon: '🧮',
    lessons: 28,
    students: 650,
    duration: '10 weeks',
    progress: 0,
  },
  {
    id: 'science-102',
    title: 'Physical Sciences',
    subject: 'science',
    description: 'Physics, chemistry, and matter',
    icon: '⚗️',
    lessons: 22,
    students: 820,
    duration: '8 weeks',
    progress: 0,
  },
]

export default function Courses() {
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = courses.filter((course) => {
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSubject && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="mb-4 text-xl font-semibold">Courses</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border rounded-xl h-12"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                selectedSubject === subject.id
                  ? subject.color + ' shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {subject.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
          <button className="flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/student/courses/${course.id}`}
              className="bg-card border border-border rounded-2xl overflow-hidden transition-all hover:shadow-lg active:scale-95"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-3xl">
                    {course.icon}
                  </div>
                  {course.progress > 0 && (
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">
                      {course.progress}%
                    </Badge>
                  )}
                </div>
                <h3 className="mb-2 line-clamp-1 font-semibold">{course.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
              {course.progress > 0 && (
                <div className="h-1 bg-muted">
                  <div className="h-full bg-secondary transition-all" style={{ width: `${course.progress}%` }} />
                </div>
              )}
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">📚</div>
            <h3 className="mb-2 font-medium">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium">Coming soon</p>
          <p className="text-xs mt-1">
            Structured courses with progress tracking are being built. Sample courses shown for preview.
          </p>
        </div>
      </div>
    </div>
  )
}
