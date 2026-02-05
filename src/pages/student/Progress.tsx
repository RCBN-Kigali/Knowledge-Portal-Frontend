import { BookOpen, CheckCircle2, TrendingUp, Clock } from 'lucide-react'
import { Card, Skeleton, DataTable } from '../../components/ui'
import { useProgress } from '../../features/student/hooks/useProgress'
import type { StudentProgress } from '../../types'

function Progress() {
  const { data, isLoading } = useProgress()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="card" height="100px" />)}
        </div>
        <Skeleton variant="card" height="300px" />
      </div>
    )
  }

  const overall = data?.overall ?? { enrolledCount: 0, completedCount: 0, averageGrade: 0, totalHours: 0 }
  const courses = data?.courses ?? []
  const gradeHistory = data?.gradeHistory ?? []

  const stats = [
    { icon: BookOpen, label: 'Enrolled', value: String(overall.enrolledCount), color: 'bg-primary-100 text-primary-600' },
    { icon: CheckCircle2, label: 'Completed', value: String(overall.completedCount), color: 'bg-success-100 text-success-600' },
    { icon: TrendingUp, label: 'Avg Grade', value: `${overall.averageGrade}%`, color: 'bg-warning-100 text-warning-600' },
    { icon: Clock, label: 'Total Hours', value: String(overall.totalHours), color: 'bg-purple-100 text-purple-600' },
  ]

  type CourseRow = StudentProgress['courses'][number]
  type GradeRow = StudentProgress['gradeHistory'][number]

  const courseColumns = [
    { key: 'courseTitle', header: 'Course', sortable: true },
    { key: 'progress', header: 'Progress', sortable: true, render: (row: CourseRow) => `${row.progress}%` },
    { key: 'grade', header: 'Grade', sortable: true, render: (row: CourseRow) => row.grade != null ? `${row.grade}%` : '-' },
    { key: 'status', header: 'Status', render: (row: CourseRow) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'completed' ? 'bg-success-100 text-success-700' : 'bg-primary-100 text-primary-700'}`}>
        {row.status === 'completed' ? 'Completed' : 'In Progress'}
      </span>
    )},
  ]

  const gradeColumns = [
    { key: 'lessonTitle', header: 'Lesson', sortable: true },
    { key: 'courseName', header: 'Course' },
    { key: 'type', header: 'Type', render: (row: GradeRow) => <span className="capitalize">{row.type}</span> },
    { key: 'score', header: 'Score', sortable: true, render: (row: GradeRow) => `${row.score}/${row.maxScore}` },
    { key: 'date', header: 'Date', sortable: true, render: (row: GradeRow) => new Date(row.date).toLocaleDateString() },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-500">Track your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Course Progress */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h2>
        {courses.length > 0 ? (
          <DataTable columns={courseColumns} data={courses} />
        ) : (
          <p className="text-gray-500 text-center py-8">No courses enrolled yet</p>
        )}
      </Card>

      {/* Grade History */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade History</h2>
        {gradeHistory.length > 0 ? (
          <DataTable columns={gradeColumns} data={gradeHistory} />
        ) : (
          <p className="text-gray-500 text-center py-8">No grades yet</p>
        )}
      </Card>
    </div>
  )
}

export default Progress
