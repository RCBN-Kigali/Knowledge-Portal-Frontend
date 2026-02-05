import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import type { EnrollmentRequest } from '../../../types'
import { User, Mail, School, Calendar } from 'lucide-react'

export interface EnrollmentRequestCardProps {
  request: EnrollmentRequest
  onApprove: () => void
  onReject: () => void
  loading?: boolean
}

function EnrollmentRequestCard({ request, onApprove, onReject, loading }: EnrollmentRequestCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }
  
  const isPending = request.status === 'pending'
  
  return (
    <Card>
      <Card.Body>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-900">{request.studentName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>{request.studentEmail}</span>
            </div>
            {request.studentSchool && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <School className="w-4 h-4" />
                <span>{request.studentSchool}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Requested: {formatDate(request.requestedAt)}</span>
            </div>
            <div className="mt-2">
              <Badge variant="primary" size="sm">{request.courseName}</Badge>
            </div>
          </div>
          
          {isPending ? (
            <div className="flex gap-2 sm:flex-col">
              <Button
                size="sm"
                onClick={onApprove}
                loading={loading}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={onReject}
                disabled={loading}
              >
                Reject
              </Button>
            </div>
          ) : (
            <Badge variant={request.status === 'approved' ? 'success' : 'danger'}>
              {request.status === 'approved' ? 'Approved' : 'Rejected'}
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default EnrollmentRequestCard
