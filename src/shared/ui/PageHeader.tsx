import type { ReactNode } from 'react'
import styled from 'styled-components'

interface PageHeaderProps {
  title: string
  /** Rendered next to the title, e.g. a status badge. */
  badge?: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, badge, description, actions }: PageHeaderProps) {
  return (
    <Header>
      <div>
        <TitleRow>
          <h1>{title}</h1>
          {badge}
        </TitleRow>
        {description ? <Description>{description}</Description> : null}
      </div>
      {actions ? <Actions>{actions}</Actions> : null}
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Description = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`
