import type { ResourceId } from './model/types'

const overview = (resourceId: ResourceId) => `/resources/${resourceId}`

export const resourcePaths = {
  list: '/resources',
  overview,
  details: (resourceId: ResourceId) => `${overview(resourceId)}/details`,
  basicInfo: (resourceId: ResourceId) => `${overview(resourceId)}/basic-info`,
  projectDetails: (resourceId: ResourceId) => `${overview(resourceId)}/project-details`,
}
