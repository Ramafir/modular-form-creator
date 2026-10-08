import { request } from '../../../shared/api/httpClient'
import { escapeRegExp } from '../../../shared/lib/escapeRegExp'
import type {
  ModuleKey,
  Resource,
  ResourceId,
  ResourceListParams,
  ResourceListResponse,
  ResourceModules,
  ResourceReplacePayload,
} from '../model/types'

const BASE_PATH = '/api/resources'

const MODULE_ENDPOINTS: Record<ModuleKey, string> = {
  basicInfo: 'basic-info',
  projectDetails: 'project-details',
}

const resourcePath = (resourceId: ResourceId) =>
  `${BASE_PATH}/${encodeURIComponent(resourceId)}`

const toQueryString = ({ name, ...params }: ResourceListParams) => {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) searchParams.set(key, String(value))
  }
  // The backend uses `name` as a raw regular expression; escape it to keep the
  // documented "partial match" semantics (and avoid 500s on input like "(").
  const trimmedName = name?.trim()
  if (trimmedName) searchParams.set('name', escapeRegExp(trimmedName))

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const resourcesApi = {
  list: (params: ResourceListParams, signal?: AbortSignal) =>
    request<ResourceListResponse>(`${BASE_PATH}${toQueryString(params)}`, { signal }),

  get: (resourceId: ResourceId, signal?: AbortSignal) =>
    request<Resource>(resourcePath(resourceId), { signal }),

  create: (resourceName: string) =>
    request<Resource>(BASE_PATH, { method: 'POST', body: { resourceName } }),

  /** Draft-only module update; the backend expects the whole module. */
  updateModule: <K extends ModuleKey>(
    resourceId: ResourceId,
    moduleKey: K,
    data: ResourceModules[K],
  ) =>
    request<Resource>(`${resourcePath(resourceId)}/${MODULE_ENDPOINTS[moduleKey]}`, {
      method: 'PATCH',
      body: data,
    }),

  provision: (resourceId: ResourceId) =>
    request<Resource>(`${resourcePath(resourceId)}/provisioning`, { method: 'PATCH' }),

  /** Completed-only full update. */
  replace: (resourceId: ResourceId, payload: ResourceReplacePayload) =>
    request<Resource>(resourcePath(resourceId), { method: 'PUT', body: payload }),

  remove: (resourceId: ResourceId) =>
    request<Resource>(resourcePath(resourceId), { method: 'DELETE' }),
}
