import { useState } from 'react'
import styled from 'styled-components'
import { Button, Drawer } from '../../../design-system'
import { Alert } from '../../../shared/ui/Alert'
import { InlineConfirmation } from '../../../shared/ui/InlineConfirmation'
import { VisuallyHidden } from '../../../shared/ui/VisuallyHidden'
import { useReplaceResource } from '../api/resourceMutations'
import type { FieldValue } from '../model/moduleFields'
import { buildReplacePayload } from '../model/pendingChanges'
import type { Resource } from '../model/types'
import { usePendingChanges } from '../pending-changes/usePendingChanges'

const formatValue = (value: FieldValue) =>
  typeof value === 'string' ? value : value.join(', ')

interface PendingChangesDrawerProps {
  resource: Resource
  isOpen: boolean
  onClose: () => void
}

/** Shows the buffered edits as a diff and persists them with one full update. */
export function PendingChangesDrawer({
  resource,
  isOpen,
  onClose,
}: PendingChangesDrawerProps) {
  const { changes, moduleChanges, discard } = usePendingChanges(resource)
  const replaceResource = useReplaceResource()
  const [isConfirmingDiscard, setIsConfirmingDiscard] = useState(false)

  const close = () => {
    setIsConfirmingDiscard(false)
    replaceResource.reset()
    onClose()
  }

  const finish = () => {
    discard()
    close()
  }

  const submit = () =>
    replaceResource.mutate(
      {
        resourceId: resource.resourceId,
        payload: buildReplacePayload(resource, changes),
      },
      { onSuccess: finish },
    )

  return (
    // `inert` keeps the closed drawer out of the tab order and the accessibility tree.
    <div inert={!isOpen}>
      <Drawer title="Review changes" isOpen={isOpen} onClose={close}>
        <Intro>
          Submitting replaces the saved data of {resource.name} in one update.
        </Intro>
        {moduleChanges.map(({ module, fields }) => (
          <section key={module.key}>
            <h3>{module.title}</h3>
            <ChangeList>
              {fields.map(({ key, label, before, after }) => (
                <li key={key}>
                  <FieldLabel>{label}</FieldLabel>
                  <Before>
                    <VisuallyHidden>Before: </VisuallyHidden>
                    {formatValue(before)}
                  </Before>
                  <After>
                    <VisuallyHidden>After: </VisuallyHidden>
                    {formatValue(after)}
                  </After>
                </li>
              ))}
            </ChangeList>
          </section>
        ))}
        {replaceResource.error ? (
          <Alert title="Changes could not be submitted">
            {replaceResource.error.message}
          </Alert>
        ) : null}
        <Actions>
          {isConfirmingDiscard ? (
            <InlineConfirmation
              message="Discard all changes?"
              confirmLabel="Discard"
              onConfirm={finish}
              onCancel={() => setIsConfirmingDiscard(false)}
            />
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={replaceResource.isPending}
                onClick={() => setIsConfirmingDiscard(true)}
              >
                Discard changes
              </Button>
              <Button type="button" disabled={replaceResource.isPending} onClick={submit}>
                {replaceResource.isPending ? 'Submitting…' : 'Submit changes'}
              </Button>
            </>
          )}
        </Actions>
      </Drawer>
    </div>
  )
}

const Intro = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`

const ChangeList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  padding: 0;
  list-style: none;
`

const FieldLabel = styled.span`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const Before = styled.del`
  display: block;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.inkMuted};
`

const After = styled.ins`
  display: block;
  white-space: pre-line;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.inkStrong};
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`
