import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Checkbox from '../../../components/ui/Checkbox'
import type { TeacherCourse } from '../../../types'

interface EnrollStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onEnroll: (courseIds: string[]) => Promise<void>
  courses: TeacherCourse[]
  studentName: string
  studentCount?: number
  loading?: boolean
}

function EnrollStudentModal({
  isOpen,
  onClose,
  onEnroll,
  courses,
  studentName,
  studentCount = 1,
  loading,
}: EnrollStudentModalProps) {
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  
  const toggleCourse = (courseId: string) => {
    const newSelected = new Set(selectedCourses)
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId)
    } else {
      newSelected.add(courseId)
    }
    setSelectedCourses(newSelected)
  }
  
  const handleEnroll = async () => {
    if (selectedCourses.size === 0) return
    await onEnroll(Array.from(selectedCourses))
    setSelectedCourses(new Set())
  }
  
  const handleClose = () => {
    setSelectedCourses(new Set())
    onClose()
  }
  
  const approvedCourses = courses.filter(c => c.status === 'approved')
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={studentCount > 1 ? `Enroll ${studentCount} Students` : `Enroll ${studentName}`}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          {studentCount > 1
            ? `Select which courses to enroll these ${studentCount} students in.`
            : 'Select which courses to enroll this student in.'}
        </p>
        
        {approvedCourses.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {approvedCourses.map(course => (
              <label
                key={course.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedCourses.has(course.id)}
                  onChange={() => toggleCourse(course.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{course.title}</p>
                  <p className="text-sm text-gray-500">
                    {course.studentCount} students enrolled
                  </p>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No approved courses available.</p>
            <p className="text-sm mt-1">Create and get a course approved first.</p>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={selectedCourses.size === 0}
            loading={loading}
          >
            Enroll in {selectedCourses.size} Course{selectedCourses.size !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default EnrollStudentModal
