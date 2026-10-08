// Test-only data builders.
import type { BasicInfo, ProjectDetails, Resource } from './types'

export const emptyBasicInfo: BasicInfo = {
  resourceName: 'Alpha',
  owner: '',
  email: '',
  description: '',
  priority: '',
}

export const completeBasicInfo: BasicInfo = {
  resourceName: 'Alpha',
  owner: 'Jane Doe',
  email: 'jane@example.com',
  description: 'Internal tooling resource',
  priority: 'high',
}

export const emptyProjectDetails: ProjectDetails = {
  projectName: '',
  budget: '',
  category: '',
  options: [],
}

export const completeProjectDetails: ProjectDetails = {
  projectName: 'Project X',
  budget: '1000',
  category: 'internal',
  options: ['FE devs'],
}

export const buildResource = (overrides: Partial<Resource> = {}): Resource => ({
  _id: '6ac77eec3287e3ce082e48e0',
  resourceId: 1,
  name: 'Alpha',
  status: 'draft',
  basicInfo: emptyBasicInfo,
  projectDetails: emptyProjectDetails,
  createdAt: '2026-10-08T10:00:00.000Z',
  updatedAt: '2026-10-08T10:00:00.000Z',
  ...overrides,
})
