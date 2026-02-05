import { useParams, Link } from 'react-router-dom'
import { useTeacherCourse } from '../../features/teacher/hooks/useTeacherCourses'
import { useCourseAnalytics } from '../../features/teacher/hooks/useCourseAnalytics'
import SimpleStatsCard from '../../features/teacher/components/SimpleStatsCard'
import ProgressBarChart from '../../features/teacher/components/ProgressBarChart'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { Users, TrendingUp, FileText, CheckCircle, ArrowLeft, BarChart3 } from 'lucide-react'

export default function CourseAnalytics() {
  const { courseId } = useParams()
  
  const { data: course, isLoading: courseLoading } = useTeacherCourse(courseId)
  const { data: analytics, isLoading: analyticsLoading } = useCourseAnalytics(courseId)
  
  if (courseLoading || analyticsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }
  
  if (!course || !analytics) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Course not found"
        description="The course you're looking for doesn't exist or you don't have access to it."
        actionLabel="Back to Courses"
        onAction={() => window.location.href = '/teacher/courses'}
      />
    )
  }
  
  const moduleData = analytics.moduleCompletion.map(m => ({
    label: m.moduleTitle,
    value: m.completionRate,
  }))
  
  const quizData = analytics.quizScores.map(q => ({
    label: q.quizTitle,
    value: q.averageScore,
  }))
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/teacher/courses">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600">Course Analytics</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SimpleStatsCard
          title="Enrolled Students"
          value={analytics.enrolledCount}
          icon={<Users className="w-5 h-5" />}
        />
        <SimpleStatsCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          trend={analytics.completionRate >= 50 
            ? { value: analytics.completionRate, label: 'on track', isPositive: true }
            : { value: analytics.completionRate, label: 'needs attention', isPositive: false }
          }
        />
        <SimpleStatsCard
          title="Average Score"
          value={`${analytics.averageScore}%`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <SimpleStatsCard
          title="Assignment Submission"
          value={`${analytics.assignmentSubmissionRate}%`}
          icon={<FileText className="w-5 h-5" />}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Completion */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">Module Completion Rates</h2>
          </Card.Header>
          <Card.Body>
            {moduleData.length > 0 ? (
              <ProgressBarChart
                data={moduleData}
                color="primary"
              />
            ) : (
              <EmptyState
                title="No module data"
                description="Module completion data will appear here once students start learning"
              />
            )}
          </Card.Body>
        </Card>
        
        {/* Quiz Scores */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">Average Quiz Scores</h2>
          </Card.Header>
          <Card.Body>
            {quizData.length > 0 ? (
              <ProgressBarChart
                data={quizData}
                color="success"
              />
            ) : (
              <EmptyState
                title="No quiz data"
                description="Quiz scores will appear here once students complete quizzes"
              />
            )}
          </Card.Body>
        </Card>
      </div>
      
      {/* Summary */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Performance Summary</h2>
        </Card.Header>
        <Card.Body>
          <div className="prose prose-sm max-w-none">
            <p>
              This course has <strong>{analytics.enrolledCount} enrolled students</strong> with an overall
              completion rate of <strong>{analytics.completionRate}%</strong>.
            </p>
            {analytics.completionRate < 50 && (
              <p className="text-warning-600">
                Consider reaching out to students who haven't completed the first modules.
                Early engagement is key to course completion.
              </p>
            )}
            {analytics.averageScore >= 80 && (
              <p className="text-success-600">
                Students are performing well with an average score of {analytics.averageScore}%.
                Great job creating effective learning content!
              </p>
            )}
            {analytics.assignmentSubmissionRate < 70 && (
              <p className="text-warning-600">
                Assignment submission rate is at {analytics.assignmentSubmissionRate}%.
                Consider sending reminders about upcoming deadlines.
              </p>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
