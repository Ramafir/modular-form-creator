import type { FormEventHandler, ReactNode } from 'react'
import styled from 'styled-components'
import { Button, Card } from '../../../design-system'
import { Alert } from '../../../shared/ui/Alert'
import type { ResourceModule } from '../model/modules'

interface ModuleFormShellProps {
  module: ResourceModule
  submitLabel: string
  isSubmitting: boolean
  error?: string
  onSubmit: FormEventHandler<HTMLFormElement>
  onCancel: () => void
  children: ReactNode
}

/** Shared frame of the module forms: heading, fields, submit error and actions. */
export function ModuleFormShell({
  module,
  submitLabel,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
  children,
}: ModuleFormShellProps) {
  return (
    <FormCard>
      <div>
        <h2>{module.title}</h2>
        <Description>{module.description}</Description>
      </div>
      <Form onSubmit={onSubmit} noValidate>
        {children}
        {error ? <Alert title="Changes could not be saved">{error}</Alert> : null}
        <Actions>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : submitLabel}
          </Button>
        </Actions>
      </Form>
    </FormCard>
  )
}

const FormCard = styled(Card)`
  max-width: 720px;
`

const Description = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`
