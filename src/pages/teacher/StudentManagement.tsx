import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  useEnrolledStudents, 
  useNonEnrolledStudents, 
  useIndependentTeacherStudents,
  useEnrollStudents,
  type EnrolledStudent,
  type SchoolStudent,
  type IndependentTeacherStudent,
} from '../../features/teacher/hooks/useTeacherStudents'
import { useEnrollmentRequests, useApproveRequest, useRejectRequest } from '../../features/teacher/hooks/useEnrollmentRequests'
import { useTeacherCourses } from '../../features/teacher/hooks/useTeacherCourses'
import EnrollStudentModal from '../../features/teacher/components/EnrollStudentModal'
import Card from '../../components/ui/Card'
import Tabs from '../../components/ui/Tabs'
import SearchBar from '../../components/ui/SearchBar'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Checkbox from '../../components/ui/Checkbox'
import ProgressBar from '../../components/ui/ProgressBar'
import { Users, UserPlus, Check, X, Clock, BookOpen } from 'lucide-react'

type SchoolTeacherTab = 'enrolled' | 'not-enrolled'
type IndependentTeacherTab = 'students' | 'requests'

export default function StudentManagement() {
  const { user } = useAuth()
  const isIndependentTeacher = user?.role === 'independent_teacher'
  
  // Tab state
  const [schoolTab, setSchoolTab] = useState<SchoolTeacherTab>('enrolled')
  const [independentTab, setIndependentTab] = useState<IndependentTeacherTab>('students')
  
  // Search state
  const [enrolledSearch, setEnrolledSearch] = useState('')
  const [nonEnrolledSearch, setNonEnrolledSearch] = useState('')
  const [independentSearch, setIndependentSearch] = useState('')
  
  // Selection state for bulk actions
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  
  // Modal state
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const [studentToEnroll, setStudentToEnroll] = useState<SchoolStudent | null>(null)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [requestToReject, setRequestToReject] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [studentDetailOpen, setStudentDetailOpen] = useState(false)
  const [selectedEnrolledStudent, setSelectedEnrolledStudent] = useState<EnrolledStudent | null>(null)
  
  // Queries
  const { data: enrolledStudents, isLoading: enrolledLoading } = useEnrolledStudents(enrolledSearch)
  const { data: nonEnrolledStudents, isLoading: nonEnrolledLoading } = useNonEnrolledStudents(nonEnrolledSearch)
  const { data: independentStudents, isLoading: independentLoading } = useIndependentTeacherStudents(independentSearch)
  const { data: enrollmentRequests, isLoading: requestsLoading } = useEnrollmentRequests('pending')
  const { data: courses } = useTeacherCourses('approved')
  
  // Mutations
  const enrollStudents = useEnrollStudents()
  const approveRequest = useApproveRequest()
  const rejectRequest = useRejectRequest()
  
  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }
  
  // Select all students
  const toggleSelectAll = (students: SchoolStudent[]) => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(students.map(s => s.id)))
    }
  }
  
  // Enroll handlers
  const handleOpenEnrollModal = (student?: SchoolStudent) => {
    setStudentToEnroll(student || null)
    setEnrollModalOpen(true)
  }
  
  const handleEnroll = async (courseIds: string[]) => {
    const studentIds = studentToEnroll 
      ? [studentToEnroll.id] 
      : Array.from(selectedStudents)
    
    await enrollStudents.mutateAsync({ studentIds, courseIds })
    setEnrollModalOpen(false)
    setStudentToEnroll(null)
    setSelectedStudents(new Set())
  }
  
  // Request handlers
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
  
  // View student detail
  const handleViewStudent = (student: EnrolledStudent) => {
    setSelectedEnrolledStudent(student)
    setStudentDetailOpen(true)
  }
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const formatLastActive = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // ==================== INDEPENDENT TEACHER VIEW ====================
  if (isIndependentTeacher) {
    const tabs = [
      { id: 'students', label: 'My Students' },
      { id: 'requests', label: `Enrollment Requests${enrollmentRequests?.length ? ` (${enrollmentRequests.length})` : ''}` },
    ]
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your students and enrollment requests
          </p>
        </div>
        
        <Tabs
          tabs={tabs}
          activeTab={independentTab}
          onChange={(id) => setIndependentTab(id as IndependentTeacherTab)}
        />
        
        {/* My Students Tab */}
        {independentTab === 'students' && (
          <div className="space-y-4">
            <Card>
              <Card.Body>
                <SearchBar
                  value={independentSearch}
                  onChange={setIndependentSearch}
                  placeholder="Search by name, email, or school..."
                />
              </Card.Body>
            </Card>
            
            {independentLoading ? (
              <Skeleton className="h-96" />
            ) : independentStudents && independentStudents.length > 0 ? (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">School</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Course</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Progress</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {independentStudents.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={student.name} size="sm" />
                              <div>
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-500">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{student.schoolName}</td>
                          <td className="py-3 px-4 text-gray-600">{student.courseName}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <ProgressBar value={student.progress} size="sm" className="w-20" />
                              <span className="text-sm text-gray-600">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatLastActive(student.lastActiveAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={Users}
                title={independentSearch ? 'No students found' : 'No students yet'}
                description={independentSearch ? 'Try adjusting your search' : 'Students will appear here once they enroll in your courses'}
              />
            )}
          </div>
        )}
        
        {/* Enrollment Requests Tab */}
        {independentTab === 'requests' && (
          <div className="space-y-4">
            {requestsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
              </div>
            ) : enrollmentRequests && enrollmentRequests.length > 0 ? (
              enrollmentRequests.map(request => (
                <Card key={request.id}>
                  <Card.Body>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar name={request.studentName} size="md" />
                        <div>
                          <h3 className="font-medium text-gray-900">{request.studentName}</h3>
                          <p className="text-sm text-gray-500">{request.studentEmail}</p>
                          <p className="text-sm text-gray-500">{request.studentSchool}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{request.courseName}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Requested {formatDate(request.requestedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setRequestToReject(request.id)
                            setRejectModalOpen(true)
                          }}
                          leftIcon={<X className="w-4 h-4" />}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(request.id)}
                          loading={approveRequest.isPending}
                          leftIcon={<Check className="w-4 h-4" />}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <EmptyState
                icon={UserPlus}
                title="No pending requests"
                description="New enrollment requests will appear here"
              />
            )}
          </div>
        )}
        
        {/* Reject Modal */}
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Enrollment Request"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a reason for rejecting this request (optional).
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

  // ==================== SCHOOL TEACHER VIEW ====================
  const schoolTabs = [
    { id: 'enrolled', label: 'Enrolled' },
    { id: 'not-enrolled', label: 'Not Enrolled' },
  ]
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600 mt-1">
          Manage students enrolled in your courses
        </p>
      </div>
      
      <Tabs
        tabs={schoolTabs}
        activeTab={schoolTab}
        onChange={(id) => {
          setSchoolTab(id as SchoolTeacherTab)
          setSelectedStudents(new Set())
        }}
      />
      
      {/* Enrolled Tab */}
      {schoolTab === 'enrolled' && (
        <div className="space-y-4">
          <Card>
            <Card.Body>
              <SearchBar
                value={enrolledSearch}
                onChange={setEnrolledSearch}
                placeholder="Search by name or email..."
              />
            </Card.Body>
          </Card>
          
          {enrolledLoading ? (
            <Skeleton className="h-96" />
          ) : enrolledStudents && enrolledStudents.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Enrolled Courses</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Progress</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {enrolledStudents.map(student => (
                      <tr 
                        key={student.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewStudent(student)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.name} size="sm" />
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {student.enrolledCourses.slice(0, 2).map(course => (
                              <Badge key={course.id} variant="gray" size="sm">
                                {course.title.length > 20 ? course.title.slice(0, 20) + '...' : course.title}
                              </Badge>
                            ))}
                            {student.enrolledCourses.length > 2 && (
                              <Badge variant="gray" size="sm">
                                +{student.enrolledCourses.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <ProgressBar value={student.overallProgress} size="sm" className="w-20" />
                            <span className="text-sm text-gray-600">{student.overallProgress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatLastActive(student.lastActiveAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <EmptyState
              icon={Users}
              title={enrolledSearch ? 'No students found' : 'No enrolled students'}
              description={enrolledSearch ? 'Try adjusting your search' : 'Students enrolled in your courses will appear here'}
            />
          )}
        </div>
      )}
      
      {/* Not Enrolled Tab */}
      {schoolTab === 'not-enrolled' && (
        <div className="space-y-4">
          <Card>
            <Card.Body>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:w-auto">
                  <SearchBar
                    value={nonEnrolledSearch}
                    onChange={setNonEnrolledSearch}
                    placeholder="Search by name or email..."
                  />
                </div>
                {selectedStudents.size > 0 && (
                  <Button
                    onClick={() => handleOpenEnrollModal()}
                    leftIcon={<UserPlus className="w-4 h-4" />}
                  >
                    Enroll {selectedStudents.size} Student{selectedStudents.size > 1 ? 's' : ''}
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
          
          {nonEnrolledLoading ? (
            <Skeleton className="h-96" />
          ) : nonEnrolledStudents && nonEnrolledStudents.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 w-10">
                        <Checkbox
                          checked={selectedStudents.size === nonEnrolledStudents.length && nonEnrolledStudents.length > 0}
                          onChange={() => toggleSelectAll(nonEnrolledStudents)}
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {nonEnrolledStudents.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={selectedStudents.has(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.name} size="sm" />
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenEnrollModal(student)
                            }}
                            leftIcon={<UserPlus className="w-4 h-4" />}
                          >
                            Enroll
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <EmptyState
              icon={Users}
              title={nonEnrolledSearch ? 'No students found' : 'All students enrolled'}
              description={nonEnrolledSearch ? 'Try adjusting your search' : 'All students in your school are enrolled in at least one of your courses'}
            />
          )}
        </div>
      )}
      
      {/* Enroll Modal */}
      <EnrollStudentModal
        isOpen={enrollModalOpen}
        onClose={() => {
          setEnrollModalOpen(false)
          setStudentToEnroll(null)
        }}
        onEnroll={handleEnroll}
        courses={courses || []}
        studentName={studentToEnroll?.name || ''}
        studentCount={studentToEnroll ? 1 : selectedStudents.size}
        loading={enrollStudents.isPending}
      />
      
      {/* Student Detail Modal */}
      <Modal
        isOpen={studentDetailOpen}
        onClose={() => setStudentDetailOpen(false)}
        title="Student Progress"
        size="lg"
      >
        {selectedEnrolledStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedEnrolledStudent.name} size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedEnrolledStudent.name}</h3>
                <p className="text-gray-500">{selectedEnrolledStudent.email}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Course Progress</h4>
              <div className="space-y-3">
                {selectedEnrolledStudent.enrolledCourses.map(course => (
                  <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <span className="text-sm text-gray-600">{course.progress}%</span>
                    </div>
                    <ProgressBar value={course.progress} size="sm" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setStudentDetailOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
