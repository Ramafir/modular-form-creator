import type { ModuleKey, ResourceId } from './model/types'

const MODULE_SEGMENTS: Record<ModuleKey, string> = {
  basicInfo: 'basic-info',
  projectDetails: 'project-details',
}

const overview = (resourceId: ResourceId) => `/resources/${resourceId}`

export const resourcePaths = {
  list: '/resources',
  overview,
  details: (resourceId: ResourceId) => `${overview(resourceId)}/details`,
  module: (resourceId: ResourceId, moduleKey: ModuleKey) =>
    `${overview(resourceId)}/${MODULE_SEGMENTS[moduleKey]}`,
}
