import { Badge } from '../../../components/ui'
import type { CourseStatus } from '../../../types'

const statusConfig: Record<CourseStatus, { label: string; variant: 'gray' | 'warning' | 'success' | 'danger' }> = {
  draft: { label: 'Draft', variant: 'gray' },
  pending: { label: 'Pending Review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
}

interface CourseStatusBadgeProps {
  status: CourseStatus
}

function CourseStatusBadge({ status }: CourseStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant} dot>{config.label}</Badge>
}

export default CourseStatusBadge
