import styled from 'styled-components'
import { Button, type ButtonSize } from '../../design-system'

interface InlineConfirmationProps {
  message: string
  /** Accessible name of the group; defaults to the message. */
  label?: string
  confirmLabel: string
  /** Shown on the confirm button while an async action runs. */
  pendingLabel?: string
  isPending?: boolean
  size?: ButtonSize
  onConfirm: () => void
  onCancel: () => void
}

/** Second step for destructive or irreversible actions. */
export function InlineConfirmation({
  message,
  label = message,
  confirmLabel,
  pendingLabel = confirmLabel,
  isPending = false,
  size = 'small',
  onConfirm,
  onCancel,
}: InlineConfirmationProps) {
  return (
    <Wrapper
      role="group"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onCancel()
      }}
    >
      <span>{message}</span>
      <Actions>
        <Button
          type="button"
          variant="secondary"
          size={size}
          // Cancel is the safe default for keyboard users.
          autoFocus
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="button" size={size} disabled={isPending} onClick={onConfirm}>
          {isPending ? pendingLabel : confirmLabel}
        </Button>
      </Actions>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Actions = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.sm};
`
