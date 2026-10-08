import { useState } from 'react'
import styled from 'styled-components'
import { Button, Card } from '../../../design-system'
import { Alert } from '../../../shared/ui/Alert'
import { InlineConfirmation } from '../../../shared/ui/InlineConfirmation'
import { useProvisionResource } from '../api/resourceMutations'
import { canProvision, isCompleted } from '../model/rules'
import type { Resource } from '../model/types'
import { ModuleProgress } from './ModuleProgress'

const getHint = (resource: Resource) => {
  if (isCompleted(resource)) {
    return 'This resource has been provisioned and cannot be provisioned again.'
  }
  return canProvision(resource)
    ? 'Both modules are complete. Provisioning marks this resource as completed.'
    : 'Complete Basic Info and Project Details to provision this resource.'
}

interface ProvisioningPanelProps {
  resource: Resource
}

export function ProvisioningPanel({ resource }: ProvisioningPanelProps) {
  const provision = useProvisionResource()
  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <Card>
      <Header>
        <h2>Provisioning</h2>
        <ModuleProgress resource={resource} />
      </Header>
      <Hint>{getHint(resource)}</Hint>
      {provision.error ? (
        <Alert title="Provisioning failed">{provision.error.message}</Alert>
      ) : null}
      {isCompleted(resource) ? null : (
        <div>
          {isConfirming ? (
            <InlineConfirmation
              message="Mark this resource as completed? This cannot be undone."
              confirmLabel="Provision"
              pendingLabel="Provisioning…"
              size="medium"
              isPending={provision.isPending}
              onConfirm={() =>
                provision.mutate(resource.resourceId, {
                  onSettled: () => setIsConfirming(false),
                })
              }
              onCancel={() => setIsConfirming(false)}
            />
          ) : (
            <Button
              type="button"
              disabled={!canProvision(resource)}
              onClick={() => setIsConfirming(true)}
            >
              Provision resource
            </Button>
          )}
        </div>
      )}
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

const Hint = styled.p`
  color: ${({ theme }) => theme.colors.inkMuted};
`
