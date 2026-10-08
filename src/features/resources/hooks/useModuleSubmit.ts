import { useNavigate } from 'react-router-dom'
import { useUpdateModule } from '../api/resourceMutations'
import { isCompleted } from '../model/rules'
import type { ModuleUpdate, Resource } from '../model/types'
import { resourcePaths } from '../paths'
import { usePendingChangesStore } from '../pending-changes/usePendingChanges'

/**
 * Saves a module form and returns to the overview. Drafts are persisted right away
 * through the module PATCH; completed resources only buffer the edit until it is
 * submitted with one full PUT.
 */
export function useModuleSubmit(resource: Resource) {
  const navigate = useNavigate()
  const updateModule = useUpdateModule()
  const { stage } = usePendingChangesStore()
  const isBuffered = isCompleted(resource)
  const backToOverview = () => navigate(resourcePaths.overview(resource.resourceId))

  const submit = (update: ModuleUpdate) => {
    if (isBuffered) {
      stage(resource, update)
      backToOverview()
      return
    }
    updateModule.mutate(
      { resourceId: resource.resourceId, ...update },
      { onSuccess: backToOverview },
    )
  }

  return {
    submit,
    isBuffered,
    isSubmitting: updateModule.isPending,
    error: updateModule.error?.message,
  }
}
