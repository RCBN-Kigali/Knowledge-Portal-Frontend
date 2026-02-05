import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { SearchBar, Tabs, Skeleton, Card, EmptyState, Pagination } from '../../components/ui'
import CourseCard from '../../features/student/components/CourseCard'
import { useCourses, useEnroll } from '../../features/student/hooks/useCourses'
import { useEnrollments } from '../../features/student/hooks/useEnrollments'
import type { CourseCategory, DifficultyLevel } from '../../types'

const categories: { value: CourseCategory | ''; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'languages', label: 'Languages' },
  { value: 'arts', label: 'Arts' },
  { value: 'technology', label: 'Technology' },
  { value: 'social_studies', label: 'Social Studies' },
  { value: 'health', label: 'Health' },
  { value: 'agriculture', label: 'Agriculture' },
]

const difficulties: { value: DifficultyLevel | ''; label: string }[] = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

function BrowseCourses() {
  const [activeTab, setActiveTab] = useState<'all' | 'school' | 'public'>('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CourseCategory | ''>('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel | ''>('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useCourses({
    tab: activeTab,
    search: search || undefined,
    category: category || undefined,
    difficulty: difficulty || undefined,
    page,
    perPage: 12,
  })

  const { data: enrollments } = useEnrollments()
  const enrolledCourseIds = new Set(enrollments?.map(e => e.courseId) || [])

  const courses = data?.data ?? []
  const pagination = data?.pagination

  const tabs = [
    { id: 'all', label: 'All Courses' },
    { id: 'school', label: 'My School' },
    { id: 'public', label: 'Public' },
  ]

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'all' | 'school' | 'public')
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Courses</h1>
        <p className="text-gray-500">Discover courses and start learning</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search courses..."
            value={search}
            onChange={handleSearch}
            debounceMs={400}
          />
        </div>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value as CourseCategory | ''); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          value={difficulty}
          onChange={e => { setDifficulty(e.target.value as DifficultyLevel | ''); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {difficulties.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} variant="card" />)}
        </div>
      ) : courses.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={Search}
            title="No courses found"
            description={search ? 'Try a different search term' : activeTab === 'school' ? 'No courses from your school yet' : 'No courses available'}
          />
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                linkPrefix="/student/courses"
                enrollmentStatus={enrolledCourseIds.has(course.id) ? 'enrolled' : 'not_enrolled'}
              />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              totalItems={pagination.total}
            />
          )}
        </>
      )}
    </div>
  )
}

export default BrowseCourses
