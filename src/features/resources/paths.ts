type ResourceIdParam = number | string

const overview = (resourceId: ResourceIdParam) => `/resources/${resourceId}`

export const resourcePaths = {
  list: '/resources',
  overview,
  details: (resourceId: ResourceIdParam) => `${overview(resourceId)}/details`,
  basicInfo: (resourceId: ResourceIdParam) => `${overview(resourceId)}/basic-info`,
  projectDetails: (resourceId: ResourceIdParam) =>
    `${overview(resourceId)}/project-details`,
}
