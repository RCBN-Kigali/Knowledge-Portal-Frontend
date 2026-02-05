import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSubmissions, useSubmission, useGradeSubmission } from '../../features/teacher/hooks/useSubmissions'
import { useTeacherCourses } from '../../features/teacher/hooks/useTeacherCourses'
import GradingPanel from '../../features/teacher/components/GradingPanel'
import Card from '../../components/ui/Card'
import Tabs from '../../components/ui/Tabs'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { FileText } from 'lucide-react'

type StatusTab = 'pending' | 'graded'

export default function Submissions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('id')
  
  const [statusTab, setStatusTab] = useState<StatusTab>('pending')
  const [courseFilter, setCourseFilter] = useState<string>('')
  
  // Queries
  const { data: submissions, isLoading: submissionsLoading } = useSubmissions({
    courseId: courseFilter || undefined,
    status: statusTab,
  })
  const { data: selectedSubmission, isLoading: submissionLoading } = useSubmission(selectedId || undefined)
  const { data: courses } = useTeacherCourses('approved')
  
  // Mutations
  const gradeSubmission = useGradeSubmission()
  
  const courseOptions = [
    { value: '', label: 'All Courses' },
    ...(courses?.map(c => ({ value: c.id, label: c.title })) || []),
  ]
  
  const tabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'graded', label: 'Graded' },
  ]
  
  const handleSelectSubmission = (id: string) => {
    setSearchParams({ id })
  }
  
  const handleGrade = async (score: number, feedback?: string) => {
    if (!selectedId) return
    await gradeSubmission.mutateAsync({ submissionId: selectedId, score, feedback })
    setSearchParams({})
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
        <p className="text-gray-600 mt-1">
          Review and grade student submissions
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3">
            <Tabs
              tabs={tabs}
              activeTab={statusTab}
              onChange={(id) => setStatusTab(id as StatusTab)}
            />
            <Select
              value={courseFilter}
              onChange={setCourseFilter}
              options={courseOptions}
            />
          </div>
          
          {/* Submissions */}
          <Card>
            <Card.Body className="p-0">
              {submissionsLoading ? (
                <div className="p-4 space-y-3">
                  {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16" />)}
                </div>
              ) : submissions && submissions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {submissions.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubmission(sub.id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedId === sub.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{sub.studentName}</p>
                          <p className="text-sm text-gray-500 truncate">{sub.assignmentTitle}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(sub.submittedAt)}</p>
                        </div>
                        {sub.status === 'graded' ? (
                          <Badge variant="success" size="sm">
                            {sub.score}/{sub.maxScore}
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">Pending</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8">
                  <EmptyState
                    icon={FileText}
                    title={`No ${statusTab} submissions`}
                    description={statusTab === 'pending' ? 'New submissions will appear here' : 'Graded submissions will appear here'}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
        
        {/* Grading Panel */}
        <div className="lg:col-span-2">
          {selectedId ? (
            submissionLoading ? (
              <Skeleton className="h-96" />
            ) : selectedSubmission ? (
              <GradingPanel
                submission={selectedSubmission}
                onGrade={handleGrade}
                loading={gradeSubmission.isPending}
              />
            ) : (
              <Card>
                <Card.Body>
                  <EmptyState
                    title="Submission not found"
                    description="The selected submission could not be loaded"
                  />
                </Card.Body>
              </Card>
            )
          ) : (
            <Card>
              <Card.Body className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a submission to review</p>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
