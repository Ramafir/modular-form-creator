import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'

type AlertVariant = 'error' | 'info'

interface AlertProps {
  title: string
  variant?: AlertVariant
  /** Control rendered next to the message, e.g. a button. */
  action?: ReactNode
  children?: ReactNode
}

/** Inline message; errors are announced immediately, info messages politely. */
export function Alert({ title, variant = 'error', action, children }: AlertProps) {
  return (
    <Wrapper role={variant === 'error' ? 'alert' : 'status'} $variant={variant}>
      <Message>
        <strong>{title}</strong>
        {children ? <span>{children}</span> : null}
      </Message>
      {action}
    </Wrapper>
  )
}

const variantStyles: Record<AlertVariant, ReturnType<typeof css>> = {
  error: css`
    border-color: rgba(180, 71, 27, 0.35);
    border-left-color: ${({ theme }) => theme.colors.warning};
    background: rgba(180, 71, 27, 0.08);
  `,
  info: css`
    border-color: rgba(60, 90, 137, 0.3);
    border-left-color: ${({ theme }) => theme.colors.info};
    background: rgba(60, 90, 137, 0.08);
  `,
}

const Wrapper = styled.div<{ $variant: AlertVariant }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid;
  border-left-width: 4px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.ink};

  ${({ $variant }) => variantStyles[$variant]}
`

const Message = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`
