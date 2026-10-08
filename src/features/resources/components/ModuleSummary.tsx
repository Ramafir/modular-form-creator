import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Badge, Card } from '../../../design-system'
import { formatInteger } from '../../../shared/lib/formatNumber'
import {
  BASIC_INFO_FIELD_LABELS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  PROJECT_DETAILS_FIELD_LABELS,
} from '../model/labels'
import { getModuleState, type ResourceModule } from '../model/modules'
import type { ModuleKey, Resource } from '../model/types'
import { ModuleStateBadge } from './ModuleStateBadge'

interface SummaryItem {
  label: string
  /** Falsy values are rendered as "Not provided". */
  value: ReactNode
}

const SUMMARY_ITEMS: Record<ModuleKey, (resource: Resource) => SummaryItem[]> = {
  basicInfo: ({ basicInfo }) => [
    { label: BASIC_INFO_FIELD_LABELS.resourceName, value: basicInfo.resourceName },
    { label: BASIC_INFO_FIELD_LABELS.owner, value: basicInfo.owner },
    { label: BASIC_INFO_FIELD_LABELS.email, value: basicInfo.email },
    {
      label: BASIC_INFO_FIELD_LABELS.priority,
      value: basicInfo.priority && PRIORITY_LABELS[basicInfo.priority],
    },
    {
      label: BASIC_INFO_FIELD_LABELS.description,
      value: basicInfo.description && <Multiline>{basicInfo.description}</Multiline>,
    },
  ],
  projectDetails: ({ projectDetails }) => [
    {
      label: PROJECT_DETAILS_FIELD_LABELS.projectName,
      value: projectDetails.projectName,
    },
    {
      label: PROJECT_DETAILS_FIELD_LABELS.budget,
      value: projectDetails.budget && formatInteger(projectDetails.budget),
    },
    {
      label: PROJECT_DETAILS_FIELD_LABELS.category,
      value: projectDetails.category && CATEGORY_LABELS[projectDetails.category],
    },
    {
      label: PROJECT_DETAILS_FIELD_LABELS.options,
      value: projectDetails.options.length > 0 && (
        <TeamMembers>
          {projectDetails.options.map((member) => (
            <Badge key={member}>{member}</Badge>
          ))}
        </TeamMembers>
      ),
    },
  ],
}

interface ModuleSummaryProps {
  resource: Resource
  module: ResourceModule
}

export function ModuleSummary({ resource, module }: ModuleSummaryProps) {
  return (
    <Card>
      <Header>
        <h2>{module.title}</h2>
        <ModuleStateBadge state={getModuleState(resource, module)} />
      </Header>
      <List>
        {SUMMARY_ITEMS[module.key](resource).map(({ label, value }) => (
          <Row key={label}>
            <dt>{label}</dt>
            <dd>{value || <NotProvided>Not provided</NotProvided>}</dd>
          </Row>
        ))}
      </List>
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

const List = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(120px, 200px) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  dt {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.inkMuted};
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.colors.inkStrong};
  }

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

const Multiline = styled.span`
  white-space: pre-line;
`

const TeamMembers = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`

const NotProvided = styled.span`
  font-style: italic;
  color: ${({ theme }) => theme.colors.inkMuted};
`
