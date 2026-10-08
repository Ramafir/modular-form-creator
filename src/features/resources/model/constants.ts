// Allowed values mirror the backend validation in backend/src/modules/resources/resource.service.ts.

export const RESOURCE_STATUSES = ['draft', 'completed'] as const

export const SORT_ORDERS = ['desc', 'asc'] as const

export const PRIORITIES = ['low', 'medium', 'high'] as const

export const CATEGORIES = ['internal', 'external', 'vendor'] as const

export const TEAM_MEMBERS = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const
