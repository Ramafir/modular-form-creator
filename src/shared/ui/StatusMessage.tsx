import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Card } from '../../design-system'

interface StatusMessageProps {
  title: string
  description?: ReactNode
  action?: ReactNode
}

/** Centered card for empty, error and not-found states. */
export function StatusMessage({ title, description, action }: StatusMessageProps) {
  return (
    <Panel variant="elevated">
      <h2>{title}</h2>
      {description ? <Description>{description}</Description> : null}
      {action}
    </Panel>
  )
}

const Panel = styled(Card)`
  justify-items: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
`

const Description = styled.p`
  max-width: 480px;
  color: ${({ theme }) => theme.colors.inkMuted};
`
