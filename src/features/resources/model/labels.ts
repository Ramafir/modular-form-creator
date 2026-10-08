import type {
  BasicInfo,
  Category,
  Priority,
  ProjectDetails,
  ResourceStatus,
} from './types'

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
  draft: 'Draft',
  completed: 'Completed',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  internal: 'Internal',
  external: 'External',
  vendor: 'Vendor',
}

// Shared by the module forms and the details summary.
export const BASIC_INFO_FIELD_LABELS: Record<keyof BasicInfo, string> = {
  resourceName: 'Resource name',
  owner: 'Owner',
  email: 'Email',
  description: 'Description',
  priority: 'Priority',
}

export const PROJECT_DETAILS_FIELD_LABELS: Record<keyof ProjectDetails, string> = {
  projectName: 'Project name',
  budget: 'Budget',
  category: 'Category',
  options: 'Team members',
}
