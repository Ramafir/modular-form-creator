import { useState } from 'react'
import { Button } from '../../../design-system'
import { Alert } from '../../../shared/ui/Alert'
import type { Resource } from '../model/types'
import { usePendingChanges } from '../pending-changes/usePendingChanges'
import { PendingChangesDrawer } from './PendingChangesDrawer'

const listFormat = new Intl.ListFormat('en', { type: 'conjunction' })

interface PendingChangesBannerProps {
  resource: Resource
}

export function PendingChangesBanner({ resource }: PendingChangesBannerProps) {
  const { moduleChanges } = usePendingChanges(resource)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  if (moduleChanges.length === 0) return null

  const moduleTitles = listFormat.format(moduleChanges.map(({ module }) => module.title))

  return (
    <>
      <Alert
        variant="info"
        title={`Unsaved changes in ${moduleTitles}`}
        action={
          <Button type="button" onClick={() => setIsReviewOpen(true)}>
            Review and submit
          </Button>
        }
      >
        They are kept in this browser tab only. Submit them to save, or they are lost on
        refresh.
      </Alert>
      <PendingChangesDrawer
        resource={resource}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </>
  )
}
