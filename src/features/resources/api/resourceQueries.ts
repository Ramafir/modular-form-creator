import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { ResourceId, ResourceListParams } from '../model/types'
import { resourcesApi } from './resourcesApi'

export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (params: ResourceListParams) => [...resourceKeys.lists(), params] as const,
  detail: (resourceId: ResourceId) =>
    [...resourceKeys.all, 'detail', String(resourceId)] as const,
}

export const resourceQueries = {
  list: (params: ResourceListParams) =>
    queryOptions({
      queryKey: resourceKeys.list(params),
      queryFn: ({ signal }) => resourcesApi.list(params, signal),
      // Keeps the current page on screen while the next page or filter loads.
      placeholderData: keepPreviousData,
    }),

  detail: (resourceId: ResourceId) =>
    queryOptions({
      queryKey: resourceKeys.detail(resourceId),
      queryFn: ({ signal }) => resourcesApi.get(resourceId, signal),
    }),
}
