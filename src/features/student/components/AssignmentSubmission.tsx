import { useState } from 'react'
import { Send, FileText } from 'lucide-react'
import { Button, Textarea, Alert, Badge, Card } from '../../../components/ui'
import type { Assignment, AssignmentSubmission as SubmissionType } from '../../../types'

interface AssignmentSubmissionProps {
  assignment: Assignment
  existingSubmission?: SubmissionType
  onSubmit: (data: { text?: string; file?: File }) => void
  isSubmitting: boolean
}

function AssignmentSubmission({ assignment, existingSubmission, onSubmit, isSubmitting }: AssignmentSubmissionProps) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  if (existingSubmission) {
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Your Submission</h4>
            <Badge
              variant={existingSubmission.status === 'graded' ? 'success' : existingSubmission.status === 'returned' ? 'warning' : 'primary'}
              dot
            >
              {existingSubmission.status}
            </Badge>
          </div>
          {existingSubmission.text && (
            <p className="text-sm text-gray-600 mb-2">{existingSubmission.text}</p>
          )}
          {existingSubmission.fileName && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText className="w-4 h-4" />
              {existingSubmission.fileName}
            </div>
          )}
          {existingSubmission.status === 'graded' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                Grade: {existingSubmission.score}/{assignment.maxScore}
              </p>
              {existingSubmission.feedback && (
                <p className="text-sm text-gray-600 mt-1">{existingSubmission.feedback}</p>
              )}
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: assignment.instructions }} />

      {assignment.dueDate && (
        <Alert variant="info">Due: {new Date(assignment.dueDate).toLocaleDateString()}</Alert>
      )}

      {assignment.allowTextSubmission && (
        <Textarea
          label="Your Answer"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          placeholder="Type your answer here..."
        />
      )}

      {assignment.allowFileUpload && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attach File</label>
          <input
            type="file"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>
      )}

      <Button
        onClick={() => onSubmit({ text: text || undefined, file: file || undefined })}
        loading={isSubmitting}
        disabled={!text && !file}
        leftIcon={<Send className="w-4 h-4" />}
      >
        Submit Assignment
      </Button>
    </div>
  )
}

export default AssignmentSubmission
