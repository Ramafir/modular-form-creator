import { Badge, type BadgeVariant } from '../../../design-system'
import type { ModuleState } from '../model/modules'

const STATE_BADGES: Record<ModuleState, { label: string; variant: BadgeVariant }> = {
  completed: { label: 'Completed', variant: 'success' },
  notStarted: { label: 'Not started', variant: 'info' },
  locked: { label: 'Locked', variant: 'neutral' },
}

interface ModuleStateBadgeProps {
  state: ModuleState
}

export function ModuleStateBadge({ state }: ModuleStateBadgeProps) {
  const { label, variant } = STATE_BADGES[state]
  return <Badge variant={variant}>{label}</Badge>
}
