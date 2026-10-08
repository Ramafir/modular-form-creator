import type { BasicInfo, ProjectDetails, Resource } from './types'

// Completeness checks mirror the backend (resource.service.ts), so the UI never
// offers an action the API would reject.

export const isBasicInfoComplete = (basicInfo: BasicInfo) =>
  Boolean(
    basicInfo.resourceName &&
    basicInfo.owner &&
    basicInfo.email &&
    basicInfo.description &&
    basicInfo.priority,
  )

export const isProjectDetailsComplete = (projectDetails: ProjectDetails) =>
  Boolean(
    projectDetails.projectName &&
    projectDetails.budget &&
    projectDetails.category &&
    projectDetails.options.length > 0,
  )

export const isCompleted = (resource: Resource) => resource.status === 'completed'

/** Project Details is gated behind Basic Info only while the resource is a draft. */
export const isProjectDetailsLocked = (resource: Resource) =>
  !isCompleted(resource) && !isBasicInfoComplete(resource.basicInfo)

/** Provisioning is the only draft -> completed transition and needs both modules complete. */
export const canProvision = (resource: Resource) =>
  !isCompleted(resource) &&
  isBasicInfoComplete(resource.basicInfo) &&
  isProjectDetailsComplete(resource.projectDetails)
