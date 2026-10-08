import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card } from '../../../design-system'
import { getModuleState, type ResourceModule } from '../model/modules'
import type { ModuleKey, Resource } from '../model/types'
import { resourcePaths } from '../paths'
import { ModuleStateBadge } from './ModuleStateBadge'

const MODULE_COPY: Record<ModuleKey, { description: string; lockedHint?: string }> = {
  basicInfo: {
    description: 'Owner, contact email, description and priority.',
  },
  projectDetails: {
    description: 'Project name, budget, category and team members.',
    lockedHint: 'Complete Basic Info first',
  },
}

interface ModuleCardProps {
  resource: Resource
  module: ResourceModule
}

export function ModuleCard({ resource, module }: ModuleCardProps) {
  const navigate = useNavigate()
  const state = getModuleState(resource, module)
  const { description, lockedHint = 'Locked' } = MODULE_COPY[module.key]

  return (
    <Card variant="elevated">
      <Header>
        <h3>{module.title}</h3>
        <ModuleStateBadge state={state} />
      </Header>
      <Description>{description}</Description>
      <div>
        {state === 'locked' ? (
          <Button type="button" state="locked">
            {lockedHint}
          </Button>
        ) : (
          <Button
            type="button"
            variant={state === 'completed' ? 'secondary' : 'primary'}
            onClick={() =>
              navigate(resourcePaths.module(resource.resourceId, module.key))
            }
          >
            {state === 'completed' ? 'Edit' : 'Start'}
          </Button>
        )}
      </div>
    </Card>
  )
}

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`
