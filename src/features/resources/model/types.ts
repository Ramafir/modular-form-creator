import type { CATEGORIES, PRIORITIES, RESOURCE_STATUSES, TEAM_MEMBERS } from './constants'

export type ResourceStatus = (typeof RESOURCE_STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]
export type Category = (typeof CATEGORIES)[number]
export type TeamMember = (typeof TEAM_MEMBERS)[number]
export type SortOrder = 'asc' | 'desc'

/** Numeric `resourceId`: a number in API data, a string when read from the URL. */
export type ResourceId = number | string

// Module fields are empty strings until the module is saved for the first time.
export interface BasicInfo {
  resourceName: string
  owner: string
  email: string
  description: string
  priority: Priority | ''
}

export interface ProjectDetails {
  projectName: string
  budget: string
  category: Category | ''
  options: TeamMember[]
}

export interface ResourceModules {
  basicInfo: BasicInfo
  projectDetails: ProjectDetails
}

export type ModuleKey = keyof ResourceModules

export interface Resource extends ResourceModules {
  _id: string
  resourceId: number
  name: string
  status: ResourceStatus
  createdAt: string
  updatedAt: string
}

export interface ResourceListParams {
  page?: number
  pageSize?: number
  status?: ResourceStatus
  name?: string
  sortOrder?: SortOrder
}

export interface ResourceListResponse {
  items: Resource[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

/** Body of `PUT /api/resources/{id}`; status can only change through provisioning. */
export type ResourceReplacePayload = Pick<
  Resource,
  'name' | 'basicInfo' | 'projectDetails'
>
