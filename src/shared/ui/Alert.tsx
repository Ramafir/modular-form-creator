import type { ReactNode } from 'react'
import styled from 'styled-components'

interface AlertProps {
  title: string
  children?: ReactNode
}

/** Inline error message announced to assistive technologies. */
export function Alert({ title, children }: AlertProps) {
  return (
    <Wrapper role="alert">
      <strong>{title}</strong>
      {children ? <span>{children}</span> : null}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(180, 71, 27, 0.35);
  border-left: 4px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: rgba(180, 71, 27, 0.08);
  color: ${({ theme }) => theme.colors.ink};
`
