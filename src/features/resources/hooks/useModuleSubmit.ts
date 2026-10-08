import { useNavigate } from 'react-router-dom'
import { useUpdateModule } from '../api/resourceMutations'
import type { ModuleUpdate, Resource } from '../model/types'
import { resourcePaths } from '../paths'

/** Saves a module form of a draft resource and returns to the overview. */
export function useModuleSubmit(resource: Resource) {
  const navigate = useNavigate()
  const updateModule = useUpdateModule()

  const submit = (update: ModuleUpdate) =>
    updateModule.mutate(
      { resourceId: resource.resourceId, ...update },
      { onSuccess: () => navigate(resourcePaths.overview(resource.resourceId)) },
    )

  return {
    submit,
    isSubmitting: updateModule.isPending,
    error: updateModule.error?.message,
  }
}
