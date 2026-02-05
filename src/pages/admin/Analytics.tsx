import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAdminAnalytics, useSuperAdminAnalytics } from '../../features/admin/hooks/useAdminAnalytics'
import Card from '../../components/ui/Card'
import Tabs from '../../components/ui/Tabs'
import Select from '../../components/ui/Select'
import Skeleton from '../../components/ui/Skeleton'
import ProgressBar from '../../components/ui/ProgressBar'
import { Users, BookOpen, GraduationCap, TrendingUp, Award, Clock } from 'lucide-react'

type TimeRange = '7d' | '30d' | '90d' | '1y'

export default function Analytics() {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'
  
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [activeTab, setActiveTab] = useState('overview')
  
  const { data: adminAnalytics, isLoading: adminLoading } = useAdminAnalytics(timeRange)
  const { data: superAdminAnalytics, isLoading: superAdminLoading } = useSuperAdminAnalytics(timeRange)
  
  const analytics = isSuperAdmin ? superAdminAnalytics : adminAnalytics
  const isLoading = isSuperAdmin ? superAdminLoading : adminLoading
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'courses', label: 'Courses' },
    { id: 'engagement', label: 'Engagement' },
  ]
  
  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ]
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            {isSuperAdmin 
              ? 'System-wide analytics and insights'
              : 'Your school\'s analytics and insights'}
          </p>
        </div>
        <Select
          value={timeRange}
          onChange={(val) => setTimeRange(val as TimeRange)}
          options={timeRangeOptions}
          className="w-40"
        />
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalUsers || 0}</p>
                <p className="text-sm text-gray-500">Total Users</p>
                {analytics?.userGrowth !== undefined && (
                  <p className={`text-xs ${analytics.userGrowth >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {analytics.userGrowth >= 0 ? '+' : ''}{analytics.userGrowth}% from last period
                  </p>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalCourses || 0}</p>
                <p className="text-sm text-gray-500">Active Courses</p>
                {analytics?.courseGrowth !== undefined && (
                  <p className={`text-xs ${analytics.courseGrowth >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {analytics.courseGrowth >= 0 ? '+' : ''}{analytics.courseGrowth}% from last period
                  </p>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalEnrollments || 0}</p>
                <p className="text-sm text-gray-500">Enrollments</p>
                {analytics?.enrollmentGrowth !== undefined && (
                  <p className={`text-xs ${analytics.enrollmentGrowth >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {analytics.enrollmentGrowth >= 0 ? '+' : ''}{analytics.enrollmentGrowth}% from last period
                  </p>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{analytics?.completionRate || 0}%</p>
                <p className="text-sm text-gray-500">Completion Rate</p>
                {analytics?.completionChange !== undefined && (
                  <p className={`text-xs ${analytics.completionChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {analytics.completionChange >= 0 ? '+' : ''}{analytics.completionChange}% from last period
                  </p>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Courses */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">Top Courses by Enrollment</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {analytics?.topCourses?.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.enrollments} enrollments</p>
                    </div>
                    <div className="w-24">
                      <ProgressBar value={course.completionRate} size="sm" />
                      <p className="text-xs text-gray-500 text-right mt-1">{course.completionRate}% complete</p>
                    </div>
                  </div>
                ))}
                {(!analytics?.topCourses || analytics.topCourses.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No course data available</p>
                )}
              </div>
            </Card.Body>
          </Card>
          
          {/* Activity Summary */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">Activity Summary</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Avg. Time per Session</span>
                  </div>
                  <span className="font-medium">{analytics?.avgSessionTime || 0} min</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Daily Active Users</span>
                  </div>
                  <span className="font-medium">{analytics?.dailyActiveUsers || 0}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Lessons Completed</span>
                  </div>
                  <span className="font-medium">{analytics?.lessonsCompleted || 0}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Certificates Issued</span>
                  </div>
                  <span className="font-medium">{analytics?.certificatesIssued || 0}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Distribution */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">User Distribution</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {analytics?.usersByRole?.map(item => (
                  <div key={item.role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 capitalize">{item.role.replace('_', ' ')}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <ProgressBar 
                      value={(item.count / (analytics.totalUsers || 1)) * 100} 
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          
          {/* Registration Trends */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">New Registrations</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {analytics?.registrationTrends?.map(item => (
                  <div key={item.date} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="text-gray-700">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((item.count / 20) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
      
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Courses by Category */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">Courses by Category</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {analytics?.coursesByCategory?.map(item => (
                  <div key={item.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.category}</span>
                      <span className="font-medium">{item.count} courses</span>
                    </div>
                    <ProgressBar 
                      value={(item.count / (analytics.totalCourses || 1)) * 100} 
                      size="sm"
                      variant={item.count > 5 ? 'success' : 'primary'}
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          
          {/* Course Status */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">Course Status</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {analytics?.coursesByStatus?.map(item => (
                  <div key={item.status} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'published' ? 'bg-success-500' :
                        item.status === 'draft' ? 'bg-gray-400' :
                        item.status === 'pending' ? 'bg-warning-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-gray-700 capitalize">{item.status}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
      
      {activeTab === 'engagement' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Metrics */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">Engagement Metrics</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Average Quiz Score</span>
                    <span className="font-medium">{analytics?.avgQuizScore || 0}%</span>
                  </div>
                  <ProgressBar value={analytics?.avgQuizScore || 0} variant="success" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Assignment Submission Rate</span>
                    <span className="font-medium">{analytics?.assignmentSubmissionRate || 0}%</span>
                  </div>
                  <ProgressBar value={analytics?.assignmentSubmissionRate || 0} variant="primary" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Video Completion Rate</span>
                    <span className="font-medium">{analytics?.videoCompletionRate || 0}%</span>
                  </div>
                  <ProgressBar value={analytics?.videoCompletionRate || 0} variant="warning" />
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {/* Peak Activity Times */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">Peak Activity Times</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                {analytics?.peakTimes?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-gray-700">{item.time}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  )
}
