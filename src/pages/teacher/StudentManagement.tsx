import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTeacherStudents, useEnrollStudent } from '../../features/teacher/hooks/useTeacherStudents'
import { useEnrollmentRequests, useApproveRequest, useRejectRequest } from '../../features/teacher/hooks/useEnrollmentRequests'
import { useTeacherCourses } from '../../features/teacher/hooks/useTeacherCourses'
import StudentTable from '../../features/teacher/components/StudentTable'
import EnrollmentRequestCard from '../../features/teacher/components/EnrollmentRequestCard'
import Card from '../../components/ui/Card'
import Tabs from '../../components/ui/Tabs'
import SearchBar from '../../components/ui/SearchBar'
import Select from '../../components/ui/Select'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import { Users, UserPlus } from 'lucide-react'

type RequestTab = 'pending' | 'approved' | 'rejected'

export default function StudentManagement() {
  const { user } = useAuth()
  const isIndependentTeacher = user?.role === 'independent_teacher'
  
  // School teacher state
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const [studentToEnroll, setStudentToEnroll] = useState<string | null>(null)
  
  // Independent teacher state
  const [requestTab, setRequestTab] = useState<RequestTab>('pending')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [requestToReject, setRequestToReject] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  
  // Queries
  const { data: students, isLoading: studentsLoading } = useTeacherStudents(studentSearch)
  const { data: courses } = useTeacherCourses('approved')
  const { data: enrollmentRequests, isLoading: requestsLoading } = useEnrollmentRequests(requestTab)
  
  // Mutations
  const enrollStudent = useEnrollStudent()
  const approveRequest = useApproveRequest()
  const rejectRequest = useRejectRequest()
  
  const courseOptions = courses?.map(c => ({ value: c.id, label: c.title })) || []
  
  const handleEnrollStudent = async () => {
    if (!studentToEnroll || !selectedCourse) return
    await enrollStudent.mutateAsync({ studentId: studentToEnroll, courseId: selectedCourse })
    setEnrollModalOpen(false)
    setStudentToEnroll(null)
    setSelectedCourse('')
  }
  
  const handleApproveRequest = async (requestId: string) => {
    await approveRequest.mutateAsync(requestId)
  }
  
  const handleRejectRequest = async () => {
    if (!requestToReject) return
    await rejectRequest.mutateAsync({ requestId: requestToReject, reason: rejectReason })
    setRejectModalOpen(false)
    setRequestToReject(null)
    setRejectReason('')
  }
  
  const openEnrollModal = (studentId: string) => {
    setStudentToEnroll(studentId)
    setEnrollModalOpen(true)
  }
  
  const openRejectModal = (requestId: string) => {
    setRequestToReject(requestId)
    setRejectModalOpen(true)
  }
  
  // Independent Teacher View - Enrollment Requests
  if (isIndependentTeacher) {
    const requestTabs = [
      { id: 'pending', label: 'Pending' },
      { id: 'approved', label: 'Approved' },
      { id: 'rejected', label: 'Rejected' },
    ]
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollment Requests</h1>
          <p className="text-gray-600 mt-1">
            Review and manage student enrollment requests for your courses
          </p>
        </div>
        
        {/* Info Banner */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-800">
            Students must request enrollment in your courses. Review each request and approve or reject based on their profile.
          </p>
        </div>
        
        {/* Tabs */}
        <Tabs
          tabs={requestTabs}
          activeTab={requestTab}
          onChange={(id) => setRequestTab(id as RequestTab)}
        />
        
        {/* Requests List */}
        {requestsLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : enrollmentRequests && enrollmentRequests.length > 0 ? (
          <div className="space-y-4">
            {enrollmentRequests.map(request => (
              <EnrollmentRequestCard
                key={request.id}
                request={request}
                onApprove={() => handleApproveRequest(request.id)}
                onReject={() => openRejectModal(request.id)}
                loading={approveRequest.isPending}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UserPlus}
            title={`No ${requestTab} requests`}
            description={
              requestTab === 'pending'
                ? 'New enrollment requests will appear here'
                : `You have no ${requestTab} requests`
            }
          />
        )}
        
        {/* Reject Modal */}
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Enrollment Request"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a reason for rejecting this enrollment request (optional).
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectRequest}
                loading={rejectRequest.isPending}
              >
                Reject Request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
  
  // School Teacher View - Student List
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600 mt-1">
          View and manage students in your school
        </p>
      </div>
      
      {/* Search */}
      <Card>
        <Card.Body>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={studentSearch}
                onChange={setStudentSearch}
                placeholder="Search students by name or email..."
              />
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Student Table */}
      {studentsLoading ? (
        <Skeleton className="h-96" />
      ) : students && students.length > 0 ? (
        <StudentTable
          students={students}
          onEnroll={openEnrollModal}
        />
      ) : (
        <EmptyState
          icon={Users}
          title={studentSearch ? 'No students found' : 'No students yet'}
          description={studentSearch ? 'Try adjusting your search' : 'Students in your school will appear here'}
        />
      )}
      
      {/* Enroll Modal */}
      <Modal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title="Enroll Student in Course"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Select a course to enroll this student in.
          </p>
          <Select
            value={selectedCourse}
            onChange={setSelectedCourse}
            options={[{ value: '', label: 'Select a course...' }, ...courseOptions]}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEnrollStudent}
              disabled={!selectedCourse}
              loading={enrollStudent.isPending}
            >
              Enroll Student
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
