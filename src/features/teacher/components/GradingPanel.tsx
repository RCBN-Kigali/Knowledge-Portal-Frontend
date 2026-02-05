import { useState } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Textarea from '../../../components/ui/Textarea'
import Input from '../../../components/ui/Input'
import Badge from '../../../components/ui/Badge'
import type { Submission } from '../../../types'
import { Download, FileText } from 'lucide-react'

export interface GradingPanelProps {
  submission: Submission
  onGrade: (score: number, feedback?: string) => void
  loading?: boolean
}

function GradingPanel({ submission, onGrade, loading }: GradingPanelProps) {
  const [score, setScore] = useState(submission.score?.toString() || '')
  const [feedback, setFeedback] = useState(submission.feedback || '')
  
  const isGraded = submission.status === 'graded'
  
  const handleSubmit = () => {
    const numScore = parseFloat(score)
    if (isNaN(numScore) || numScore < 0 || numScore > submission.maxScore) return
    onGrade(numScore, feedback || undefined)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  return (
    <Card>
      <Card.Header>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{submission.studentName}</h2>
            <p className="text-sm text-gray-500">{submission.assignmentTitle}</p>
          </div>
          <Badge variant={isGraded ? 'success' : 'warning'}>
            {isGraded ? 'Graded' : 'Pending'}
          </Badge>
        </div>
      </Card.Header>
      
      <Card.Body className="space-y-6">
        {/* Submission Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Submitted:</span>
            <p className="font-medium">{formatDate(submission.submittedAt)}</p>
          </div>
          <div>
            <span className="text-gray-500">Course:</span>
            <p className="font-medium">{submission.courseName}</p>
          </div>
        </div>
        
        {/* Submission Content */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Submission Content</h3>
          {submission.text ? (
            <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-wrap">
              {submission.text}
            </div>
          ) : submission.fileUrl ? (
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
              <FileText className="w-8 h-8 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{submission.fileName || 'Attached File'}</p>
              </div>
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          ) : (
            <p className="text-gray-500 italic">No content submitted</p>
          )}
        </div>
        
        {/* Grading Form */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Grade Submission</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Score (out of {submission.maxScore})
              </label>
              <Input
                type="number"
                min={0}
                max={submission.maxScore}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder={`0 - ${submission.maxScore}`}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Feedback (optional)
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback for the student..."
                rows={4}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={!score || loading}
              >
                {isGraded ? 'Update Grade' : 'Submit Grade'}
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default GradingPanel
