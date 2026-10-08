import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  ModuleKey,
  Resource,
  ResourceId,
  ResourceModules,
  ResourceReplacePayload,
} from '../model/types'
import { resourceKeys, resourceQueries } from './resourceQueries'
import { resourcesApi } from './resourcesApi'

/**
 * Every mutation responds with the full resource, so its detail cache is written
 * directly and only the lists are refetched.
 */
function useResourceCache() {
  const queryClient = useQueryClient()
  const refreshLists = () =>
    queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })

  return {
    refreshLists,
    store: (resource: Resource) => {
      queryClient.setQueryData(
        resourceQueries.detail(resource.resourceId).queryKey,
        resource,
      )
      return refreshLists()
    },
    evict: (resource: Resource) => {
      queryClient.removeQueries({
        queryKey: resourceQueries.detail(resource.resourceId).queryKey,
      })
      return refreshLists()
    },
    /** Resyncs after a rejected update, e.g. when the resource changed in another tab. */
    refresh: (resourceId: ResourceId) =>
      queryClient.invalidateQueries({
        queryKey: resourceQueries.detail(resourceId).queryKey,
      }),
  }
}

export function useCreateResource() {
  const cache = useResourceCache()
  return useMutation({ mutationFn: resourcesApi.create, onSuccess: cache.store })
}

export function useDeleteResource() {
  const cache = useResourceCache()
  return useMutation({
    mutationFn: resourcesApi.remove,
    onSuccess: cache.evict,
    onError: cache.refreshLists,
  })
}

/** Correlates `moduleKey` with its data shape, e.g. `basicInfo` -> `BasicInfo`. */
type UpdateModuleVariables = {
  [K in ModuleKey]: { resourceId: ResourceId; moduleKey: K; data: ResourceModules[K] }
}[ModuleKey]

export function useUpdateModule() {
  const cache = useResourceCache()
  return useMutation({
    mutationFn: ({ resourceId, moduleKey, data }: UpdateModuleVariables) =>
      resourcesApi.updateModule(resourceId, moduleKey, data),
    onSuccess: cache.store,
    onError: (_error, { resourceId }) => cache.refresh(resourceId),
  })
}

export function useProvisionResource() {
  const cache = useResourceCache()
  return useMutation({
    mutationFn: resourcesApi.provision,
    onSuccess: cache.store,
    onError: (_error, resourceId) => cache.refresh(resourceId),
  })
}

interface ReplaceResourceVariables {
  resourceId: ResourceId
  payload: ResourceReplacePayload
}

export function useReplaceResource() {
  const cache = useResourceCache()
  return useMutation({
    mutationFn: ({ resourceId, payload }: ReplaceResourceVariables) =>
      resourcesApi.replace(resourceId, payload),
    onSuccess: cache.store,
    onError: (_error, { resourceId }) => cache.refresh(resourceId),
  })
}
