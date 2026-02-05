import { Search } from 'lucide-react'
import { SearchBar, Card, Badge, EmptyState } from '../../components/ui'

function PublicCatalog() {
  // Placeholder - will be replaced with actual API call
  const courses: unknown[] = []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Courses</h1>
        <p className="text-gray-600">
          Explore courses from independent teachers available to everyone
        </p>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Search courses..." />
      </div>

      {courses.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={Search}
            title="No courses found"
            description="Check back soon for new courses from our independent teachers"
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course cards will go here */}
        </div>
      )}
    </div>
  )
}

export default PublicCatalog
