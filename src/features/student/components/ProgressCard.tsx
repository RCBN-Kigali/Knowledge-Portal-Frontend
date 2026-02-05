import { Card, ProgressBar } from '../../../components/ui'
import type { EnrollmentStatus } from '../../../types'

interface ProgressCardProps {
  courseTitle: string
  progress: number
  grade?: number
  status: EnrollmentStatus
  lastAccessed?: string
}

function ProgressCard({ courseTitle, progress, grade, status, lastAccessed }: ProgressCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900 truncate">{courseTitle}</h4>
        {grade != null && (
          <span className="text-sm font-medium text-primary-600">{grade}%</span>
        )}
      </div>
      <ProgressBar
        value={progress}
        max={100}
        size="sm"
        variant={status === 'completed' ? 'success' : 'primary'}
        showValue
      />
      {lastAccessed && (
        <p className="text-xs text-gray-400 mt-2">
          Last accessed {new Date(lastAccessed).toLocaleDateString()}
        </p>
      )}
    </Card>
  )
}

export default ProgressCard
