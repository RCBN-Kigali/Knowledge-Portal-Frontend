import { Badge } from '../../../components/ui'
import type { EnrollmentStatus } from '../../../types'

const statusConfig: Record<EnrollmentStatus | 'none', { label: string; variant: 'gray' | 'primary' | 'success' | 'warning' | 'danger' }> = {
  none: { label: 'Request Enrollment', variant: 'gray' },
  pending: { label: 'Pending Approval', variant: 'warning' },
  approved: { label: 'Enrolled', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
  completed: { label: 'Completed', variant: 'primary' },
}

interface EnrollmentStatusBadgeProps {
  status: EnrollmentStatus | 'none'
}

function EnrollmentStatusBadge({ status }: EnrollmentStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant} dot>{config.label}</Badge>
}

export default EnrollmentStatusBadge
