import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTeacherCourses, useDeleteCourse } from '../../features/teacher/hooks/useTeacherCourses'
import CourseCard from '../../features/teacher/components/CourseCard'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import SearchBar from '../../components/ui/SearchBar'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import type { CourseStatus, TeacherCourse } from '../../types'
import { Plus, BookOpen } from 'lucide-react'

type TabValue = 'all' | CourseStatus

export default function MyCourses() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [search, setSearch] = useState('')
  const [courseToDelete, setCourseToDelete] = useState<TeacherCourse | null>(null)
  
  const statusFilter = activeTab === 'all' ? undefined : activeTab
  const { data: courses, isLoading } = useTeacherCourses(statusFilter)
  const deleteMutation = useDeleteCourse()
  
  const isIndependentTeacher = user?.role === 'independent_teacher'
  
  const tabs = [
    { id: 'all', label: 'All Courses' },
    { id: 'draft', label: 'Drafts' },
    { id: 'pending', label: 'Pending Review' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ]
  
  const filteredCourses = courses?.filter(course => {
    if (!search) return true
    return course.title.toLowerCase().includes(search.toLowerCase()) ||
           course.description?.toLowerCase().includes(search.toLowerCase())
  })
  
  const handleDelete = async () => {
    if (!courseToDelete) return
    await deleteMutation.mutateAsync(courseToDelete.id)
    setCourseToDelete(null)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage your courses and track their approval status
          </p>
        </div>
        <Link to="/teacher/courses/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create Course
          </Button>
        </Link>
      </div>
      
      {/* Info Banner for Independent Teachers */}
      {isIndependentTeacher && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-800">
            <strong>Note:</strong> As an independent teacher, your courses are public and require Super Admin approval before becoming visible to students.
          </p>
        </div>
      )}
      
      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabValue)}
        />
        <div className="w-full sm:w-64">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search courses..."
          />
        </div>
      </div>
      
      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={() => setCourseToDelete(course)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={search ? 'No courses found' : 'No courses yet'}
          description={search ? 'Try adjusting your search' : 'Create your first course to get started'}
          actionLabel={!search ? 'Create Course' : undefined}
          onAction={!search ? () => window.location.href = '/teacher/courses/new' : undefined}
        />
      )}
      
      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
