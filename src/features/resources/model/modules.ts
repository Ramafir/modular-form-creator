import {
  isBasicInfoComplete,
  isProjectDetailsComplete,
  isProjectDetailsLocked,
} from './rules'
import type { ModuleKey, Resource } from './types'

export interface ResourceModule {
  key: ModuleKey
  title: string
  isComplete: (resource: Resource) => boolean
  isLocked: (resource: Resource) => boolean
}

/** Single source of truth for the modules a resource is built from. */
export const RESOURCE_MODULES: readonly ResourceModule[] = [
  {
    key: 'basicInfo',
    title: 'Basic Info',
    isComplete: (resource) => isBasicInfoComplete(resource.basicInfo),
    isLocked: () => false,
  },
  {
    key: 'projectDetails',
    title: 'Project Details',
    isComplete: (resource) => isProjectDetailsComplete(resource.projectDetails),
    isLocked: isProjectDetailsLocked,
  },
]

export const getModuleProgress = (resource: Resource) => ({
  completed: RESOURCE_MODULES.filter(({ isComplete }) => isComplete(resource)).length,
  total: RESOURCE_MODULES.length,
})

export type ModuleState = 'completed' | 'locked' | 'notStarted'

// Modules are saved as a whole, so an incomplete module has never been saved.
export const getModuleState = (
  resource: Resource,
  { isComplete, isLocked }: ResourceModule,
): ModuleState => {
  if (isComplete(resource)) return 'completed'
  return isLocked(resource) ? 'locked' : 'notStarted'
}
