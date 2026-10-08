import type { ResourceStatus } from './types'

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
  draft: 'Draft',
  completed: 'Completed',
}
