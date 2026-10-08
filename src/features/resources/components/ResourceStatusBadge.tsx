import { Badge, type BadgeVariant } from '../../../design-system'
import { RESOURCE_STATUS_LABELS } from '../model/labels'
import type { ResourceStatus } from '../model/types'

const STATUS_VARIANTS: Record<ResourceStatus, BadgeVariant> = {
  draft: 'info',
  completed: 'success',
}

interface ResourceStatusBadgeProps {
  status: ResourceStatus
}

export function ResourceStatusBadge({ status }: ResourceStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANTS[status]}>{RESOURCE_STATUS_LABELS[status]}</Badge>
}
