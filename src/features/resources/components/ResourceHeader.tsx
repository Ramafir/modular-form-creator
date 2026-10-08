import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { formatDateTime } from '../../../shared/lib/formatDate'
import { PageHeader } from '../../../shared/ui/PageHeader'
import { TextLink } from '../../../shared/ui/TextLink'
import type { Resource } from '../model/types'
import { resourcePaths } from '../paths'
import { ResourceStatusBadge } from './ResourceStatusBadge'

interface ResourceHeaderProps {
  resource: Resource
}

export function ResourceHeader({ resource }: ResourceHeaderProps) {
  const { resourceId, createdAt, updatedAt } = resource

  return (
    <Wrapper>
      <TextLink to={resourcePaths.list}>
        <span aria-hidden="true">← </span>All resources
      </TextLink>
      <PageHeader
        title={resource.name}
        badge={<ResourceStatusBadge status={resource.status} />}
        description={`#${resourceId} · Created ${formatDateTime(createdAt)} · Updated ${formatDateTime(updatedAt)}`}
      />
      <Tabs aria-label="Resource sections">
        <Tab to={resourcePaths.overview(resourceId)} end>
          Overview
        </Tab>
        <Tab to={resourcePaths.details(resourceId)}>Details</Tab>
      </Tabs>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`

const Tabs = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Tab = styled(NavLink)`
  margin-bottom: -1px;
  padding-block: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid transparent;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.inkStrong};
  }

  &[aria-current='page'] {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryStrong};
  }
`
