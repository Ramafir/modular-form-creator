import styled from 'styled-components'
import { Badge, Card } from '../../../design-system'
import { getModuleFields, getModuleUpdate, type FieldValue } from '../model/moduleFields'
import { getModuleState, type ResourceModule } from '../model/modules'
import type { Resource } from '../model/types'
import { ModuleStateBadge } from './ModuleStateBadge'

const renderValue = (value: FieldValue) => {
  if (value.length === 0) return <NotProvided>Not provided</NotProvided>
  if (typeof value === 'string') return value
  return (
    <Tags>
      {value.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </Tags>
  )
}

interface ModuleSummaryProps {
  resource: Resource
  module: ResourceModule
}

export function ModuleSummary({ resource, module }: ModuleSummaryProps) {
  const fields = getModuleFields(getModuleUpdate(resource, module.key))

  return (
    <Card>
      <Header>
        <h2>{module.title}</h2>
        <ModuleStateBadge state={getModuleState(resource, module)} />
      </Header>
      <List>
        {fields.map(({ key, label, display }) => (
          <Row key={key}>
            <dt>{label}</dt>
            <dd>{renderValue(display)}</dd>
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
    white-space: pre-line;
    color: ${({ theme }) => theme.colors.inkStrong};
  }

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

const Tags = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`

const NotProvided = styled.span`
  font-style: italic;
  color: ${({ theme }) => theme.colors.inkMuted};
`
