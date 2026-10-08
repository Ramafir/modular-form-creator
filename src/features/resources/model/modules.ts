import {
  isBasicInfoComplete,
  isProjectDetailsComplete,
  isProjectDetailsLocked,
} from './rules'
import type { ModuleKey, Resource } from './types'

export interface ResourceModule {
  key: ModuleKey
  title: string
  description: string
  isComplete: (resource: Resource) => boolean
  isLocked: (resource: Resource) => boolean
  /** Explains how to unlock the module. */
  lockedHint?: string
}

export const BASIC_INFO_MODULE: ResourceModule = {
  key: 'basicInfo',
  title: 'Basic Info',
  description: 'Owner, contact email, description and priority.',
  isComplete: (resource) => isBasicInfoComplete(resource.basicInfo),
  isLocked: () => false,
}

export const PROJECT_DETAILS_MODULE: ResourceModule = {
  key: 'projectDetails',
  title: 'Project Details',
  description: 'Project name, budget, category and team members.',
  isComplete: (resource) => isProjectDetailsComplete(resource.projectDetails),
  isLocked: isProjectDetailsLocked,
  lockedHint: 'Complete Basic Info first',
}

/** Single source of truth for the modules a resource is built from, in workflow order. */
export const RESOURCE_MODULES: readonly ResourceModule[] = [
  BASIC_INFO_MODULE,
  PROJECT_DETAILS_MODULE,
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
